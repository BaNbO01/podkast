<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PodkastResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'naziv' => $this->naziv,
            'opis' => $this->opis,
            'baner' => asset($this->putanja_do_banera),
            'epizode' => EpizodaResource::collection($this->epizode),
            'kreatori' => $this->kreatori->map(function ($kreator) {
                return [
                    'id' => $kreator->id,
                    'username' => $kreator->username,
                ];
            }),
        ];
    }
}
