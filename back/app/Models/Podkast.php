<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Podkast extends Model
{
    protected $table = 'podkasti';
    use HasFactory;
  
    protected $fillable = ['naziv', 'opis', 'putanja_do_banera','kategorija_id','kreator_id'];
  
    public function kreator()
    {
        return $this->belongsTo(User::class, 'kreator_id');
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

