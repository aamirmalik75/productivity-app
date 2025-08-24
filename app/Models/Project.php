<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Task;
use App\Models\User;

class Project extends Model
{
  use HasFactory;
  protected $fillable = ['name', 'url', 'last_opened', 'inTrash', 'fields', 'user_id'];

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function Tasks()
  {
    return $this->hasMany(Task::class);
  }
}
