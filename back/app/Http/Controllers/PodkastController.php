<?php

namespace App\Http\Controllers;

use App\Models\Podkast;
use Illuminate\Http\Request;
use App\Http\Resources\PodkastResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
class PodkastController extends Controller
{
    public function index(Request $request)
    {
        $query = Podkast::query();
    
       
        if ($request->filled('naziv')) {
            $query->where('naziv', 'like', '%' . $request->naziv . '%');
        }
    
        $perPage = $request->input('per_page', 10);
        $page = $request->input('page', 1); 
        
       
        $podkasti = $query->paginate($perPage);
    
   
        return PodkastResource::collection($podkasti);
    }
    

    public function show($id)
    {
        $podkast = Podkast::with('epizode')->findOrFail($id);
        return new PodkastResource($podkast);
    }







    public function store(Request $request)
    {
     
        Log::info($request->kreatori);
        
        // Validacija podataka
        $request->validate([
            'naziv' => 'required|string',
            'opis' => 'required|string',
            'kategorija_id' => 'required|exists:kategorije,id',
            'baner' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048', 
            'kreatori'=>'required' 
            
        ]);

        
        $podkast = Podkast::create([
            'naziv' => $request->naziv,
            'opis' => $request->opis,
            'kategorija_id' => $request->kategorija_id,
            'putanja_do_banera' => $this->uploadBaner($request->file('baner'), $request->naziv), // Poziv za upload slike banera
        ]);


        $kreatoriIds = json_decode($request->kreatori);
        $podkast->kreatori()->attach($request->kreatoriIds);

        return response()->json(['message' => 'Podkast je uspešno sačuvan', 'podkast' => $podkast], 201);
    }

    // Funkcija za upload banera
    private function uploadBaner($file, $naziv)
    {
        // Sanitizovanje naziva za ime fajla
        $sanitizedNaziv = preg_replace('/[^a-zA-Z0-9_-]/', '_', $naziv);
        $extension = $file->getClientOriginalExtension(); 
        $filename = $sanitizedNaziv . '.' . $extension;

        // Putanja gde će se sačuvati slika
        $path = 'storage/' . $sanitizedNaziv;

        // Proverava da li direktorijum postoji, ako ne, pravi ga
        if (!Storage::exists($path)) {
            Storage::makeDirectory($path);
        }

        // Sprema sliku na specifičnu putanju
        $pathFile = $file->storeAs($path, $filename);

        return $pathFile; // Vraća putanju do banera
    }




}

