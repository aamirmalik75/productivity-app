<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Goal;
use App\Models\User;
use App\Notifications\GoalNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;

class GoalController extends Controller
{
  public function create(Request $request)
  {
    $data = $request->validate([
      'title' => 'required|string',
      'description' => 'required|string',
      'deadline' => 'nullable|date|after_or_equal:today',
      'parent_id' => 'nullable|exists:goals,id',
      'feedback' => 'nullable|string',
      'user_id' => 'required|numeric',
    ]);
    $updatedParents = [];

    if (!isset($data['feedback'])) {
      unset($data['feedback']);
    }
    $goal = Goal::create($data);
    if ($request->has('parent_id')) {
      $goal->updateProgress($goal->parent_id, $updatedParents);
    }
    return response()->json(['success' => true, 'goal' => $goal, 'updatedParents' => $updatedParents], 201);
  }

  public function storeMultiple(Request $request)
  {
    // Validate the incoming data
    $request->validate([
      'goals' => 'required|array',
      'goals.*.user_id' => 'required|integer',
      'goals.*.title' => 'required|string',
      'goals.*.description' => 'required|string',
      'goals.*.status' => 'required|string',
      'goals.*.feedback' => 'nullable|string',
      'goals.*.deadline' => 'required|date',
      'goals.*.progress' => 'required|integer',
      'goals.*.parent_id' => 'nullable|integer',
      'goals.*.created_at' => 'required|date',
      'goals.*.updated_at' => 'required|date',
    ]);

    // Insert the records
    $goals = Goal::insert($request->input('goals'));

    return response()->json([
      'message' => 'Goals inserted successfully',
      'data' => $goals,
    ], 201);
  }

  public function index(Request $request)
  {
    $status = $request->query("status");
    $goals = Goal::where('user_id', Auth::id())
      ->where('status', $status)
      ->get();
    return response()->json(['success' => true, 'goals' => $goals], 200);
  }

  public function getInCompletedGoals()
  {
    $goals = Goal::where('status', 'Incomplete')->where('user_id', Auth::id())->get();
    return response()->json(['success' => true, 'goals' => $goals]);
  }

  public function completeGoal(Request $request)
  {
    $ids = $request->input('selected_goal_ids');
    $updatedParents = [];
    $selectedGoals = Goal::whereIn('id', $ids)->where('user_id', Auth::id())->get();
    foreach ($selectedGoals as $goal) {
      if (!$goal)
        return response()->json(['success' => false, 'error' => 'Goal Not Found'], 404);
      if ($goal->status == "Dead")
        return response()->json(['success' => false, 'error' => 'Selected Goal is dead.'], 400);
      $goal->status = 'Completed';
      $goal->progress = 100;
      $goal->save();
      if ($goal->parent_id != null) {
        $goal->updateProgress($goal->parent_id, $updatedParents);
      }
    }

    return response()->json(['success' => true, 'message' => 'Selected Goals Completed Successfully', 'updatedParents' => $updatedParents], 200);
  }

  public function deleteGoal(Request $request)
  {
    $ids = $request->input('selected_goal_ids');
    $updatedParents = [];
    $selectedGoals = Goal::whereIn('id', $ids)->where('user_id', Auth::id())->get();
    foreach ($selectedGoals as $goal) {
      if (!$goal)
        return response()->json(['success' => false, 'error' => 'Goal Not Found'], 404);
      $goal->deleteWithSubGoals();
      $goal->updateProgress($goal->parent_id, $updatedParents);
    }
    return response()->json(['success' => true, 'message' => 'Selected Goals Deleted Successfully', 'updatedParents' => $updatedParents], 200);
  }

  public function updateGoal(Request $request)
  {
    $id = $request->route('id');
    $data = $request->validate([
      'title' => 'required|string',
      'description' => 'required|string',
      'deadline' => 'nullable|date|after_or_equal:today',
      'parent_id' => 'nullable|exists:goals,id',
      'feedback' => 'nullable|string',
      'user_id' => 'required|numeric',
    ]);

    if (!isset($data['feedback'])) {
      unset($data['feedback']);
    }

    $goal = Goal::find($id);
    if (!$goal)
      return response()->json(['success' => false, 'error' => 'Goal Not Found'], 404);

    $goal->update($data);
    return response()->json(['success' => true, 'message' => 'Goal Updated Successfully', 'goal' => $goal], 200);
  }

  public function feedbackGoal(Request $request)
  {
    $id = $request->route('id');
    $data = $request->validate([
      'feedback' => 'required|string',
    ]);

    $goal = Goal::find($id);
    if (!$goal)
      return response()->json(['success' => false, 'error' => 'Goal Not Found'], 404);
    $goal->feedback = $request->input('feedback');
    $goal->save();
    return response()->json(['success' => true, 'message' => 'Goal feedback added Successfully'], 200);
  }

  public function deadline()
  {
    $today = Carbon::today();

    // Fetch incomplete goals of the authenticated user
    $incompletedGoals = Goal::where('status', 'Incomplete')
      ->where('user_id', Auth::id())
      ->get();

    $filteredGoals = $incompletedGoals->filter(function ($goal) use ($today) {
      // Compare the deadline date with today's date
      return Carbon::parse($goal->deadline)->isSameDay($today);
    });

    return response()->json(['success' => true, 'incompletedGoals' => $filteredGoals], 200);
  }

  public function dead(Request $request)
  {
    $now = $request->query("now");
    $overDueGoals = Goal::where('user_id', Auth::id())
      ->where('status', 'Incomplete')
      ->where('deadline', '<', $now)->get();

    $user = User::find(Auth::id());
    foreach ($overDueGoals as $goal) {
      $goal->status = "Dead";
      $message = 'Oops! Your "' . $goal->title . '" goal is now Dead. You are to late to complete.';
      $user->notify(new GoalNotification($user->name, $message));
      $goal->save();
    }
    return response()->json(['success' => true], 200);
  }

  public function dashBoardData(Request $request)
  {
    $time = $request->query('time');
    $now = Carbon::now();
    $totalGoals = $this->totalGoals($time);
    [$completedTotal, $incompleteTotal, $deadTotal] = $this->completedIncompletedDeadTotalGoals($time);
    $progress = $this->progress($time);
    $goalsWithFeebacks = $this->feedbacks($time);

    return response()
      ->json([
        'success' => true,
        'totalGoals' => $totalGoals,
        'goals' => $goalsWithFeebacks,
        'bar1' => $progress,
        'pie1' => [
          ['id' => 'Completed', 'label' => 'Completed', 'value' => $completedTotal, 'color' => 'hsl(96, 70%, 50%)'],
          ['id' => 'In Completed', 'label' => 'In Completed', 'value' => $incompleteTotal, 'color' => 'hsl(289, 40%, 70%)'],
          ['id' => 'Dead', 'label' => 'Dead', 'value' => $deadTotal, 'color' => 'hsl(340, 70%, 50%)'],
        ]
      ], 200);

  }

  private function progress($time)
  {
    $now = Carbon::now();
    if ($time === '1_week') {
      $startWeek = $now->copy()->startOfWeek();
      $endWeek = $now->copy()->endOfWeek();
      $goalsProgress = Goal::where('user_id', Auth::id())
        ->whereBetween('created_at', [$startWeek, $endWeek])
        ->get()
        ->map(function ($goal) {
          return [
            'title' => $goal->title,
            $goal->title => intval($goal->progress),
          ];
        });
    } else if ($time === '1_month') {
      $startMonth = $now->copy()->startOfMonth();
      $endMonth = $now->copy()->endOfMonth();
      $goalsProgress = Goal::where('user_id', Auth::id())
        ->whereBetween('created_at', [$startMonth, $endMonth])
        ->get()
        ->groupBy(function ($goal) {
          return Carbon::parse($goal->created_at)->weekOfMonth;
        })
        ->map(function ($goals, $week) {
          $sum = 0;
          foreach ($goals as $index => $goal) {
            $sum += $goal->progress;
          }
          return [
            'week' => 'Week ' . $week,
            'Week ' . $week => $sum / $goals->count(),
          ];
        });
    } else if ($time === '1_year') {
      $startYear = $now->copy()->startOfYear();
      $endYear = $now->copy()->endOfYear();
      $goalsProgress = Goal::where('user_id', Auth::id())
        ->whereBetween('created_at', [$startYear, $endYear])
        ->get()
        ->groupBy(function ($goal) {
          return Carbon::parse($goal->created_at)->monthName;
        })
        ->map(function ($goals, $month) {
          $sum = 0;
          foreach ($goals as $index => $goal) {
            $sum += $goal->progress;
          }
          return [
            'month' => $month,
            $month => $sum / $goals->count(),
          ];
        });
    }

    return $goalsProgress;
  }

  private function totalGoals($time)
  {
    $now = Carbon::now();
    if ($time === '1_week') {
      $startWeek = $now->copy()->startOfWeek();
      $endWeek = $now->copy()->endOfWeek();
      $totalGoals = Goal::where('user_id', Auth::id())
        ->whereBetween('created_at', [$startWeek, $endWeek])
        ->count();
    } else if ($time === '1_month') {
      $startMonth = $now->copy()->startOfMonth();
      $endMonth = $now->copy()->endOfMonth();
      $totalGoals = Goal::where('user_id', Auth::id())
        ->whereBetween('created_at', [$startMonth, $endMonth])
        ->count();
    } else if ($time === '1_year') {
      $startYear = $now->copy()->startOfYear();
      $endYear = $now->copy()->endOfYear();
      $totalGoals = Goal::where('user_id', Auth::id())
        ->whereBetween('created_at', [$startYear, $endYear])
        ->count();
    }
    return $totalGoals;
  }

  private function completedIncompletedDeadTotalGoals($time)
  {
    $now = Carbon::now();
    if ($time === '1_week') {
      $startWeek = $now->copy()->startOfWeek();
      $endWeek = $now->copy()->endOfWeek();
      $completedTotal = Goal::where('user_id', Auth::id())
        ->whereBetween('created_at', [$startWeek, $endWeek])
        ->where('status', 'Completed')
        ->count();
      $inCompleteTotal = Goal::where('user_id', Auth::id())
        ->whereBetween('created_at', [$startWeek, $endWeek])
        ->where('status', 'Incomplete')
        ->count();
      $deadTotal = Goal::where('user_id', Auth::id())
        ->whereBetween('created_at', [$startWeek, $endWeek])
        ->where('status', 'Dead')
        ->count();
    } else if ($time === '1_month') {
      $startMonth = $now->copy()->startOfMonth();
      $endMonth = $now->copy()->endOfMonth();
      $completedTotal = Goal::where('user_id', Auth::id())
        ->whereBetween('created_at', [$startMonth, $endMonth])
        ->where('status', 'Completed')
        ->count();
      $inCompleteTotal = Goal::where('user_id', Auth::id())
        ->whereBetween('created_at', [$startMonth, $endMonth])
        ->where('status', 'Incomplete')
        ->count();
      $deadTotal = Goal::where('user_id', Auth::id())
        ->whereBetween('created_at', [$startMonth, $endMonth])
        ->where('status', 'Dead')
        ->count();
    } else if ($time === '1_year') {
      $startYear = $now->copy()->startOfYear();
      $endYear = $now->copy()->endOfYear();
      $completedTotal = Goal::where('user_id', Auth::id())
        ->whereBetween('created_at', [$startYear, $endYear])
        ->where('status', 'Completed')
        ->count();
      $inCompleteTotal = Goal::where('user_id', Auth::id())
        ->whereBetween('created_at', [$startYear, $endYear])
        ->where('status', 'Incomplete')
        ->count();
      $deadTotal = Goal::where('user_id', Auth::id())
        ->whereBetween('created_at', [$startYear, $endYear])
        ->where('status', 'Dead')
        ->count();
    }
    return [$completedTotal, $inCompleteTotal, $deadTotal];
  }

  private function feedbacks($time)
  {
    $now = Carbon::now();
    if ($time === '1_week') {
      $startWeek = $now->copy()->startOfWeek();
      $endWeek = $now->copy()->endOfWeek();
      $feedbacks = Goal::where('user_id', Auth::id())
        ->whereBetween('created_at', [$startWeek, $endWeek])
        ->with('feedback')->get();
    } else if ($time === '1_month') {
      $startMonth = $now->copy()->startOfMonth();
      $endMonth = $now->copy()->endOfMonth();
      $feedbacks = Goal::where('user_id', Auth::id())
        ->whereBetween('created_at', [$startMonth, $endMonth])
        ->with('feedback')->get();
    } else if ($time === '1_year') {
      $startYear = $now->copy()->startOfYear();
      $endYear = $now->copy()->endOfYear();
      $feedbacks = Goal::where('user_id', Auth::id())
        ->whereBetween('created_at', [$startYear, $endYear])
        ->with('feedback')->get();
    }

    return $feedbacks;
  }

}

