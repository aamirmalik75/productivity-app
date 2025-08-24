<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Idea;
use App\Models\Goal;
use App\Models\schedule;
use App\Models\ScheduleTemplate;
use App\Models\MenuItem;
use App\Models\Project;

class User extends Authenticatable
{
  use HasApiTokens, HasFactory, Notifiable;

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  protected $fillable = [
    'name',
    'email',
    'password',
  ];

  /**
   * The attributes that should be hidden for serialization.
   *
   * @var array<int, string>
   */
  protected $hidden = [
    'password',
    'remember_token',
  ];

  /**
   * The attributes that should be cast.
   *
   * @var array<string, string>
   */
  protected $casts = [
    'email_verified_at' => 'datetime',
  ];

  protected static function booted()
  {
    static::created(function ($user) {
      try {
        \Log::info("CreateDefaultMenuItems listener triggered");

        $defaultMenuItems = [
          ['name' => 'Home', 'url' => '/home/' . $user->id, 'user_id' => $user->id],
          ['name' => 'Goals', 'url' => '/goals', 'user_id' => $user->id],
          ['name' => 'Schedules', 'url' => '/schedule', 'user_id' => $user->id],
          ['name' => "Idea's", 'url' => '/ideas', 'user_id' => $user->id],
          ['name' => "Notifications", 'url' => '/notifications', 'user_id' => $user->id],
          ['name' => "Goals Panel", 'url' => '/dashboard/goals', 'user_id' => $user->id],
          ['name' => "Schedules Panel", 'url' => '/dashboard/schedules', 'user_id' => $user->id],
        ];

        foreach ($defaultMenuItems as $item) {
          MenuItem::create([
            'name' => $item['name'],
            'url' => $item['url'],
            'user_id' => $item['user_id'],
          ]);
        }
      } catch (\Exception $e) {
        \Log::error('Failed to create default menu items: ' . $e->getMessage());
      }
    });
  }

  public function menuItems()
  {
    return $this->hasMany(MenuItem::class);
  }

  public function ideas()
  {
    return $this->hasMany(Idea::class);
  }

  public function goals()
  {
    return $this->hasMany(Goal::class);
  }

  public function schedules()
  {
    return $this->hasMany(Schedule::class);
  }

  public function templates()
  {
    return $this->hasMany(ScheduleTemplate::class);
  }

  public function projects()
  {
    return $this->hasMany(Project::class);
  }
}
