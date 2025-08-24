<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\schedule;

class ScheduleTemplate extends Model
{
  use HasFactory;
  protected $fillable = ['template', 'user_id', 'name'];

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function schedule()
  {
    return $this->hasMany(schedule::class);
  }
}
