<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('omiljeni_podkasti', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained("users")->onDelete('cascade'); // veza sa korisnicima
            $table->foreignId('podkast_id')->constrained("podkasti")->onDelete('cascade'); // veza sa podkastima
            $table->timestamps();

            $table->unique(['user_id', 'podkast_id']); // obezbeđuje da isti korisnik ne može imati isti podkast više puta
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('omiljeni_podkasti');
    }
};
