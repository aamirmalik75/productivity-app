<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\schedule;
use App\Models\ScheduleTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class ScheduleController extends Controller
{
  public function store(Request $request)
  {
    $schedulesExist = schedule::where('user_id', Auth::id())->whereDate('date', $request->input('date'))->exists();
    if ($schedulesExist)
      return response()->json(['success' => false, 'error' => 'Schedules already exist for today'], 422);
    $id = $request->input('template_id');
    $template = ScheduleTemplate::find($id);
    if (!$template)
      return response()->json(['success' => false, 'error' => 'Schedule Template Not Found'], 404);
    if ($template->user_id != Auth::id())
      return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
    $day = Carbon::parse($request->input('date'))->format('l');
    $week = Carbon::parse($request->input('date'))->weekNumberInMonth;
    $month = Carbon::parse($request->input('date'))->monthName;
    $year = Carbon::parse($request->input('date'))->year;

    foreach ($request->input('schedules') as $scheduleData) {
      $schedule = new schedule([
        'title' => $scheduleData['title'] ? $scheduleData['title'] : "",
        'start' => $scheduleData['start'],
        'end' => $scheduleData['end'],
        'date' => $request->input('date'),
        'day' => $day,
        'week' => $week,
        'month' => $month,
        'year' => $year,
        'user_id' => Auth::id(),
      ]);

      $schedule->template()->associate($template);
      $schedule->save();

    }

    return response()->json(['success' => true, 'message' => 'Schedules Created Successfully!'], 201);
  }

  public function storeMultiple(Request $request)
  {
    // Validate the incoming data
    // $request->validate([
    //   'schedules' => 'required|array',
    //   'schedules.*.id' => 'required|integer',
    //   'schedules.*.user_id' => 'required|integer',
    //   'schedules.*.template_id' => 'required|integer',
    //   'schedules.*.title' => 'required|string',
    //   'schedules.*.date' => 'required|date_format:Y-m-d', // Assuming the date format is YYYY-MM-DD
    //   'schedules.*.start' => 'required|date_format:H:i:s', // Assuming the time format is HH:MM:SS
    //   'schedules.*.end' => 'required|date_format:H:i:s',
    //   'schedules.*.day' => 'required|string',
    //   'schedules.*.week' => 'required|integer',
    //   'schedules.*.month' => 'required|string',
    //   'schedules.*.year' => 'required|integer',
    //   'schedules.*.status' => 'required|string',
    //   'schedules.*.isVerified' => 'required|boolean', // Assuming it should be a boolean value
    //   'schedules.*.created_at' => 'required|date_format:Y-m-d\TH:i:s.u\Z',
    //   'schedules.*.updated_at' => 'required|date_format:Y-m-d\TH:i:s.u\Z',
    // ]);

    // Insert the records
    $schedules = schedule::insert($request->input('schedules'));

    return response()->json([
      'message' => 'Schedules inserted successfully',
      'data' => $schedules,
    ], 201);
  }

  public function index(Request $request)
  {
    $schedules = schedule::where('user_id', Auth::id())->get();
    return response()->json(['success' => true, 'schedules' => $schedules], 200);
  }

  public function update(Request $request)
  {
    $id = $request->route('id');
    $schedule = schedule::find($id);
    if (!$schedule)
      return response()->json(['success' => false, 'error' => 'Schedule Not Found'], 404);
    if ($schedule->user_id != Auth::id())
      return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);

    $schedule->title = $request->input('title');
    $schedule->save();
    return response()->json(['success' => true, 'message' => 'Schedule Updated Successfully!', 'updatedSchedule' => $schedule], 200);
  }

  public function updateAll(Request $request)
  {
    $ids = $request->input('ids');
    foreach ($ids as $id) {
      $schedule = schedule::find($id);
      if (!$schedule)
        return response()->json(['success' => false, 'error' => 'Schedule Not Found'], 404);
      if ($schedule->user_id != Auth::id())
        return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);

      $schedule->title = $request->input('title');
      $schedule->save();
    }
    return response()->json(['success' => true, 'message' => 'Schedule Updated Successfully!'], 200);
  }

  public function status(Request $request)
  {
    $ids = $request->input('ids');
    foreach ($ids as $id) {
      $schedule = schedule::find($id);
      if (!$schedule)
        return response()->json(['success' => false, 'error' => 'Schedule Not Found'], 404);
      if ($schedule->user_id != Auth::id())
        return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);

      $schedule->status = 'complete';
      $schedule->save();
    }
    return response()->json(['success' => true, 'message' => 'Good you complete your task Successfully!'], 200);
  }

  public function completeVerify(Request $request)
  {
    $ids = $request->input('ids');
    foreach ($ids as $id) {
      $schedule = schedule::find($id);
      if (!$schedule)
        return response()->json(['success' => false, 'error' => 'Schedule Not Found'], 404);
      if ($schedule->user_id != Auth::id())
        return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
      $schedule->status = 'complete';
      $schedule->isVerified = true;
      $schedule->save();
    }
    return response()->json(['success' => true, 'message' => 'You Complete your task with verification!'], 200);
  }

  public function verify(Request $request)
  {
    $ids = $request->input('ids');
    foreach ($ids as $id) {
      $schedule = schedule::find($id);
      if (!$schedule)
        return response()->json(['success' => false, 'error' => 'Schedule Not Found'], 404);
      if ($schedule->user_id != Auth::id())
        return response()->json(['success' => false, 'error' => 'unauthorized'], 401);
      if ($schedule->status == 'incomplete')
        return response()->json(['success' => false, 'error' => 'Your schedule is incomplete '], 400);

      $schedule->isVerified = true;
      $schedule->save();
    }
    return response()->json(['success' => true, 'message' => 'Schedule Verified Updated Successfully!'], 200);
  }

  public function dashBoardData(Request $request)
  {
    $time = $request->query('time');

    $now = Carbon::now();

    $totalSchedules = $this->grandTotal($time);
    $progressIsVerified = $this->progressIsVerified($time);
    $templatePerformanceIsVerified = $this->templatePerformanceIsVerified($time);
    $dayPerformanceIsVerified = $this->dayPerformanceIsVerified($time);
    $countTimePerformance = $this->countPerformanceViaTime($time);
    $performanceViaTimeIsverified = $this->performanceViaTimeIsVerified($time);

    return response()
      ->json([
        'success' => true,
        'total' => $totalSchedules,
        'bar1' => $progressIsVerified,
        'pie1' => $templatePerformanceIsVerified,
        'pie2' => $dayPerformanceIsVerified,
        'line1' => $countTimePerformance['line_1_1'],
        'line2' => $countTimePerformance['line_1_2'],
        'line3' => $countTimePerformance['line_1_3'],
        'line4' => $countTimePerformance['line_1_4'],
        'bar2' => [
          'bar_2_1' => $performanceViaTimeIsverified['bar_2_1'],
          'bar_2_2' => $performanceViaTimeIsverified['bar_2_2'],
          'bar_2_3' => $performanceViaTimeIsverified['bar_2_3'],
          'bar_2_4' => $performanceViaTimeIsverified['bar_2_4'],
        ]
      ], 200);
  }

  private function grandTotal($time)
  {
    $now = Carbon::now();
    if ($time === '1_week') {

      $totalSchedules = schedule::where('user_id', Auth::id())
        ->where('week', $now->weekNumberInMonth)
        ->where('month', $now->monthName)
        ->where('year', $now->year)
        ->count();

    } else if ($time === '1_month') {

      $totalSchedules = schedule::where('user_id', Auth::id())
        ->where('month', $now->monthName)
        ->where('year', $now->year)
        ->count();

    } else if ($time === '1_year') {

      $totalSchedules = schedule::where('user_id', Auth::id())
        ->where('year', $now->year)
        ->count();

    }
    return $totalSchedules;
  }

  private function progressIsVerified($time)
  {
    $now = Carbon::now();
    if ($time === '1_week') {

      $totalSchedules = schedule::where("user_id", Auth::id())
        ->where('week', $now->weekNumberInMonth)
        ->where('month', $now->monthName)
        ->where('year', $now->year)
        ->get()
        ->groupBy('day')
        ->map(function ($schedules, $day) {
          return [
            'day' => $schedules->first()->day,
            $day => $schedules->count()
          ];
        });

      $progress = schedule::where('user_id', Auth::id())
        ->where('status', 'complete')
        ->where('isVerified', true)
        ->where('week', $now->weekNumberInMonth)
        ->where('month', $now->monthName)
        ->where('year', $now->year)
        ->get()
        ->groupBy('day')
        ->map(function ($schedules, $day) use ($totalSchedules) {
          return [
            'day' => $day,
            $day => intval(($schedules->count() / $totalSchedules[$day][$day]) * 100),
          ];
        });
      return $progress;
    } else if ($time === '1_month') {

      $totalSchedules = schedule::where('user_id', Auth::id())
        ->where('month', $now->monthName)
        ->where('year', $now->year)
        ->get()
        ->groupBy('week')
        ->map(function ($schedules, $week) {
          return [
            'week' => 'Week ' . $schedules->first()->week,
            'Week ' . $schedules->first()->week => $schedules->count(),
          ];
        });

      $progress = schedule::where('user_id', Auth::id())
        ->where('status', 'complete')
        ->where('isVerified', true)
        ->where('month', $now->monthName)
        ->where('year', $now->year)
        ->get()
        ->groupBy('week')
        ->map(function ($schedules, $week) use ($totalSchedules) {
          return [
            'week' => 'Week ' . $week,
            'Week ' . $week => intval(($schedules->count() / $totalSchedules[$week]['Week ' . $week]) * 100),
          ];
        });
      return $progress;

    } else if ($time === '1_year') {

      $totalSchedules = schedule::where('user_id', Auth::id())
        ->where('year', $now->year)
        ->get()
        ->groupBy('month')
        ->map(function ($schedules, $month) {
          return [
            'month' => $schedules->first()->month,
            $schedules->first()->month => $schedules->count(),
          ];
        });

      $progress = schedule::where('user_id', Auth::id())
        ->where('status', 'complete')
        ->where('isVerified', true)
        ->where('year', $now->year)
        ->get()
        ->groupBy('month')
        ->map(function ($schedules, $month) use ($totalSchedules) {
          return [
            'month' => $month,
            $month => intval(($schedules->count() / $totalSchedules[$month][$month]) * 100),
          ];
        });
      return $progress;
    }
  }

  private function templatePerformanceIsVerified($time)
  {
    $now = Carbon::now();
    if ($time === '1_week') {
      $totalSchedules = schedule::where('user_id', Auth::id())
        ->where('week', $now->weekNumberInMonth)
        ->where('month', $now->monthName)
        ->where('year', $now->year)
        ->get()
        ->groupBy('template_id')
        ->map(function ($schedules, $templateId) {
          return [
            'template_id' => $templateId,
            'total' => $schedules->count(),
          ];
        });

      $performance = schedule::where('user_id', Auth::id())
        ->where('week', $now->weekNumberInMonth)
        ->where('month', $now->monthName)
        ->where('year', $now->year)
        ->where('status', 'complete')
        ->where('isVerified', true)
        ->get()
        ->groupBy('template_id')
        ->map(function ($schedules, $templateId) use ($totalSchedules) {
          return [
            'id' => $schedules->first()->template->name,
            'label' => $schedules->first()->template->name,
            'total' => $totalSchedules[$templateId]['total'],
            'isVerified' => $schedules->count(),
            'value' => intval(($schedules->count() / $totalSchedules[$templateId]['total']) * 100),
          ];
        });

    } else if ($time === '1_month') {
      $totalSchedules = schedule::where('user_id', Auth::id())
        ->where('month', $now->monthName)
        ->where('year', $now->year)
        ->get()
        ->groupBy('template_id')
        ->map(function ($schedules, $templateId) {
          return [
            'template_id' => $templateId,
            'total' => $schedules->count(),
          ];
        });

      $performance = schedule::where('user_id', Auth::id())
        ->where('month', $now->monthName)
        ->where('year', $now->year)
        ->where('status', 'complete')
        ->where('isVerified', true)
        ->get()
        ->groupBy('template_id')
        ->map(function ($schedules, $templateId) use ($totalSchedules) {
          return [
            'id' => $schedules->first()->template->name,
            'label' => $schedules->first()->template->name,
            'total' => $totalSchedules[$templateId]['total'],
            'isVerified' => $schedules->count(),
            'value' => intval(($schedules->count() / $totalSchedules[$templateId]['total']) * 100),
          ];
        });
    } else if ($time === '1_year') {
      $totalSchedules = schedule::where('user_id', Auth::id())
        ->where('year', $now->year)
        ->get()
        ->groupBy('template_id')
        ->map(function ($schedules, $templateId) {
          return [
            'template_id' => $templateId,
            'total' => $schedules->count(),
          ];
        });

      $performance = schedule::where('user_id', Auth::id())
        ->where('year', $now->year)
        ->where('status', 'complete')
        ->where('isVerified', true)
        ->get()
        ->groupBy('template_id')
        ->map(function ($schedules, $templateId) use ($totalSchedules) {
          return [
            'id' => $schedules->first()->template->name,
            'label' => $schedules->first()->template->name,
            'total' => $totalSchedules[$templateId]['total'],
            'isVerified' => $schedules->count(),
            'value' => intval(($schedules->count() / $totalSchedules[$templateId]['total']) * 100),
          ];
        });
    }
    return $performance;
  }

  private function dayPerformanceIsVerified($time)
  {
    $now = Carbon::now();
    if ($time === '1_week') {
      $totalSchedule = schedule::where("user_id", Auth::id())
        ->where('week', $now->weekNumberInMonth)
        ->where('month', $now->monthName)
        ->where('year', $now->year)
        ->get()
        ->groupBy('day')
        ->map(function ($schedules, $day) {
          return [
            'day' => $day,
            'total' => $schedules->count(),
          ];
        });

      $performance = schedule::where('user_id', Auth::id())
        ->where('status', 'complete')
        ->where('isVerified', true)
        ->where('week', $now->weekNumberInMonth)
        ->where('month', $now->monthName)
        ->where('year', $now->year)
        ->get()
        ->groupBy('day')
        ->map(function ($schedules, $day) use ($totalSchedule) {
          return [
            'id' => $day,
            'label' => $day,
            'total' => $totalSchedule[$day]['total'],
            'isVerified' => $schedules->count(),
            'value' => intVal(($schedules->count() / $totalSchedule[$day]['total']) * 100),
          ];
        });
    } else if ($time === '1_month') {
      $totalSchedule = schedule::where("user_id", Auth::id())
        ->where('month', $now->monthName)
        ->where('year', $now->year)
        ->get()
        ->groupBy('day')
        ->map(function ($schedules, $day) {
          return [
            'day' => $day,
            'total' => $schedules->count(),
          ];
        });

      $performance = schedule::where('user_id', Auth::id())
        ->where('status', 'complete')
        ->where('isVerified', true)
        ->where('month', $now->monthName)
        ->where('year', $now->year)
        ->get()
        ->groupBy('day')
        ->map(function ($schedules, $day) use ($totalSchedule) {
          return [
            'id' => $day,
            'label' => $day,
            'total' => $totalSchedule[$day]['total'],
            'isVerified' => $schedules->count(),
            'value' => intVal(($schedules->count() / $totalSchedule[$day]['total']) * 100),
          ];
        });
    } else if ($time === '1_year') {
      $totalSchedule = schedule::where("user_id", Auth::id())
        ->where('year', $now->year)
        ->get()
        ->groupBy('day')
        ->map(function ($schedules, $day) {
          return [
            'day' => $day,
            'total' => $schedules->count(),
          ];
        });

      $performance = schedule::where('user_id', Auth::id())
        ->where('status', 'complete')
        ->where('isVerified', true)
        ->where('year', $now->year)
        ->get()
        ->groupBy('day')
        ->map(function ($schedules, $day) use ($totalSchedule) {
          return [
            'id' => $day,
            'label' => $day,
            'total' => $totalSchedule[$day]['total'],
            'isVerified' => $schedules->count(),
            'value' => intVal(($schedules->count() / $totalSchedule[$day]['total']) * 100),
          ];
        });
    }
    return $performance;
  }

  private function countPerformanceViaTime($time)
  {
    $countPerformance = [
      'line_1_1' => [
        [
          'id' => 'Total',
          'color' => '#FF5733',
          'data' => [],
        ],
        [
          'id' => 'Complete',
          'color' => '#5733FF',
          'data' => [],
        ],
        [
          'id' => 'Verify',
          'color' => '#33FF57',
          'data' => [],
        ]
      ],
      'line_1_2' => [
        [
          'id' => 'Total',
          'color' => '#FF5733',
          'data' => [],
        ],
        [
          'id' => 'Complete',
          'color' => '#5733FF',
          'data' => [],
        ],
        [
          'id' => 'Verify',
          'color' => '#33FF57',
          'data' => [],
        ]
      ],
      'line_1_3' => [
        [
          'id' => 'Total',
          'color' => '#FF5733',
          'data' => [],
        ],
        [
          'id' => 'Complete',
          'color' => '#5733FF',
          'data' => [],
        ],
        [
          'id' => 'Verify',
          'color' => '#33FF57',
          'data' => [],
        ]
      ],
      'line_1_4' => [
        [
          'id' => 'Total',
          'color' => '#FF5733',
          'data' => [],
        ],
        [
          'id' => 'Complete',
          'color' => '#5733FF',
          'data' => [],
        ],
        [
          'id' => 'Verify',
          'color' => '#33FF57',
          'data' => [],
        ]
      ],
    ];

    $now = Carbon::now();
    if ($time === '1_week') {
      $totalSchedule = schedule::where('user_id', Auth::id())
        ->where('week', $now->weekNumberInMonth)
        ->where('month', $now->monthName)
        ->where('year', $now->year)
        ->selectRaw('start || " - " || end as interval , COUNT(*) as total')
        ->groupBy('start', 'end')
        ->get();

      $completeSchedule = schedule::where('user_id', Auth::id())
        ->where('status', 'complete')
        ->where('isVerified', false)
        ->where('week', $now->weekNumberInMonth)
        ->where('month', $now->monthName)
        ->where('year', $now->year)
        ->selectRaw('start || " - " || end as interval , COUNT(*) as complete')
        ->groupBy('start', 'end')
        ->get();
      $verifySchedule = schedule::where('user_id', Auth::id())
        ->where("status", 'complete')
        ->where("isVerified", true)
        ->where('week', $now->weekNumberInMonth)
        ->where('month', $now->monthName)
        ->where('year', $now->year)
        ->selectRaw('start || " - " || end as interval,COUNT(*) as veri')
        ->groupBy('start', 'end')
        ->get();
      foreach ($totalSchedule as $index => $schedule) {
        $totalComplete = 0;
        $totalVerify = 0;

        foreach ($completeSchedule as $complete) {
          if ($complete->interval == $schedule->interval)
            $totalComplete = $complete->complete;
        }

        foreach ($verifySchedule as $verify) {
          if ($verify->interval == $schedule->interval)
            $totalVerify = $verify->veri;
        }

        list($start, $end) = explode(' - ', $schedule->interval);

        $totalData = [
          'x' => $start,
          'y' => $schedule->total,
        ];
        $completeData = [
          'x' => $start,
          'y' => $totalComplete,
        ];
        $verifyData = [
          'x' => $start,
          'y' => $totalVerify,
        ];

        if ($index >= 0 && $index <= 11) {

          array_push($countPerformance['line_1_1'][0]['data'], $totalData);
          array_push($countPerformance['line_1_1'][1]['data'], $completeData);
          array_push($countPerformance['line_1_1'][2]['data'], $verifyData);
        } else if ($index >= 12 && $index <= 23) {

          array_push($countPerformance['line_1_2'][0]['data'], $totalData);
          array_push($countPerformance['line_1_2'][1]['data'], $completeData);
          array_push($countPerformance['line_1_2'][2]['data'], $verifyData);
        } else if ($index >= 24 && $index <= 35) {

          array_push($countPerformance['line_1_3'][0]['data'], $totalData);
          array_push($countPerformance['line_1_3'][1]['data'], $completeData);
          array_push($countPerformance['line_1_3'][2]['data'], $verifyData);
        } else if ($index >= 36 && $index <= 47) {

          array_push($countPerformance['line_1_4'][0]['data'], $totalData);
          array_push($countPerformance['line_1_4'][1]['data'], $completeData);
          array_push($countPerformance['line_1_4'][2]['data'], $verifyData);
        }
      }

    } else if ($time === '1_month') {
      $totalSchedule = schedule::where('user_id', Auth::id())
        ->where('month', $now->monthName)
        ->where('year', $now->year)
        ->selectRaw('start || " - " || end as interval , COUNT(*) as total')
        ->groupBy('start', 'end')
        ->get();

      $completeSchedule = schedule::where('user_id', Auth::id())
        ->where('status', 'complete')
        ->where('isVerified', false)
        ->where('month', $now->monthName)
        ->where('year', $now->year)
        ->selectRaw('start || " - " || end as interval , COUNT(*) as complete')
        ->groupBy('start', 'end')
        ->get();
      $verifySchedule = schedule::where('user_id', Auth::id())
        ->where("status", 'complete')
        ->where("isVerified", true)
        ->where('month', $now->monthName)
        ->where('year', $now->year)
        ->selectRaw('start || " - " || end as interval,COUNT(*) as veri')
        ->groupBy('start', 'end')
        ->get();
      foreach ($totalSchedule as $index => $schedule) {
        $totalComplete = 0;
        $totalVerify = 0;

        foreach ($completeSchedule as $complete) {
          if ($complete->interval == $schedule->interval)
            $totalComplete = $complete->complete;
        }

        foreach ($verifySchedule as $verify) {
          if ($verify->interval == $schedule->interval)
            $totalVerify = $verify->veri;
        }

        list($start, $end) = explode(' - ', $schedule->interval);

        $totalData = [
          'x' => $start,
          'y' => $schedule->total,
        ];
        $completeData = [
          'x' => $start,
          'y' => $totalComplete,
        ];
        $verifyData = [
          'x' => $start,
          'y' => $totalVerify,
        ];

        if ($index >= 0 && $index <= 11) {

          array_push($countPerformance['line_1_1'][0]['data'], $totalData);
          array_push($countPerformance['line_1_1'][1]['data'], $completeData);
          array_push($countPerformance['line_1_1'][2]['data'], $verifyData);
        } else if ($index >= 12 && $index <= 23) {

          array_push($countPerformance['line_1_2'][0]['data'], $totalData);
          array_push($countPerformance['line_1_2'][1]['data'], $completeData);
          array_push($countPerformance['line_1_2'][2]['data'], $verifyData);
        } else if ($index >= 24 && $index <= 35) {

          array_push($countPerformance['line_1_3'][0]['data'], $totalData);
          array_push($countPerformance['line_1_3'][1]['data'], $completeData);
          array_push($countPerformance['line_1_3'][2]['data'], $verifyData);
        } else if ($index >= 36 && $index <= 47) {

          array_push($countPerformance['line_1_4'][0]['data'], $totalData);
          array_push($countPerformance['line_1_4'][1]['data'], $completeData);
          array_push($countPerformance['line_1_4'][2]['data'], $verifyData);
        }

      }

    } else if ($time === '1_year') {
      $totalSchedule = schedule::where('user_id', Auth::id())
        ->where('year', $now->year)
        ->selectRaw('start || " - " || end as interval , COUNT(*) as total')
        ->groupBy('start', 'end')
        ->get();

      $completeSchedule = schedule::where('user_id', Auth::id())
        ->where('status', 'complete')
        ->where('isVerified', false)
        ->where('year', $now->year)
        ->selectRaw('start || " - " || end as interval , COUNT(*) as complete')
        ->groupBy('start', 'end')
        ->get();
      $verifySchedule = schedule::where('user_id', Auth::id())
        ->where("status", 'complete')
        ->where("isVerified", true)
        ->where('year', $now->year)
        ->selectRaw('start || " - " || end as interval,COUNT(*) as veri')
        ->groupBy('start', 'end')
        ->get();
      foreach ($totalSchedule as $index => $schedule) {
        $totalComplete = 0;
        $totalVerify = 0;

        foreach ($completeSchedule as $complete) {
          if ($complete->interval == $schedule->interval)
            $totalComplete = $complete->complete;
        }

        foreach ($verifySchedule as $verify) {
          if ($verify->interval == $schedule->interval)
            $totalVerify = $verify->veri;
        }

        list($start, $end) = explode(' - ', $schedule->interval);

        $totalData = [
          'x' => $start,
          'y' => $schedule->total,
        ];
        $completeData = [
          'x' => $start,
          'y' => $totalComplete,
        ];
        $verifyData = [
          'x' => $start,
          'y' => $totalVerify,
        ];

        if ($index >= 0 && $index <= 11) {

          array_push($countPerformance['line_1_1'][0]['data'], $totalData);
          array_push($countPerformance['line_1_1'][1]['data'], $completeData);
          array_push($countPerformance['line_1_1'][2]['data'], $verifyData);
        } else if ($index >= 12 && $index <= 23) {

          array_push($countPerformance['line_1_2'][0]['data'], $totalData);
          array_push($countPerformance['line_1_2'][1]['data'], $completeData);
          array_push($countPerformance['line_1_2'][2]['data'], $verifyData);
        } else if ($index >= 24 && $index <= 35) {

          array_push($countPerformance['line_1_3'][0]['data'], $totalData);
          array_push($countPerformance['line_1_3'][1]['data'], $completeData);
          array_push($countPerformance['line_1_3'][2]['data'], $verifyData);
        } else if ($index >= 36 && $index <= 47) {

          array_push($countPerformance['line_1_4'][0]['data'], $totalData);
          array_push($countPerformance['line_1_4'][1]['data'], $completeData);
          array_push($countPerformance['line_1_4'][2]['data'], $verifyData);
        }

      }

    }
    return $countPerformance;
  }

  private function performanceViaTimeIsVerified($time)
  {
    $performance = [
      'bar_2_1' => [],
      'bar_2_2' => [],
      'bar_2_3' => [],
      'bar_2_4' => [],
    ];

    $now = Carbon::now();
    if ($time === '1_week') {
      $totalSchedule = schedule::where('user_id', Auth::id())
        ->where('week', $now->weekNumberInMonth)
        ->where('month', $now->monthName)
        ->where('year', $now->year)
        ->selectRaw('start || " - " || end as interval , COUNT(*) as total')
        ->groupBy('start', 'end')
        ->get();
      $verifySchedule = schedule::where('user_id', Auth::id())
        ->where("status", 'complete')
        ->where("isVerified", true)
        ->where('week', $now->weekNumberInMonth)
        ->where('month', $now->monthName)
        ->where('year', $now->year)
        ->selectRaw('start || " - " || end as interval,COUNT(*) as veri')
        ->groupBy('start', 'end')
        ->get();

      $performance['bar_2_1'] = [
        [
          'week' => 'This Week',
        ],
      ];
      $performance['bar_2_2'] = [
        [
          'week' => 'This Week',
        ],
      ];
      $performance['bar_2_3'] = [
        [
          'week' => 'This Week',
        ],
      ];
      $performance['bar_2_4'] = [
        [
          'week' => 'This Week',
        ],
      ];

      foreach ($totalSchedule as $index => $schedule) {
        $totalVerify = 0;
        foreach ($verifySchedule as $verify) {
          if ($verify->interval == $schedule->interval)
            $totalVerify = $verify->veri;
        }

        list($start, $end) = explode(' - ', $schedule->interval);
        if ($index >= 0 && $index <= 11) {
          $performance['bar_2_1'][0][$schedule->interval] = intval(($totalVerify / $schedule->total) * 100);
          $performance['bar_2_1'][0][$schedule->interval . 'Color'] = $this->timeIntervalColors($schedule->interval);
        } else if ($index >= 12 && $index <= 23) {
          $performance['bar_2_2'][0][$schedule->interval] = intval(($totalVerify / $schedule->total) * 100);
          $performance['bar_2_2'][0][$schedule->interval . 'Color'] = $this->timeIntervalColors($schedule->interval);
        } else if ($index >= 24 && $index <= 35) {
          $performance['bar_2_3'][0][$schedule->interval] = intval(($totalVerify / $schedule->total) * 100);
          $performance['bar_2_3'][0][$schedule->interval . 'Color'] = $this->timeIntervalColors($schedule->interval);
        } else if ($index >= 36 && $index <= 47) {
          $performance['bar_2_4'][0][$schedule->interval] = intval(($totalVerify / $schedule->total) * 100);
          $performance['bar_2_4'][0][$schedule->interval . 'Color'] = $this->timeIntervalColors($schedule->interval);
        }
      }
    } else if ($time === '1_month') {
      $totalSchedule = schedule::where('user_id', Auth::id())
        ->where('month', $now->monthName)
        ->where('year', $now->year)
        ->selectRaw('week,start || " - " || end as interval, COUNT(*) as total')
        ->groupBy('week', 'interval')
        ->get();
      $totalVerifiedSchedule = schedule::where('user_id', Auth::id())
        ->where('month', $now->monthName)
        ->where('year', $now->year)
        ->where('status', 'complete')
        ->where('isVerified', true)
        ->selectRaw('week,start || " - " || end as interval, COUNT(*) as veri')
        ->groupBy('week', 'interval')
        ->get();

      $res = [
      ];
      $performance = [
      ];

      foreach ($totalSchedule as $index => $schedule) {
        $totalVerify = 0;
        foreach ($totalVerifiedSchedule as $verify) {
          if (($verify->interval == $schedule->interval) && ($verify->week === $schedule->week))
            $totalVerify = $verify->veri;
        }
        $res[$schedule->week]['week'] = 'Week ' . $schedule->week;
        $res[$schedule->week][$schedule->interval] = intval(($totalVerify / $schedule->total) * 100);
        $res[$schedule->week][$schedule->interval . 'Color'] = $this->timeIntervalColors($schedule->interval);
      }

      foreach ($res as $week => $p) {
        $i = 0;
        foreach ($p as $timeLine => $pInstance) {
          if ($i >= 0 && $i <= 24) {
            $performance['bar_2_1'][$week]['week'] = 'Week ' . $week;
            $performance['bar_2_1'][$week][$timeLine] = $pInstance;
          } else if ($i >= 25 && $i <= 48) {
            $performance['bar_2_2'][$week]['week'] = 'Week ' . $week;
            $performance['bar_2_2'][$week][$timeLine] = $pInstance;
          } else if ($i >= 49 && $i <= 72) {
            $performance['bar_2_3'][$week]['week'] = 'Week ' . $week;
            $performance['bar_2_3'][$week][$timeLine] = $pInstance;

          } else {
            $performance['bar_2_4'][$week]['week'] = 'Week ' . $week;
            $performance['bar_2_4'][$week][$timeLine] = $pInstance;
          }
          $i++;
        }
      }

    } else if ($time === '1_year') {
      $totalSchedule = schedule::where('user_id', Auth::id())
        ->where('year', $now->year)
        ->selectRaw('month,start || " - " || end as interval, COUNT(*) as total')
        ->groupBy('month', 'interval')
        ->get();
      $totalVerifiedSchedule = schedule::where('user_id', Auth::id())
        ->where('year', $now->year)
        ->where('status', 'complete')
        ->where('isVerified', true)
        ->selectRaw('month,start || " - " || end as interval, COUNT(*) as veri')
        ->groupBy('month', 'interval')
        ->get();

      $res = [
      ];
      $performance = [
      ];

      foreach ($totalSchedule as $index => $schedule) {
        $totalVerify = 0;
        foreach ($totalVerifiedSchedule as $verify) {
          if (($verify->interval == $schedule->interval) && ($verify->month === $schedule->month))
            $totalVerify = $verify->veri;
        }
        $res[$schedule->month]['month'] = $schedule->month;
        $res[$schedule->month][$schedule->interval] = intval(($totalVerify / $schedule->total) * 100);
        $res[$schedule->month][$schedule->interval . 'Color'] = $this->timeIntervalColors($schedule->interval);
      }

      foreach ($res as $month => $p) {
        $i = 0;
        foreach ($p as $timeLine => $pInstance) {
          if ($i >= 0 && $i <= 24) {
            $performance['bar_2_1'][$month]['month'] = $month;
            $performance['bar_2_1'][$month][$timeLine] = $pInstance;
          } else if ($i >= 25 && $i <= 48) {
            $performance['bar_2_2'][$month]['month'] = $month;
            $performance['bar_2_2'][$month][$timeLine] = $pInstance;
          } else if ($i >= 49 && $i <= 72) {
            $performance['bar_2_3'][$month]['month'] = $month;
            $performance['bar_2_3'][$month][$timeLine] = $pInstance;
          } else {
            $performance['bar_2_4'][$month]['month'] = $month;
            $performance['bar_2_4'][$month][$timeLine] = $pInstance;
          }
          $i++;
        }
      }
    }
    return $performance;
  }

  private function timeIntervalColors($timeInterval)
  {
    if ($timeInterval === "00:00:00 - 00:30:00") {
      return '#FF6347';
    } else if ($timeInterval === "00:30:00 - 01:00:00") {
      return '#FFA07A';
    } else if ($timeInterval === "01:00:00 - 01:30:00") {
      return '#FFD700';
    } else if ($timeInterval === "01:30:00 - 02:00:00") {
      return '#FF8C00';
    } else if ($timeInterval === "02:00:00 - 02:30:00") {
      return '#00FF00';
    } else if ($timeInterval === "02:30:00 - 03:00:00") {
      return '#FF1493';
    } else if ($timeInterval === "03:00:00 - 03:30:00") {
      return '#0000FF';
    } else if ($timeInterval === "03:30:00 - 04:00:00") {
      return '#f2f290';
    } else if ($timeInterval === "04:00:00 - 04:30:00") {
      return '#FF0000';
    } else if ($timeInterval === "04:30:00 - 05:00:00") {
      return '#DC143C';
    } else if ($timeInterval === "05:00:00 - 05:30:00") {
      return '#FF00FF';
    } else if ($timeInterval === "05:30:00 - 06:00:00") {
      return '#00FA9A';
    } else if ($timeInterval === "06:00:00 - 06:30:00") {
      return '#98FB98';
    } else if ($timeInterval === "06:30:00 - 07:00:00") {
      return '#FFE4E1';
    } else if ($timeInterval === "07:00:00 - 07:30:00") {
      return '#FFA07A';
    } else if ($timeInterval === "07:30:00 - 08:00:00") {
      return '#20B2AA';
    } else if ($timeInterval === "08:00:00 - 08:30:00") {
      return '#FF4500';
    } else if ($timeInterval === "08:30:00 - 09:00:00") {
      return '#FFFF00';
    } else if ($timeInterval === "09:00:00 - 09:30:00") {
      return '#4682B4';
    } else if ($timeInterval === "09:30:00 - 10:00:00") {
      return '#9932CC';
    } else if ($timeInterval === "10:00:00 - 10:30:00") {
      return '#008080';
    } else if ($timeInterval === "10:30:00 - 11:00:00") {
      return '#FF69B4';
    } else if ($timeInterval === "11:00:00 - 11:30:00") {
      return '#00aeef';
    } else if ($timeInterval === "11:30:00 - 12:00:00") {
      return '#CD5C5C';
    } else if ($timeInterval === "12:00:00 - 12:30:00") {
      return '#B22222';
    } else if ($timeInterval === "12:30:00 - 13:00:00") {
      return '#DB7093';
    } else if ($timeInterval === "13:00:00 - 13:30:00") {
      return '#FF4500';
    } else if ($timeInterval === "13:30:00 - 14:00:00") {
      return '#FFA500';
    } else if ($timeInterval === "14:00:00 - 14:30:00") {
      return '#8B0000';
    } else if ($timeInterval === "14:30:00 - 15:00:00") {
      return '#FF8C00';
    } else if ($timeInterval === "15:00:00 - 15:30:00") {
      return '#4169E1';
    } else if ($timeInterval === "15:30:00 - 16:00:00") {
      return '#FF00FF';
    } else if ($timeInterval === "16:00:00 - 16:30:00") {
      return '#FFFFE0';
    } else if ($timeInterval === "16:30:00 - 17:00:00") {
      return '#800000';
    } else if ($timeInterval === "17:00:00 - 17:30:00") {
      return '#00FFFF';
    } else if ($timeInterval === "17:30:00 - 18:00:00") {
      return '#FFA07A';
    } else if ($timeInterval === "18:00:00 - 18:30:00") {
      return '#FFEFD5';
    } else if ($timeInterval === "18:30:00 - 19:00:00") {
      return '#BDB76B';
    } else if ($timeInterval === "19:00:00 - 19:30:00") {
      return '#90EE90';
    } else if ($timeInterval === "19:30:00 - 20:00:00") {
      return '#7FFF00';
    } else if ($timeInterval === "20:00:00 - 20:30:00") {
      return '#CD5C5C';
    } else if ($timeInterval === "20:30:00 - 21:00:00") {
      return '#FF1493';
    } else if ($timeInterval === "21:00:00 - 21:30:00") {
      return '#32CD32';
    } else if ($timeInterval === "21:30:00 - 22:00:00") {
      return '#FF4500';
    } else if ($timeInterval === "22:00:00 - 22:30:00") {
      return '#FF8C00';
    } else if ($timeInterval === "22:30:00 - 23:00:00") {
      return '#00CED1';
    } else if ($timeInterval === "23:00:00 - 23:30:00") {
      return '#3CB371';
    } else if ($timeInterval === "23:30:00 - 24:00:00") {
      return '#481E14';
    }
  }

  private function removeEmptyArrays(&$array)
  {
    foreach ($array as $key => &$value) {
      if (is_array($value)) {
        $this->removeEmptyArrays($value);
        if (empty($value)) {
          unset($array[$key]);
        }
      }
    }
  }
}

