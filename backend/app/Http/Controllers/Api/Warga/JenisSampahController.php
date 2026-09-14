<?php

namespace App\Http\Controllers\Api\Warga;

use App\Http\Controllers\Controller;
use App\Models\JenisSampah;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class JenisSampahController extends Controller
{
    #[OA\Get(
        path: "/warga/jenis-sampah",
        summary: "Daftar jenis sampah (Warga)",
        description: "Mengambil semua daftar jenis sampah yang berstatus aktif.",
        tags: ["Warga - Jenis Sampah"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "Data jenis sampah berhasil diambil",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Data jenis sampah berhasil diambil."),
                        new OA\Property(property: "data", type: "array", items: new OA\Items(type: "object"))
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
    public function index()
    {
        $jenisSampah = JenisSampah::where('status', 'aktif')
            ->orderBy('nama_jenis_sampah')
            ->get([
                'jenis_sampah_id',
                'nama_jenis_sampah',
                'satuan',
                'keterangan',
                'status',
            ]);

        return response()->json([
            'message' => 'Data jenis sampah berhasil diambil.',
            'data' => $jenisSampah,
        ]);
    }

    #[OA\Get(
        path: "/warga/jenis-sampah/{id}",
        summary: "Detail jenis sampah (Warga)",
        description: "Mengambil detail informasi jenis sampah tertentu berdasarkan ID.",
        tags: ["Warga - Jenis Sampah"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                description: "ID Jenis Sampah",
                schema: new OA\Schema(type: "integer", example: 1)
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Detail jenis sampah berhasil diambil",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Detail jenis sampah berhasil diambil."),
                        new OA\Property(property: "data", type: "object")
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
            ),
            new OA\Response(
                response: 404,
                description: "Jenis sampah tidak ditemukan",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Jenis sampah tidak ditemukan.")
                    ]
                )
            )
        ]
    )]
    public function show($id)
    {
        $jenisSampah = JenisSampah::where('jenis_sampah_id', $id)
            ->where('status', 'aktif')
            ->first();

        if (!$jenisSampah) {
            return response()->json([
                'message' => 'Jenis sampah tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'message' => 'Detail jenis sampah berhasil diambil.',
            'data' => $jenisSampah,
        ]);
    }
}