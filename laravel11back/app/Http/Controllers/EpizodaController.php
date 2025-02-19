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

        $user = Auth::user();
        $podkast = Podkast::findOrFail($request->podkast_id);
        if($user->id==$podkast->kreator->id){
           
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
    
        


   
        $fajl = $this->uploadFajl($request->file('file'), $request->naziv,$podkast);
        $epizoda->fajl_id = $fajl->id;
        $epizoda->save();
    
        return response()->json(['message' => 'Epizoda i fajl su uspešno sačuvani', 'epizoda' => $epizoda, 'fajl' => $fajl], 201);
    }
        else{
            return response()->json([
                'error' => 'Nemate dozvolu za cuvanje epizode.',
            ], 403); 
        }
    }
    
    private function uploadFajl($file, $naziv,$podkast)
    {
        $originalExtension = $file->getClientOriginalExtension(); 
        $filename = $naziv . '.' . $originalExtension;
        $sanitizedNaziv = preg_replace('/[^a-zA-Z0-9_-]/', '_', $podkast->naziv);

        $podcastPath = 'app/' . $sanitizedNaziv;
        if (!Storage::exists($podcastPath)) {
             Storage::makeDirectory($podcastPath);
            }

            $sanitizedNaziv = preg_replace('/[^a-zA-Z0-9_-]/', '_', $naziv);
            $path = $podcastPath . '/'. $sanitizedNaziv;
            if(!Storage::exists($path))
            {
                Storage::makeDirectory($path);
            }
        
        $pathFile = $file->storeAs($path, $filename,"public");

        return Fajl::create([
            'naziv' => $filename,
            'putanja' =>  Storage::url($pathFile),
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

            $user = Auth::user();
          
            $epizoda = Epizoda::findOrFail($id);
            if($user->id==$epizoda->podkast->kreator->id){
            $fajl = $epizoda->fajl;
    
            if ($fajl) {
                $putanjaFajla = public_path($fajl->putanja);
                $putanja = str_replace('/', '\\', $putanjaFajla); 
                $direktorijum = dirname($putanja);
                if (File::exists($direktorijum)) {
                    File::deleteDirectory($direktorijum);
                }
    
                $fajl->delete();
            }
    
            $epizoda->delete();
    
            return response()->json(['message' => 'Epizoda uspešno obrisana.'], 200);

        }
            else{
                return response()->json([
                    'error' => 'Nemate dozvolu za brisanje epizode.',
                ], 403); 
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Došlo je do greške prilikom brisanja epizode.'], 500);
        }
    }

}
