<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Epizoda;
use App\Models\Podkast;
use App\Models\Fajl;

class EpizodaFactory extends Factory
{
    protected $model = Epizoda::class;

    public function definition()
    {
        return [
            'naziv' => $this->faker->sentence(2),
            'datum_i_vreme_odrzavanja' => $this->faker->dateTime,
            'podkast_id' => Podkast::inRandomOrder()->first()->id ?? Podkast::factory()->create()->id,
            'fajl_id' => Fajl::inRandomOrder()->first()->id ?? Fajl::factory()->create()->id,
        ];
    }
}
