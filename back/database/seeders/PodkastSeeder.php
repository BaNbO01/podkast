<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Podkast;
use App\Models\User;

class PodkastSeeder extends Seeder
{
    public function run()
    {
        $podkasti = Podkast::factory()->count(10)->create();

        foreach ($podkasti as $podkast) {
            $kreatori = User::where('role', 'kreator')->inRandomOrder()->take(2)->pluck('id');
            $podkast->kreatori()->attach($kreatori);
        }
    }
}
