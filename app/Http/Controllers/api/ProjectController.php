<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ProjectController extends Controller
{
  public function create(Request $request)
  {
    $project = Project::create([
      'user_id' => Auth::id(),
    ]);

    $project->url = '/project/' . $project->id;
    $project->save();

    return response()->json(['success' => true, 'project' => $project], 201);
  }

  public function show(Request $request, ProjectService $projectService)
  {
    $project_id = $request->route('project_id');
    $project = $projectService->getProjectWithTasks($project_id, Auth::id());
    if (!$project) {
      return response()->json(['success' => false, 'error' => 'Project not found'], 404);
    }
    return response()->json(['success' => true, 'project' => $project], 200);

  }

  public function trashProjects(Request $request)
  {
    $projects = DB::table('projects')
      ->select('id', 'name', 'url')
      ->where('user_id', Auth::id())
      ->where('inTrash', 1)
      ->get();

    return response()->json(['success' => true, 'projects' => $projects], 200);
  }

  public function rename(Request $request)
  {
    $project_id = $request->route('project_id');

    $data = Validator::make($request->all(), [
      'name' => 'string',
    ]);

    if ($data->fails()) {
      return response()->json(['success' => false, 'error' => $data->errors()], 422);
    }

    $project = Project::where('id', $project_id)
      ->where('user_id', Auth::id())
      ->first();

    if (!$project)
      return response()->json(['success' => false, 'error' => 'Project Not Found!'], 404);

    $project->name = $request->input("name");
    $project->save();

    return response()->json(['success' => true, 'project' => $project], 200);
  }

  public function activeProjects(Request $request)
  {
    $projects = DB::table('projects')
      ->select('id', 'name', 'url', 'inTrash')
      ->where('user_id', Auth::id())
      ->where('inTrash', 0)
      ->get();

    return response()->json(['success' => true, 'projects' => $projects], 200);
  }

  public function moveToTrash(Request $request)
  {
    $project_id = $request->route('project_id');

    $project = Project::where('id', $project_id)
      ->where('user_id', Auth::id())
      ->first();

    if (!$project)
      return response()->json(['success' => false, 'error' => 'Project Not Found!'], 404);

    $project->inTrash = 1;
    $project->save();

    return response()->json(['success' => true, 'message' => 'Project moved to Trash Successfully!'], 200);
  }

  public function removeToTrash(Request $request)
  {
    $project_id = $request->route('project_id');

    $project = Project::where('id', $project_id)
      ->where('user_id', Auth::id())
      ->first();

    if (!$project)
      return response()->json(['success' => false, 'error' => 'Project Not Found!'], 404);

    if ($project->inTrash === 0)
      return response()->json(['success' => false, 'error' => 'Project already out of Trash'], 400);

    $project->inTrash = 0;
    $project->save();

    return response()->json(['success' => true, 'message' => 'Project restore Successfully!'], 200);
  }

  public function destroy(Request $request)
  {
    $project_id = $request->route('project_id');
    $project = Project::where('id', $project_id)
      ->where('user_id', Auth::id())
      ->first();

    if (!$project)
      return response()->json(['success' => false, 'error' => 'Project Not Found!'], 404);

    if ($project->inTrash === 0)
      return response()->json(['success' => false, 'error' => 'Project is not in trash'], 400);

    $project->delete();
    return response()->json(['success' => true, 'message' => 'Project deleted Successfully!'], 200);

  }

  public function open(Request $request)
  {
    $project_id = $request->route('project_id');
    $time = $request->input('time');
    $project = Project::where("user_id", Auth::id())->where("id", $project_id)->first();

    $project->update(['last_opened' => $time]);
    return response()->json(['success' => true], 200);
  }
}
