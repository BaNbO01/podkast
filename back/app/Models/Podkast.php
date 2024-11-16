<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Podkast extends Model
{
    protected $table = 'podkasti';
    use HasFactory;
  
    protected $fillable = ['naziv', 'opis', 'putanja_do_banera', 'kategorija_id'];
  
    public function kreatori()
    {
        return $this->belongsToMany(User::class, 'korisnik_podkast');
    }

    public function kategorija()
    {
        return $this->belongsTo(Kategorija::class);
    }

    public function epizode()
    {
        return $this->hasMany(Epizoda::class);
    }
}

