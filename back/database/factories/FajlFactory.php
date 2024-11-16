<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Fajl;

class FajlFactory extends Factory
{
    protected $model = Fajl::class;

    public function definition()
    {
        return [
            'naziv' => $this->faker->word . '.mp3',
            'putanja' => 'uploads/' . $this->faker->word . '.mp3',
            'tip' => $this->faker->randomElement(['audio', 'video']),
        ];
    }
}
