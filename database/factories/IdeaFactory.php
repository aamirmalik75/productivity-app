<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Idea>
 */
class IdeaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
          'user_id' => \App\Models\User::factory(),
          'title' => rtrim(fake()->realText(30), '.'),
          'description' => fake()->realText(100),
          'status' => fake()->randomElement(['Pending', 'Fullfilled']),
          'category' => fake()->randomElement(['Personal', 'Professional']),
        ];
    }
}
