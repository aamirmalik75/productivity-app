<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Goal;
use App\Models\GoalFeedback;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class GoalFeedbackController extends Controller
{
  public function create(Request $request)
  {
    $id = $request->route('id');

    $data = Validator::make($request->all(), [
      'title' => 'required|string',
      'description' => 'required|string',
    ]);

    if ($data->fails())
      return response(['success' => false, 'error' => $data->errors()], 422);

    $goal  = Goal::find($id);
    if (!$goal)
      return response()->json(['success' => false, 'error' => 'Goal Not Found'], 404);
    if ($goal->user_id != Auth::id())
      return response()->json(['success' => false, 'error' => 'unauthorized'], 401);

    $feedback = new GoalFeedback();
    $feedback->title = $request->input('title');
    $feedback->description = $request->input('description');
    $feedback->goal_id = $id;
    $feedback->save();
    return response()->json(['success' => true, 'message' => 'Feedback Created Successfull'], 201);
  }

  public function index(Request $request)
  {
    $id = $request->route('id');
    $goal = Goal::find($id);
    if (!$goal)
      return response()->json(['success' => false, 'error' => 'Goal Not Found'], 404);
    if ($goal->user_id != Auth::id())
      return response()->json(['success' => false, 'error' => 'unauthorized'], 401);

    $feedbacks = GoalFeedback::where('goal_id', $id)->get();
    return response()->json(['success' => true, 'feedbacks' => $feedbacks], 200);
  }

  public function delete(Request $request)
  {
    $id = $request->route('id');
    $feedback = GoalFeedback::find($id);
    if (!$feedback)
      return response()->json(['success' => false, 'error' => "Feedback Not Found"], 404);
    $feedback->delete();
    return response()->json(['success' => true, 'message' => 'Feedback Deleted Successfully'], 200);
  }

  public function update(Request $request)
  {
    $id = $request->route('id');
    $feedbackId = $request->route('feedbackId');

    $data = Validator::make($request->all(), [
      'title' => 'required|string',
      'description' => 'required|string',
    ]);

    if ($data->fails())
      return response(['success' => false, 'error' => $data->errors()], 422);

    $goal  = Goal::find($id);
    if (!$goal)
      return response()->json(['success' => false, 'error' => 'Goal Not Found'], 404);
    if ($goal->user_id != Auth::id())
      return response()->json(['success' => false, 'error' => 'unauthorized'], 401);

    $feedback = GoalFeedback::where('id', $feedbackId)->where('goal_id', $id)->first();
    if (!$feedback)
      return response()->json(['success' => false, 'error' => 'Feedback Not Found'], 404);
    $feedback->fill($request->all());
    $feedback->save();
    return response()->json(['success' => true, 'message' => 'Feedback Updated Successfully'], 200);
  }
}
