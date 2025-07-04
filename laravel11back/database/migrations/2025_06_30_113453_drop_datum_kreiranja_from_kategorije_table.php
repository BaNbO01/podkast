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
        Schema::table('kategorije', function (Blueprint $table) {
          $table->dropColumn('datum_kreiranja');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kategorije', function (Blueprint $table) {
            $table->date('datum_kreiranja');
        });
    }
};
