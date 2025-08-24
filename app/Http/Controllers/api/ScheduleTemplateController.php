<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\ScheduleTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class ScheduleTemplateController extends Controller
{
  public function store(Request $request)
  {
    $data = Validator::make($request->all(), [
      'name' => 'required|string',
      'template' => 'required|string',
    ]);

    if ($data->fails())
      return response()->json(['success' => false, 'error' => $data->errors()], 422);

    $template = new ScheduleTemplate();
    $template->name = $request->input('name');
    $template->template = $request->input('template');
    $template->user_id = Auth::id();
    $template->save();
    return response()->json(['success' => true, 'message' => 'Schedule Template Created Successfully!'], 201);
  }

  public function storeMultiple(Request $request)
  {

    // Insert the records
    $schedulesTemplate = ScheduleTemplate::insert($request->input('schedulesTemplates'));

    return response()->json([
      'message' => 'Schedules template inserted successfully',
      'data' => $schedulesTemplate,
    ], 201);
  }


  public function index()
  {
    $templates = ScheduleTemplate::where('user_id', Auth::id())->get();
    return response()->json(['success' => true, 'templates' => $templates], 200);
  }

  public function template(Request $request)
  {
    $id = $request->route('id');
    $template = ScheduleTemplate::where('id', $id)->where('user_id', Auth::id())->first();
    return response()->json(['success' => true, 'template' => $template], 200);

  }

  public function destroy(Request $request)
  {
    $id = $request->route('id');
    $template = ScheduleTemplate::find($id);
    if (!$template)
      return response()->json(['success' => false, 'error' => 'Schedule Template is Not Found'], 404);
    if ($template->user_id != Auth::id())
      return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
    $template->delete();
    return response()->json(['success' => true, 'message' => 'Schedule Template Deleted Successfully!'], 200);
  }

  public function update(Request $request)
  {
    $data = Validator::make($request->all(), [
      'name' => 'required|string',
      'template' => 'required|string',
    ]);

    if ($data->fails())
      return response()->json(['success' => false, 'error' => $data->errors()], 422);

    $id = $request->route('id');
    $template = ScheduleTemplate::find($id);
    if (!$template)
      return response()->json(['success' => false, 'error' => 'Schedule Template is Not Found'], 404);
    if ($template->user_id != Auth::id())
      return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);

    $template->fill($request->all());
    $template->save();
    return response()->json(['success' => true, 'message' => 'Schedule Template Updated Successfully!'], 200);
  }
}
