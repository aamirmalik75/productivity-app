<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
  public function create(Request $request)
  {
    $project_id = $request->route('project_id');

    $project = Project::where('id', $project_id)->first();
    if ($project->user_id != Auth::id())
      return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);

    $validatedData = $request->validate([
      'title' => 'required|string|max:255',
      'field' => 'required|string|in:' . implode(',', json_decode($project->fields)),
    ]);

    $task = Task::create([
      'title' => $validatedData['title'],
      'field' => $validatedData['field'],
      'project_id' => $project->id
    ]);
    return response()->json(['success' => true, 'task' => $task], 201);
  }

  public function update(Request $request)
  {
    $task_id = $request->route('task_id');
    $project_id = $request->route('project_id');
    $field = $request->input('field');
    $title = $request->input('title');

    $project = Task::where('id', $task_id)
      ->where('field', $field)
      ->where('project_id', $project_id)
      ->first();

    $project->title = $title;
    $project->save();
    return response()->json(['success' => true, 'message' => 'Task Updated Successfully!'], 200);
  }

  public function destroy(Request $request)
  {
    $task_id = $request->route('task_id');
    $project_id = $request->route('project_id');

    $project = Task::where('id', $task_id)
      ->where('project_id', $project_id)
      ->first();

    $project->delete();

    return response()->json(['success' => true, 'message' => 'Task deleted Successfully!'], 200);
  }

  public function updateField(Request $request)
  {
    $task_id = $request->route('task_id');
    $project_id = $request->route('project_id');

    $validatedData = $request->validate([
      'field' => 'required|string'
    ]);

    $project = Project::where('user_id', Auth::id())
      ->where('id', $project_id)
      ->first();

    if (!$project)
      return response()->json(['success' => false, 'error' => 'Project Not Found!'], 404);

    if ($project->user_id != Auth::id()) {
      return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
    }

    $task = Task::where('id', $task_id)
      ->where('project_id', $project_id)
      ->first();

    if (!$task)
      return response()->json(['success' => false, 'error' => 'Task Not Found!'], 404);

    $allowedFields = json_decode($project->fields);
    if (!in_array($validatedData['field'], $allowedFields)) {
      return response()->json(['success' => false, 'error' => 'Invalid field value'], 422);
    }

    $task->field = $validatedData['field'];
    $task->save();

    return response()->json(['success' => true, 'message' => 'Task field updated Successfully!'], 200);

  }

}
