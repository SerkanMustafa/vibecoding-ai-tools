<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorController extends Controller
{
    public function setup(Request $request)
    {
        $user = $request->user();

        $google2fa = new Google2FA();

        if (!$user->google2fa_secret) {
            $user->google2fa_secret = $google2fa->generateSecretKey();
            $user->save();
        }

        $qrCodeUrl = $google2fa->getQRCodeUrl(
            'Vibecoding',
            $user->email,
            $user->google2fa_secret
        );

        return response()->json([
            'secret' => $user->google2fa_secret,
            'qr_code_url' => $qrCodeUrl,
        ]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'code' => ['required', 'string'],
        ]);

        $user = $request->user();

        if (!$user->google2fa_secret) {
            return response()->json([
                'message' => '2FA is not set up for this user.'
            ], 422);
        }

        $google2fa = new Google2FA();

        $valid = $google2fa->verifyKey(
            $user->google2fa_secret,
            $request->code
        );

        if (!$valid) {
            return response()->json([
                'message' => 'Invalid 2FA code.'
            ], 422);
        }

        $user->two_factor_enabled = true;
        $user->save();

        return response()->json([
            'message' => '2FA verified and enabled successfully.'
        ]);
    }
}