<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EpizodaController;
use App\Http\Controllers\PodkastController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\KategorijaController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');




// Route::middleware('auth:sanctum')->group(function () {
    
   
   
//     Route::middleware('role:gledalac|kreator')->group(function () {
//         Route::get('/podkasti', [PodkastController::class, 'index']);
//         Route::get('/podkasti/{id}', [PodkastController::class, 'show']);
//         Route::get('/epizode/{id}', [EpizodaController::class, 'show']);
//         Route::get('/users/search', [UserController::class, 'search']);
//     });

//     Route::middleware('role:kreator')->group(function () {
//         Route::post('/epizode', [EpizodaController::class, 'store']);
//     });

// });


Route::get('/podkasti', [PodkastController::class, 'index']);
Route::post('/podkasti', [PodkastController::class, 'store']);
Route::get('/podkasti/{id}', [PodkastController::class, 'show']);
Route::get('/epizode/{id}', [EpizodaController::class, 'show']);
Route::get('/users/search', [UserController::class, 'search']);
Route::get('/kategorije', [KategorijaController::class, 'index']);
        





