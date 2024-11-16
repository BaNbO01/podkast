<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kategorija;

class KategorijaController extends Controller
{
    public function index()
    {
        $kategorije = Kategorija::all(); 
        return response()->json([
            'status' => 'success',
            'data' => $kategorije,
        ]);
    }
}
