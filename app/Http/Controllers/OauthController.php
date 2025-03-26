<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class OauthController extends Controller
{
    public function redirectToProvider() {
        return Socialite::driver('google')->redirect();
    }

    public function handleProviderCallback() {
        try {
            $user = Socialite::driver('google')->user();

            $findUser = User::where('gauth_id', $user->id)->first();

            if ($findUser) {
                Auth::login($findUser);

                return redirect('dashboard');
            } else {
                $newUser = User::create([
                    'name' => $user->getName(),
                    'email' => $user->getEmail(),
                    'gauth_id' => $user->getId(),
                    'gauth_type'=> 'google',
                    'password' => bcrypt('password'),
                ]);

                Auth::login($newUser);

                return redirect('dashboard');
            }
        } catch (Exception $e) {
            dd($e->getMessage());
        }
    }
}
