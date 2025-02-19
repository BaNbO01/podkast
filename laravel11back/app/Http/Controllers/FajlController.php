<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Fajl;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;

class FajlController extends Controller
{

    public function audio($id)
    {
        try {
            $fajl = Fajl::findOrFail($id);
            $relativePath = $fajl->putanja;
            $absolutePath = public_path($relativePath);
            if (!File::exists($absolutePath)) {
                return response()->json(['error' => 'Fajl ne postoji'], 404);
            }
    
            return response()->stream(function () use ($absolutePath) {
                readfile($absolutePath);
            }, 200, [
                'Content-Type' => $fajl->tip,
                'Accept-Ranges' => 'bytes',
                'Content-Length' => filesize($absolutePath),
            ]);
        } catch (\Exception $e) {
            Log::error('Greška prilikom učitavanja audio fajla: ' . $e->getMessage());
            return response()->json(['error' => 'Došlo je do greške prilikom učitavanja audio fajla.'], 500);
        }
    }
   
}
