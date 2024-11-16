<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fajl extends Model
{
    protected $table = 'fajlovi';
    use HasFactory;

    protected $fillable = ['naziv', 'putanja', 'tip'];

    public function epizoda()
    {
        return $this->hasOne(Epizoda::class);
    }
}
