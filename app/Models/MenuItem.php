<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class MenuItem extends Model
{
  use HasFactory;
  protected $fillable = ['name', 'url', 'last_opened', 'user_id'];

  public function user()
  {
    return $this->belongsTo(User::class);
  }

}
