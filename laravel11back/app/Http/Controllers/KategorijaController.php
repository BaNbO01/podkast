<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kategorija;
use App\Http\Resources\KategorijaResource;
use Illuminate\Support\Facades\Auth;


class KategorijaController extends Controller
{
    public function index()
    {
        $kategorije = Kategorija::all(); 
        return KategorijaResource::collection($kategorije);
        
    }


    public function store(Request $request)
    {

        $user = Auth::user();

        if($user->role!='administrator'){
            return response()->json([
                'error' => 'Nemate dozvolu za dodavanje kategorije.',
            ], 403); 
        }
        
        
        $validated = $request->validate([
            'naziv' => 'required|string|max:255|unique:kategorije,naziv',
            
        ]);

        
        try {
            $kategorija = Kategorija::create([
                'naziv' => $validated['naziv'], 
            ]);

          
            return response()->json([
                'message' => 'Kategorija uspešno dodata!',
                'data' => $kategorija,
            ], 201); 
        } catch (\Exception $e) {
         
            return response()->json([
                'error' => 'Došlo je do greške pri dodavanju kategorije.',
            ], 500); 
        }
    }

}
