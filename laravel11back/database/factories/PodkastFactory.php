<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Podkast;
use App\Models\Kategorija;
use App\Models\User;

class PodkastFactory extends Factory
{
    protected $model = Podkast::class;

    public function definition()
    {
        return [
            'naziv' => $this->faker->sentence(3),
            'opis' => $this->faker->paragraph,
            'putanja_do_banera' => $this->faker->imageUrl(640, 480, 'podcast'),
            'kategorija_id' => Kategorija::inRandomOrder()->first()->id ?? Kategorija::factory()->create()->id,
            'kreator_id' => User::where('role', 'kreator')->inRandomOrder()->first()->id ?? User::factory()->create(['role' => 'kreator'])->id,
        ];
    }
}
