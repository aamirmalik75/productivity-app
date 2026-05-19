<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TrackSystemTelemetry
{
  /**
   * Handle an incoming request.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
   * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
   */
  public function handle(Request $request, Closure $next)
  {
    $start_time = microtime(true);
    $response = $next($request);
    $end_time = microtime(true);

    $execution_time = ($end_time - $start_time) * 1000;

    try {
      DB::table('system_telemetry')->insert([
        'api_route' => $request->path(),
        'execuation_time_ms' => $execution_time,
        'http_status' => $response->getStatusCode(),
        'created_at' => now(),
      ]);
    } catch (\Throwable $th) {
    }

    return $response;
  }
}
