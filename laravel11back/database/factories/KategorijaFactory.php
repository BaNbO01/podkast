<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Kategorija;

class KategorijaFactory extends Factory
{
    protected $model = Kategorija::class;

    public function definition()
    {
        return [
            'naziv' => $this->faker->unique()->word,
        ];
    }
}
