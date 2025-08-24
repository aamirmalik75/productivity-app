<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class MenuItemController extends Controller
{
  public function recentUsed(Request $request)
  {
    $recentUsed = DB::table('menu_items')
      ->select('name', 'url', 'last_opened', 'user_id')
      ->whereNotNull('last_opened')
      ->where('user_id', Auth::id())
      ->union(
        DB::table('projects')
          ->select('name', 'url', 'last_opened', 'user_id')
          ->whereNotNull('last_opened')
          ->where('inTrash', 0)
          ->where('user_id', Auth::id())
      )
      ->orderBy('last_opened', 'desc')
      ->limit(4)
      ->get();

    return response()->json(['success' => true, 'recentUsed' => $recentUsed], 200);
  }

  public function open(Request $request)
  {
    $name = $request->route('name');
    $time = $request->input('time');
    $carbonTime = Carbon::parse($time)->setTimezone('UTC');
    $menuItem = MenuItem::where("user_id", Auth::id())->where("name", $name)->first();

    $menuItem->update(['last_opened' => $carbonTime]);
    return response()->json(['success' => true, $carbonTime], 200);
  }

}
