<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;
class PodkastResource extends JsonResource
{
   
    public function toArray($request)
    {
        $user = Auth::user();

        return [
            'id' => $this->id,
            'naziv' => $this->naziv,
            'opis' => $this->opis,
            'baner' => asset($this->putanja_do_banera),
            'kategorija'=>new KategorijaResource($this->kategorija),
            'epizode'=>EpizodaResource::collection($this->epizode),
            'kreator' => new UserResource($this->kreator),
            'omiljeni'=> $user ? $user->omiljeniPodkasti->contains($this->id) : false,
        ];
    }
}
