<?php

namespace App\Console\Commands;

use App\Models\Goal;
use App\Notifications\GoalDeadlineNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class NotifyIncompleteGoals extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'notify:incomplete-goals-deadline';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'Send Notifications for incomplete goals on day of deadline.';

  /**
   * Execute the console command.
   *
   * @return int
   */
  public function handle()
  {
    $today = Carbon::today();

    $incompletedGoals = Goal::where('status', 'Incomplete')
      ->get();
    $filteredGoals = $incompletedGoals->filter(function ($goal) use ($today) {
      // Compare the deadline date with today's date
      return Carbon::parse($goal->deadline)->isSameDay($today);
    });

    foreach ($filteredGoals as $goal) {
      // Notify the user about the goal deadline
      $goal->user->notify(new GoalDeadlineNotification($goal));
    }
    $this->info('Successfully');
  }
}
