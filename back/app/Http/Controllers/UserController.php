<?php
 
 namespace App\Http\Controllers;

 use App\Models\User;
 use Illuminate\Http\Request;
 use  App\Http\Resources\UserResource;
 
 class UserController extends Controller
 {
     public function search(Request $request)
     {
         $username = $request->input('username'); 
         $users = User::when($username, function ($query, $username) {
                 return $query->where('username', 'like', '%' . $username . '%');
             })
             ->paginate(10);
 
         return UserResource::collection($users);
     }
 }