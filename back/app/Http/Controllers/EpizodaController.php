<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Epizoda;
use App\Models\Fajl;
use App\Models\Podkast;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\EpizodaResource;
use Illuminate\Support\Facades\File;

class EpizodaController extends Controller
{
    public function store(Request $request)
    {
        Log::info('Request Data:', $request->all());
        $request->validate([
            'naziv' => 'required|string',
            'podkast_id' => 'required|exists:podkasti,id',
          
        ]);
    
      
        $epizoda = Epizoda::create([
            'naziv' => $request->naziv,
            'datum_i_vreme_odrzavanja' =>now(),
            'podkast_id' => $request->podkast_id,
            'fajl_id'=>null
        ]);
    
         $podkast = Podkast::findOrFail($request->podkast_id);


   
        $fajl = $this->uploadFajl($request->file('file'), $request->naziv,$podkast);
        $epizoda->fajl_id = $fajl->id;
        $epizoda->save();
    
        return response()->json(['message' => 'Epizoda i fajl su uspešno sačuvani', 'epizoda' => $epizoda, 'fajl' => $fajl], 201);
    }
    
    private function uploadFajl($file, $naziv,$podkast)
    {
        $originalExtension = $file->getClientOriginalExtension(); 
        $filename = $naziv . '.' . $originalExtension;
        $sanitizedNaziv = preg_replace('/[^a-zA-Z0-9_-]/', '_', $podkast->naziv);

        $podcastPath = 'public/app/' . $sanitizedNaziv;
        if (!Storage::exists($podcastPath)) {
             Storage::makeDirectory($podcastPath);
            }

            $sanitizedNaziv = preg_replace('/[^a-zA-Z0-9_-]/', '_', $naziv);
            $path = $podcastPath . '/'. $sanitizedNaziv;
            if(!Storage::exists($path))
            {
                Storage::makeDirectory($path);
            }
        
        $pathFile = $file->storeAs($path, $filename);

        return Fajl::create([
            'naziv' => $filename,
            'putanja' => str_replace('public/', 'storage/', $pathFile),
            'tip' => $file->getMimeType(),
        ]);
    }


    public function show($id)
    {
        $epizoda = Epizoda::with('fajl')->findOrFail($id);
        return new EpizodaResource($epizoda);
    }


    public function destroy($id)
    {
        try {
            // Pronađi epizodu
            $epizoda = Epizoda::findOrFail($id);
    
            // Pronađi fajl vezan za epizodu
            $fajl = $epizoda->fajl;
    
            if ($fajl) {
                // Uzmi putanju fajla
                $putanjaFajla = public_path($fajl->putanja);
                Log::info($putanjaFajla);
                // Ukloni 'storage/app'
                $putanja = str_replace('/', '\\', $putanjaFajla); 
                Log::info($putanja);
                
                $direktorijum = dirname($putanja);
                Log::info($direktorijum);
                if (File::exists($direktorijum)) {
                    File::deleteDirectory($direktorijum);
                }
    
                // Takođe, obriši fajl iz baze
                $fajl->delete();
            }
    
            // Obriši epizodu
            $epizoda->delete();
    
            return response()->json(['message' => 'Epizoda uspešno obrisana.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Došlo je do greške prilikom brisanja epizode.'], 500);
        }
    }

}
