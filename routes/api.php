<?php

use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\GoalController;
use App\Http\Controllers\api\GoalFeedbackController;
use App\Http\Controllers\api\IdeaController;
use App\Http\Controllers\api\NotificationsController;
use App\Http\Controllers\api\ScheduleController;
use App\Http\Controllers\api\ScheduleTemplateController;
use App\Http\Controllers\api\MenuItemController;
use App\Http\Controllers\api\ProjectController;
use App\Http\Controllers\api\TaskController;
use App\Models\schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
  return $request->user();
});

Route::group(['prefix' => 'auth'], function () {
  Route::post('register', [AuthController::class, 'register']);
  Route::post('login', [AuthController::class, 'logIn']);
  Route::middleware('auth:sanctum')->post('logout', [AuthController::class, 'logOut']);
});

Route::group(['prefix' => 'recentUsed'], function () {
  Route::middleware('auth:sanctum')->get('all', [MenuItemController::class, 'recentUsed']);
});

Route::group(['prefix' => 'menuItem'], function () {
  Route::middleware('auth:sanctum')->post('{name}/open', [MenuItemController::class, 'open']);
});

Route::group(['prefix' => 'goal'], function () {
  Route::middleware('auth:sanctum')->get('all', [GoalController::class, 'index']);
  Route::middleware('auth:sanctum')->post('create', [GoalController::class, 'create']);
  Route::middleware('auth:sanctum')->post('create/goals', [GoalController::class, 'storeMultiple']);
  Route::middleware('auth:sanctum')->get('incompleted', [GoalController::class, 'getInCompletedGoals']);
  Route::middleware('auth:sanctum')->put('completed', [GoalController::class, 'completeGoal']);
  Route::middleware('auth:sanctum')->put('delete', [GoalController::class, 'deleteGoal']);
  Route::middleware('auth:sanctum')->put('{id}/update', [GoalController::class, 'updateGoal']);
  Route::middleware('auth:sanctum')->put('{id}/feedback', [GoalController::class, 'feedbackGoal']);
  Route::middleware('auth:sanctum')->get('deadline', [GoalController::class, 'deadline']);
  Route::middleware('auth:sanctum')->get('dead', [GoalController::class, 'dead']);
});
Route::group(['prefix' => 'idea'], function () {
  Route::middleware('auth:sanctum')->post('create', [IdeaController::class, 'create']);
  Route::middleware('auth:sanctum')->get('userIdeas', [IdeaController::class, 'userIdeas']);
  Route::middleware('auth:sanctum')->delete('{id}/delete', [IdeaController::class, 'delete']);
  Route::middleware('auth:sanctum')->put('{id}/update', [IdeaController::class, 'update']);
  Route::middleware('auth:sanctum')->get('userIdeas/personal', [IdeaController::class, 'personalIdeas']);
  Route::middleware('auth:sanctum')->get('userIdeas/professional', [IdeaController::class, 'professionalIdeas']);
  Route::middleware('auth:sanctum')->put('{id}/fullfilled', [IdeaController::class, 'fullfilled']);
});

Route::group(['prefix' => 'feedback'], function () {
  Route::middleware('auth:sanctum')->post('{id}/create', [GoalFeedbackController::class, 'create']);
  Route::middleware('auth:sanctum')->get('{id}/show', [GoalFeedbackController::class, 'index']);
  Route::middleware('auth:sanctum')->delete('{id}/delete', [GoalFeedbackController::class, 'delete']);
  Route::middleware('auth:sanctum')->put('{id}/goal/{feedbackId}/update', [GoalFeedbackController::class, 'update']);
});

Route::group(['prefix' => 'notification'], function () {
  Route::middleware('auth:sanctum')->post('create/notifications', [NotificationsController::class, 'storeMultiple']);
  Route::middleware('auth:sanctum')->get('notifications', [NotificationsController::class, 'notifications']);
  Route::middleware('auth:sanctum')->post('markAllAsRead', [NotificationsController::class, 'markAllAsRead']);
  Route::middleware('auth:sanctum')->get('unreadNotifications', [NotificationsController::class, 'unreadNotifications']);
});

Route::group(['prefix' => 'template'], function () {
  Route::middleware('auth:sanctum')->post('create', [ScheduleTemplateController::class, 'store']);
  Route::middleware('auth:sanctum')->post('create/templates', [ScheduleTemplateController::class, 'storeMultiple']);
  Route::middleware('auth:sanctum')->get('show', [ScheduleTemplateController::class, 'index']);
  Route::middleware('auth:sanctum')->get('{id}', [ScheduleTemplateController::class, 'template']);
  Route::middleware('auth:sanctum')->delete('{id}/delete', [ScheduleTemplateController::class, 'destroy']);
  Route::middleware('auth:sanctum')->put('{id}/update', [ScheduleTemplateController::class, 'update']);
});

Route::group(['prefix' => 'schedule'], function () {
  Route::middleware('auth:sanctum')->post('create', [ScheduleController::class, 'store']);
  Route::middleware('auth:sanctum')->post('create/schedules', [ScheduleController::class, 'storeMultiple']);
  Route::middleware('auth:sanctum')->get('show', [ScheduleController::class, 'index']);
  Route::middleware('auth:sanctum')->put('{id}/update', [ScheduleController::class, 'update']);
  Route::middleware('auth:sanctum')->put('update', [ScheduleController::class, 'updateAll']);
  Route::middleware('auth:sanctum')->put('status', [ScheduleController::class, 'status']);
  Route::middleware('auth:sanctum')->put('completeVerify', [ScheduleController::class, 'completeVerify']);
  Route::middleware('auth:sanctum')->put('verify', [ScheduleController::class, 'verify']);
});

Route::group(['prefix' => 'project'], function () {
  Route::middleware('auth:sanctum')->get('{project_id}/show', [ProjectController::class, 'show']);
  Route::middleware('auth:sanctum')->get('active', [ProjectController::class, 'activeProjects']);
  Route::middleware('auth:sanctum')->get('trash', [ProjectController::class, 'trashProjects']);
  Route::middleware('auth:sanctum')->put('{project_id}/moveToTrash', [ProjectController::class, 'moveToTrash']);
  Route::middleware('auth:sanctum')->put('{project_id}/removeToTrash', [ProjectController::class, 'removeToTrash']);
  Route::middleware('auth:sanctum')->post('create', [ProjectController::class, 'create']);
  Route::middleware('auth:sanctum')->put('{project_id}/rename', [ProjectController::class, 'rename']);
  Route::middleware('auth:sanctum')->delete('{project_id}/delete', [ProjectController::class, 'destroy']);
  Route::middleware('auth:sanctum')->post('{project_id}/open', [ProjectController::class, 'open']);
});

Route::group(['prefix' => 'task'], function () {
  Route::middleware('auth:sanctum')->post('{project_id}/create', [TaskController::class, 'create']);
  Route::middleware('auth:sanctum')->put('{task_id}/{project_id}/update', [TaskController::class, 'update']);
  Route::middleware('auth:sanctum')->put('{task_id}/{project_id}/updateField', [TaskController::class, 'updateField']);
  Route::middleware('auth:sanctum')->delete('{task_id}/{project_id}/delete', [TaskController::class, 'destroy']);
});

Route::group(['prefix' => 'dashBoard'], function () {
  Route::middleware('auth:sanctum')->get('goal', [GoalController::class, 'dashBoardData']);
  Route::middleware('auth:sanctum')->get('schedule', [ScheduleController::class, 'dashBoardData']);
});
