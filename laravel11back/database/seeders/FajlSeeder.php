<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Fajl;

class FajlSeeder extends Seeder
{
    public function run()
    {
        Fajl::factory()->count(20)->create();
    }
}
