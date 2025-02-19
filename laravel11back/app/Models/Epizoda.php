<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Epizoda extends Model
{
    protected $table = 'epizode';
    use HasFactory;

    protected $fillable = ['naziv', 'datum_i_vreme_odrzavanja', 'podkast_id', 'fajl_id'];

    public function podkast()
    {
        return $this->belongsTo(Podkast::class);
    }

    public function fajl()
    {
        return $this->belongsTo(Fajl::class);
    }

    protected $casts = [
        'datum_i_vreme_odrzavanja' => 'datetime', 
    ];
}
