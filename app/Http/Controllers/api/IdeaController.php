<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Idea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class IdeaController extends Controller
{
  public function create(Request $request)
  {
    $data = Validator::make($request->all(), [
      'title' => 'required|string',
      'description' => 'required|string',
      'category' => 'required|string',
    ]);

    if ($data->fails()) {
      return response()->json(['success' => false, 'error' => $data->errors()], 422);
    }

    $idea = new Idea();
    $idea->title = $request->input('title');
    $idea->description = $request->input('description');
    $idea->category = $request->input('category');
    $idea->user_id = Auth::id();
    $idea->save();

    return response()->json(['success' => true, 'message' => 'Idea Created Successfully!', 'idea' => $idea], 201);
  }

  public function userIdeas(Request $request)
  {
    $ideas = Idea::where('user_id', Auth::id())->get();
    return response()->json(['success' => true, 'ideas' => $ideas], 200);
  }

  public function delete(Request $request)
  {
    $id = $request->route('id');
    $idea = Idea::find($id);
    if (!$idea)
      return response()->json(['success' => false, 'error' => 'Idea Not Found'], 404);
    if ($idea->user_id != Auth::id())
      return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
    $idea->delete();
    return response()->json(['success' => true, 'message' => 'Idea Deleted Successfully'], 200);
  }

  public function update(Request $request)
  {
    $id = $request->route('id');
    $data = Validator::make($request->all(), [
      'title' => 'required|string',
      'description' => 'required|string',
      'category' => 'required|string',
    ]);

    if ($data->fails()) {
      return response()->json(['success' => false, 'error' => $data->errors()], 422);
    }

    $idea = Idea::find($id);

    if (!$idea)
      return response()->json(['success' => false, 'error' => 'Idea Not Found'], 404);

    if ($idea->user_id != Auth::id())
      return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);

    $idea->fill($request->all());
    $idea->save();

    return response()->json(['success' => true, 'message' => 'Idea Updated Successfully!'], 200);
  }

  public function personalIdeas(Request $request)
  {
    $ideas = Idea::where('user_id', Auth::id())->where('category', 'Personal')->get();
    return response()->json(['success' => true, 'ideas' => $ideas], 200);
  }

  public function professionalIdeas(Request $request)
  {
    $ideas = Idea::where('user_id', Auth::id())->where('category', 'Professional')->get();
    return response()->json(['success' => true, 'ideas' => $ideas], 200);
  }

  public function fullfilled(Request $request)
  {
    $id = $request->route('id');
    $idea = Idea::find($id);
    if (!$idea)
      return response()->json(['success' => false, 'error' => 'Idea Not Found'], 404);

    if ($idea->user_id != Auth::id())
      return response()->json(['success' => false, 'error' => 'Unauthorized', "authorizedId" => Auth::id()], 401);

    $idea->status = "Fullfilled";
    $idea->save();
    return response()->json(['success' => true, 'message' => 'Idea Fullfilled Successfully!'], 200);
  }
}
