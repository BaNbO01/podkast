<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Epizoda;
use App\Models\Fajl;
use App\Models\Podkast;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\EpizodaResource;

class EpizodaController extends Controller
{
    public function store(Request $request)
    {
        Log::info('Request Data:', $request->all());
        $request->validate([
            'naziv' => 'required|string',
            'datum_i_vreme_odrzavanja' => 'required|date',
            'podkast_id' => 'required|exists:podkasti,id',
          
        ]);
    
      
        $epizoda = Epizoda::create([
            'naziv' => $request->naziv,
            'datum_i_vreme_odrzavanja' => $request->datum_i_vreme_odrzavanja,
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

        $podcastPath = 'storage/' . $sanitizedNaziv;
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
            'putanja' => $pathFile,
            'tip' => $file->getMimeType(),
        ]);
    }


    public function show($id)
    {
        $epizoda = Epizoda::with('fajl')->findOrFail($id);
        return new EpizodaResource($epizoda);
    }
    

}
