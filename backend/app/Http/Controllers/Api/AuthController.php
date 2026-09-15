<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use OpenApi\Attributes as OA;

class AuthController extends Controller
{
    #[OA\Post(
        path: "/login",
        summary: "Login pengguna",
        description: "Melakukan autentikasi menggunakan email/username dan password, mengembalikan token Bearer Sanctum.",
        tags: ["Auth"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["login", "password"],
                properties: [
                    new OA\Property(property: "login", type: "string", example: "admin@trashure.com", description: "Email atau Username pengguna"),
                    new OA\Property(property: "password", type: "string", format: "password", example: "password", description: "Password akun pengguna"),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Login berhasil",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Login berhasil."),
                        new OA\Property(property: "token", type: "string", example: "1|laravel_sanctum_token..."),
                        new OA\Property(property: "token_type", type: "string", example: "Bearer"),
                        new OA\Property(property: "expires_in", type: "integer", nullable: true, example: 3600),
                        new OA\Property(property: "expires_at", type: "string", format: "date-time", nullable: true, example: "2026-09-14T13:15:00+07:00"),
                        new OA\Property(
                            property: "user",
                            type: "object",
                            properties: [
                                new OA\Property(property: "id", type: "integer", example: 1),
                                new OA\Property(property: "username", type: "string", example: "admin_utama"),
                                new OA\Property(property: "email", type: "string", format: "email", example: "admin@trashure.com"),
                                new OA\Property(property: "role", type: "string", example: "admin"),
                                new OA\Property(property: "status", type: "string", example: "aktif"),
                            ]
                        ),
                    ]
                )
            ),
            new OA\Response(
                response: 401,
                description: "Kredensial tidak valid",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Email/username atau password salah.")
                    ]
                )
            ),
            new OA\Response(
                response: 403,
                description: "Akun nonaktif",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Akun tidak aktif.")
                    ]
                )
            ),
            new OA\Response(
                response: 422,
                description: "Validasi form gagal",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "The login field is required."),
                        new OA\Property(property: "errors", type: "object")
                    ]
                )
            )
        ]
    )]
    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->login)
            ->orWhere('username', $request->login)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email/username atau password salah.'
            ], 401);
        }

        if ($user->status !== 'aktif') {
            return response()->json([
                'message' => 'Akun tidak aktif.'
            ], 403);
        }

        $accessToken = $user->createToken('trashure-token');

        $token = $accessToken->plainTextToken;

        $expiration = config('sanctum.expiration');

        $expiresAt = $expiration
            ? now()->addMinutes($expiration)
            : null;

        return response()->json([
            'message' => 'Login berhasil.',
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => $expiration
                ? $expiration * 60
                : null,
            'expires_at' => $expiresAt?->toIso8601String(),

            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
            ],
        ]);
    }

    #[OA\Post(
        path: "/logout",
        summary: "Logout pengguna",
        description: "Menghapus token akses pengguna yang sedang aktif.",
        tags: ["Auth"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "Logout berhasil",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Logout berhasil.")
                    ]
                )
            ),
            new OA\Response(
                response: 401,
                description: "Unauthenticated",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Unauthenticated.")
                    ]
                )
            )
        ]
    )]
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil.'
        ]);
    }

    #[OA\Get(
        path: "/me",
        summary: "Profil pengguna login",
        description: "Mendapatkan data informasi akun pengguna yang sedang login beserta relasinya.",
        tags: ["Auth"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "Data profil user",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: "user",
                            type: "object",
                            properties: [
                                new OA\Property(property: "id", type: "integer", example: 1),
                                new OA\Property(property: "username", type: "string", example: "warga_budi"),
                                new OA\Property(property: "email", type: "string", example: "budi@gmail.com"),
                                new OA\Property(property: "role", type: "string", example: "warga"),
                                new OA\Property(property: "status", type: "string", example: "aktif"),
                            ]
                        )
                    ]
                )
            ),
            new OA\Response(
                response: 401,
                description: "Unauthenticated",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Unauthenticated.")
                    ]
                )
            )
        ]
    )]
    public function me(Request $request)
    {
        $user = $request->user();
        $user->load(['admin', 'warga', 'petugas', 'pengepul']);

        return response()->json([
            'user' => $user
        ]);
    }
}