<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Epizoda;

class EpizodaSeeder extends Seeder
{
    public function run()
    {
        Epizoda::factory()->count(30)->create();
    }
}
