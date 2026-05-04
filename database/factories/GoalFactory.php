<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Goal>
 */
class GoalFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition()
  {
    return [
      'title' => fake()->catchPhrase(),
      'user_id' => \App\Models\User::factory(),
      'description' => fake()->sentence(12),
      'status' => fake()->randomElement(['Incomplete', 'In Progress', 'Completed']),
      'feedback' => fake()->optional()->sentence(),
      'deadline' => fake()->dateTimeBetween('now', '+6 months'),
      'progress' => fake()->randomFloat(2, 0, 100),
      'parent_id' => null, // Leave null by default for main goals
    ];
  }
}
