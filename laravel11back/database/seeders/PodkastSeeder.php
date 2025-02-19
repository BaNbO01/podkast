<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Podkast;
use App\Models\User;

class PodkastSeeder extends Seeder
{
    public function run()
    {
        Podkast::factory()->count(10)->create();
        $users = User::all();
        $users->each(function ($user) {
            
            $podkasti = Podkast::inRandomOrder()->take(3)->pluck('id');
            $user->omiljeniPodkasti()->attach($podkasti);
        });
    }
}
