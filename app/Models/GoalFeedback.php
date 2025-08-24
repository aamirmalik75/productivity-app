<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Goal;

class GoalFeedback extends Model
{
  use HasFactory;
  protected $fillable = ['title', 'description', 'goal_id'];

  public function goal()
  {
    return $this->belongsTo(Goal::class);
  }
}
