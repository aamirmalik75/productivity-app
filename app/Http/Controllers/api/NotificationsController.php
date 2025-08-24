<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class NotificationsController extends Controller
{
  public function storeMultiple(Request $request)
  {
    $notifications = $request->input('notifications');

    // Validate the notifications data
    $validator = Validator::make($request->all(), [
      'notifications' => 'required|array',
      'notifications.*.id' => 'required|uuid',
      'notifications.*.type' => 'required|string',
      'notifications.*.notifiable_type' => 'required|string',
      'notifications.*.notifiable_id' => 'required|integer',
      'notifications.*.data' => 'required|array', // Validates data as an array
      'notifications.*.read_at' => 'nullable|date',
      'notifications.*.created_at' => 'required|date',
      'notifications.*.updated_at' => 'required|date',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'message' => 'Invalid data format',
        'errors' => $validator->errors(),
      ], 400);
    }

    try {
      // Prepare the notifications array for insertion
      foreach ($notifications as &$notification) {
        $notification['data'] = json_encode($notification['data']); // Ensure data is encoded as JSON
      }

      // Insert the records
      DB::table('notifications')->insert($notifications);

      return response()->json([
        'message' => 'Notifications inserted successfully',
      ], 201);
    } catch (\Exception $e) {
      return response()->json([
        'message' => 'Error inserting notifications: ' . $e->getMessage(),
      ], 500);
    }
  }
  public function notifications()
  {
    $notifications = auth()->user()->notifications()->paginate(10);
    return response()->json(['success' => true, 'notifications' => $notifications], 200);
  }

  public function markAllAsRead()
  {
    auth()->user()->unreadNotifications->markAsRead();
    return response()->json(['success' => true, 'message' => 'All Notifications mark as read']);
  }

  public function unreadNotifications()
  {
    $unReadNotifications = auth()->user()->unreadNotifications;
    return response()->json(['success' => true, 'unReadNotifications' => $unReadNotifications], 200);
  }
}
