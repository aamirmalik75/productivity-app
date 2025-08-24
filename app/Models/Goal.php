<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Goal extends Model
{
  use HasFactory;
  protected $fillable = ['title', 'description', 'status', 'feedback', 'deadline', 'progress', 'parent_id', 'user_id'];

  public function subGoals()
  {
    return $this->hasMany(Goal::class, 'parent_id');
  }

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function feedback()
  {
    return $this->hasMany(GoalFeedback::class, 'goal_id');
  }

  public function deleteWithSubGoals()
  {
    $this->subGoals->each->deleteWithSubGoals();
    $this->delete();
  }

  public function updateProgress($parentGoalID, $updatedParents)
  {
    $parentGoal = Goal::where('id', $parentGoalID)->first();
    if ($parentGoal) {
      $totalSubGoals = $parentGoal->subGoals ? $parentGoal->subGoals->count() : 0;
      $completedSubGoals = $parentGoal->subGoals ? $parentGoal->subGoals->where('status', 'Completed')->count() : 0;
      $parentProgress = $totalSubGoals > 0 ? ($completedSubGoals / $totalSubGoals) * 100 : 0;
      $parentGoal->update(['progress' => $parentProgress]);
      $updatedParents[] = [
        'id' => $parentGoal->id,
        'progress' => $parentGoal->progress,
      ];
      if ($parentGoal->parent_id) {
        $this->updateProgress($parentGoal->parent_id, $updatedParents);
      }
    }

  }
}
