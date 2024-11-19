<?php

namespace App\Http\Controllers;

use App\Models\Podkast;
use Illuminate\Http\Request;
use App\Http\Resources\PodkastResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;


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
     
        try{
            $request->validate([
                'naziv' => 'required|string',
                'opis' => 'required|string',
                'kategorija_id' => 'required|exists:kategorije,id',
                'baner' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048', 
              
                
            ]);
    
            $user = Auth::user();
    
            $podkast = Podkast::create([
                'naziv' => $request->naziv,
                'opis' => $request->opis,
                'kategorija_id' => $request->kategorija_id,
                'putanja_do_banera' => $this->uploadBaner($request->file('baner'), $request->naziv), // Poziv za upload slike banera
                'kreator_id'=>$user->id,
            ]);
    
    
           
    
          
    
            return response()->json(['message' => 'Podkast je uspešno sačuvan', 'podkast' => $podkast], 201);
        }
        catch (\Exception $e) {
            return response()->json([
                'message' => 'Greška prilikom ažuriranja aukcije',
                'error' => $e->getMessage()
            ], 500);
        }
        
        // Validacija podataka
       
    }

    // Funkcija za upload banera
    private function uploadBaner($file, $naziv)
    {
        // Sanitizovanje naziva za ime fajla
        $sanitizedNaziv = preg_replace('/[^a-zA-Z0-9_-]/', '_', $naziv);
        $extension = $file->getClientOriginalExtension(); 
        $filename = $sanitizedNaziv . '.' . $extension;

        // Putanja gde će se sačuvati slika
        $path = 'public/app/' . $sanitizedNaziv;

        // Proverava da li direktorijum postoji, ako ne, pravi ga
        if (!Storage::exists($path)) {
            Storage::makeDirectory($path);
        }

        // Sprema sliku na specifičnu putanju
        $pathFile = $file->storeAs($path, $filename);

        return str_replace('public/', 'storage/', $pathFile); // Vraća putanju do banera
    }




    public function destroy($id)
{
    try {
        // Pronađi podkast
        $podkast = Podkast::findOrFail($id);

        // Pronađi baner podkasta i obriši fajl
        if ($podkast->putanja_do_banera) {
            $putanjaBanera = public_path($podkast->putanja_do_banera);
            Log::info($putanjaBanera);
            
            // Ukloni 'storage/app'
            $putanja = str_replace('/', '\\', $putanjaBanera); 
            Log::info($putanja);

            $direktorijum = dirname($putanja);
            Log::info($direktorijum);
            if (File::exists($direktorijum)) {
                File::deleteDirectory($direktorijum);
            }
        }

        // Obriši sve epizode povezane sa podkastom koristeći Eloquent relaciju
        $podkast->epizode->each(function ($epizoda) {
            // Pronađi fajl vezan za svaku epizodu i obriši
            if ($epizoda->fajl) {
                $putanjaFajla = public_path($epizoda->fajl->putanja);
                Log::info($putanjaFajla);
                $putanja = str_replace('/', '\\', $putanjaFajla);
                Log::info($putanja);

                $direktorijum = dirname($putanja);
                Log::info($direktorijum);
                if (File::exists($direktorijum)) {
                    File::deleteDirectory($direktorijum);
                }

                // Takođe, obriši fajl iz baze
                $epizoda->fajl->delete();
            }

            // Obriši epizodu
            $epizoda->delete();
        });

        // Na kraju obriši podkast
        $podkast->delete();

        return response()->json(['message' => 'Podkast i sve njegove epizode su uspešno obrisani.'], 200);
    } catch (\Exception $e) {
        Log::error('Greška prilikom brisanja podkasta: ' . $e->getMessage());
        return response()->json(['message' => 'Došlo je do greške prilikom brisanja podkasta.'], 500);
    }
}



}

