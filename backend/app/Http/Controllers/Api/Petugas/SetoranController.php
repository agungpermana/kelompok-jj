<?php

namespace App\Http\Controllers\Api\Petugas;

use App\Http\Controllers\Controller;
use App\Models\JadwalPenjemputan;
use App\Models\JenisSampah;
use App\Models\TransaksiSetoran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use OpenApi\Attributes as OA;

class SetoranController extends Controller
{
    #[OA\Post(
        path: "/petugas/jadwal/{jadwalId}/setoran/jenis",
        summary: "Catat jenis sampah aktual (Petugas)",
        description: "Mencatat jenis-jenis sampah yang ditemukan secara aktual di lokasi penjemputan.",
        tags: ["Petugas - Setoran"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "jadwalId",
                in: "path",
                required: true,
                description: "ID Jadwal Penjemputan",
                schema: new OA\Schema(type: "integer", example: 1)
            )
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["jenis_sampah"],
                properties: [
                    new OA\Property(
                        property: "jenis_sampah",
                        type: "array",
                        description: "Daftar ID jenis sampah aktual yang ada di lokasi",
                        items: new OA\Items(
                            type: "object",
                            required: ["jenis_sampah_id"],
                            properties: [
                                new OA\Property(property: "jenis_sampah_id", type: "integer", example: 1)
                            ]
                        )
                    )
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Jenis sampah aktual berhasil dicatat",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Jenis sampah aktual berhasil dicatat."),
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
                description: "Jadwal atau Profil Petugas tidak ditemukan",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Jadwal penjemputan tidak ditemukan.")
                    ]
                )
            ),
            new OA\Response(
                response: 422,
                description: "Validasi gagal",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "The jenis sampah field is required.")
                    ]
                )
            )
        ]
    )]
    public function catatJenisAktual(Request $request, $jadwalId)
    {
        $petugas = $request->user()->petugas;

        if (!$petugas) {
            return response()->json([
                'message' => 'Profil petugas tidak ditemukan.',
            ], 404);
        }

        $jadwal = JadwalPenjemputan::where('jadwal_id', $jadwalId)
            ->where('petugas_id', $petugas->petugas_id)
            ->with('pengajuanPenjemputan')
            ->first();

        if (!$jadwal) {
            return response()->json([
                'message' => 'Jadwal penjemputan tidak ditemukan.',
            ], 404);
        }

        $request->validate([
            'jenis_sampah' => 'required|array|min:1',
            'jenis_sampah.*.jenis_sampah_id'
                => 'required|integer|exists:jenis_sampah,jenis_sampah_id',
        ]);

        $jenisSampah = collect($request->jenis_sampah)
            ->map(function ($item) {
                return JenisSampah::find($item['jenis_sampah_id']);
            })
            ->values();

        return response()->json([
            'message' => 'Jenis sampah aktual berhasil dicatat.',
            'data' => [
                'jadwal_id' => $jadwal->jadwal_id,
                'pengajuan_id' => $jadwal->pengajuan_id,
                'jenis_sampah_aktual' => $jenisSampah,
            ],
        ]);
    }

    #[OA\Post(
        path: "/petugas/jadwal/{jadwalId}/setoran/berat",
        summary: "Catat berat aktual sampah (Petugas)",
        description: "Mencatat berat aktual dari masing-masing jenis sampah yang telah ditimbang di lokasi.",
        tags: ["Petugas - Setoran"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "jadwalId",
                in: "path",
                required: true,
                description: "ID Jadwal Penjemputan",
                schema: new OA\Schema(type: "integer", example: 1)
            )
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["detail_sampah"],
                properties: [
                    new OA\Property(
                        property: "detail_sampah",
                        type: "array",
                        description: "Daftar rincian berat untuk masing-masing jenis sampah",
                        items: new OA\Items(
                            type: "object",
                            required: ["jenis_sampah_id", "berat_aktual"],
                            properties: [
                                new OA\Property(property: "jenis_sampah_id", type: "integer", example: 1),
                                new OA\Property(property: "berat_aktual", type: "number", format: "float", example: 5.5, description: "Berat aktual dalam kilogram"),
                            ]
                        )
                    )
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Berat aktual berhasil dicatat",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Berat aktual berhasil dicatat."),
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
                description: "Jadwal atau Profil Petugas tidak ditemukan",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Jadwal penjemputan tidak ditemukan.")
                    ]
                )
            ),
            new OA\Response(
                response: 422,
                description: "Validasi gagal",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "The detail sampah field is required.")
                    ]
                )
            )
        ]
    )]
    public function catatBeratAktual(Request $request, $jadwalId)
    {
        $petugas = $request->user()->petugas;

        if (!$petugas) {
            return response()->json([
                'message' => 'Profil petugas tidak ditemukan.',
            ], 404);
        }

        $jadwal = JadwalPenjemputan::where('jadwal_id', $jadwalId)
            ->where('petugas_id', $petugas->petugas_id)
            ->with('pengajuanPenjemputan')
            ->first();

        if (!$jadwal) {
            return response()->json([
                'message' => 'Jadwal penjemputan tidak ditemukan.',
            ], 404);
        }

        $request->validate([
            'detail_sampah' => 'required|array|min:1',

            'detail_sampah.*.jenis_sampah_id'
                => 'required|integer|exists:jenis_sampah,jenis_sampah_id',

            'detail_sampah.*.berat_aktual'
                => 'required|numeric|min:0.01',
        ]);

        $detailSampah = collect($request->detail_sampah)
            ->map(function ($item) {
                $jenisSampah = JenisSampah::find($item['jenis_sampah_id']);

                return [
                    'jenis_sampah_id' => $jenisSampah->jenis_sampah_id,
                    'nama_jenis_sampah' => $jenisSampah->nama_jenis_sampah,
                    'berat_aktual' => $item['berat_aktual'],
                ];
            })
            ->values();

        $totalBeratAktual = $detailSampah->sum('berat_aktual');

        return response()->json([
            'message' => 'Berat aktual berhasil dicatat.',
            'data' => [
                'jadwal_id' => $jadwal->jadwal_id,
                'pengajuan_id' => $jadwal->pengajuan_id,
                'detail_sampah' => $detailSampah,
                'total_berat_aktual' => $totalBeratAktual,
            ],
        ]);
    }

    #[OA\Post(
        path: "/petugas/jadwal/{jadwalId}/setoran",
        summary: "Simpan transaksi setoran sampah (Petugas)",
        description: "Menyimpan seluruh transaksi setoran penjemputan sampah, menghitung akumulasi berat dan poin sementara berdasarkan harga aktif.",
        tags: ["Petugas - Setoran"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "jadwalId",
                in: "path",
                required: true,
                description: "ID Jadwal Penjemputan",
                schema: new OA\Schema(type: "integer", example: 1)
            )
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["konfirmasi_pengambilan", "detail_sampah"],
                properties: [
                    new OA\Property(property: "konfirmasi_pengambilan", type: "string", enum: ["ya", "tidak"], example: "ya", description: "Konfirmasi apakah sampah berhasil diambil"),
                    new OA\Property(
                        property: "detail_sampah",
                        type: "array",
                        description: "Daftar jenis dan berat aktual sampah",
                        items: new OA\Items(
                            type: "object",
                            required: ["jenis_sampah_id", "berat_aktual"],
                            properties: [
                                new OA\Property(property: "jenis_sampah_id", type: "integer", example: 1),
                                new OA\Property(property: "berat_aktual", type: "number", format: "float", example: 5.5),
                            ]
                        )
                    )
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Transaksi setoran berhasil dibuat",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Transaksi setoran berhasil dibuat."),
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
                description: "Jadwal, Pengajuan, atau Profil Petugas tidak ditemukan",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Jadwal penjemputan tidak ditemukan.")
                    ]
                )
            ),
            new OA\Response(
                response: 422,
                description: "Validasi form gagal",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "The detail sampah field is required.")
                    ]
                )
            )
        ]
    )]
    public function store(Request $request, $jadwalId)
    {
        $petugas = $request->user()->petugas;

        if (!$petugas) {
            return response()->json([
                'message' => 'Profil petugas tidak ditemukan.',
            ], 404);
        }

        $jadwal = JadwalPenjemputan::where('jadwal_id', $jadwalId)
            ->where('petugas_id', $petugas->petugas_id)
            ->with('pengajuanPenjemputan.warga')
            ->first();

        if (!$jadwal) {
            return response()->json([
                'message' => 'Jadwal penjemputan tidak ditemukan.',
            ], 404);
        }

        if (!$jadwal->pengajuanPenjemputan) {
            return response()->json([
                'message' => 'Pengajuan penjemputan tidak ditemukan.',
            ], 404);
        }

        $request->validate([
            'konfirmasi_pengambilan' => 'required|in:ya,tidak',

            'detail_sampah' => 'required|array|min:1',

            'detail_sampah.*.jenis_sampah_id'
                => 'required|integer|exists:jenis_sampah,jenis_sampah_id',

            'detail_sampah.*.berat_aktual'
                => 'required|numeric|min:0.01',
        ]);

        $warga = $jadwal->pengajuanPenjemputan->warga;

        if (!$warga) {
            return response()->json([
                'message' => 'Data warga pada pengajuan tidak ditemukan.',
            ], 404);
        }

        $transaksi = DB::transaction(function () use (
            $request,
            $jadwal,
            $petugas,
            $warga
        ) {
            $transaksi = TransaksiSetoran::create([
                'pengajuan_id' => $jadwal->pengajuan_id,
                'jadwal_id' => $jadwal->jadwal_id,
                'warga_id' => $warga->warga_id,
                'petugas_id' => $petugas->petugas_id,
                'tanggal_setoran' => now(),
                'konfirmasi_pengambilan' => $request->konfirmasi_pengambilan,
                'status_validasi' => 'menunggu',
                'total_berat_aktual' => 0,
                'total_poin_sementara' => 0,
            ]);

            $totalBerat = 0;
            $totalPoin = 0;

            foreach ($request->detail_sampah as $item) {

                $jenis = JenisSampah::find($item['jenis_sampah_id']);

                if (!$jenis) {
                    continue;
                }

                $harga = $jenis->hargaSampah()
                    ->where('status', 'aktif')
                    ->whereDate('berlaku_mulai', '<=', now())
                    ->where(function ($query) {
                        $query->whereNull('berlaku_selesai')
                            ->orWhereDate('berlaku_selesai', '>=', now());
                    })
                    ->orderByDesc('berlaku_mulai')
                    ->first();

                if (!$harga) {
                    throw new \Exception(
                        "Harga sampah untuk {$jenis->nama_jenis_sampah} tidak ditemukan."
                    );
                }

                $berat = (float) $item['berat_aktual'];

                $poin = floor(
                    $berat * (int) $harga->nilai_poin_per_satuan
                );

                $transaksi->detailSetoran()->create([
                    'jenis_sampah_id' => $jenis->jenis_sampah_id,
                    'berat_aktual' => $berat,
                    'harga_satuan' => $harga->harga_per_satuan,
                    'nilai_poin_per_satuan' => $harga->nilai_poin_per_satuan,
                    'poin_sementara' => $poin,
                ]);

                $totalBerat += $berat;
                $totalPoin += $poin;
            }

            $transaksi->update([
                'total_berat_aktual' => $totalBerat,
                'total_poin_sementara' => $totalPoin,
            ]);

            return $transaksi;
        });

        $transaksi->load([
            'detailSetoran.jenisSampah',
            'warga',
            'petugas',
            'jadwalPenjemputan',
            'pengajuanPenjemputan',
        ]);

        return response()->json([
            'message' => 'Transaksi setoran berhasil dibuat.',
            'data' => $transaksi,
        ], 201);
    }

    #[OA\Patch(
        path: "/petugas/setoran/{setoranId}/validasi",
        summary: "Validasi transaksi setoran (Petugas)",
        description: "Melakukan verifikasi/validasi terhadap transaksi setoran sampah dengan status 'disetujui' atau 'ditolak'.",
        tags: ["Petugas - Setoran"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "setoranId",
                in: "path",
                required: true,
                description: "ID Transaksi Setoran",
                schema: new OA\Schema(type: "integer", example: 1)
            )
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["status_validasi"],
                properties: [
                    new OA\Property(property: "status_validasi", type: "string", enum: ["disetujui", "ditolak"], example: "disetujui", description: "Keputusan validasi setoran"),
                    new OA\Property(property: "catatan_validasi", type: "string", nullable: true, example: "Data dan berat sampah telah sesuai", description: "Catatan hasil validasi"),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Setoran berhasil divalidasi",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Setoran berhasil divalidasi."),
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
                description: "Transaksi Setoran atau Profil Petugas tidak ditemukan",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Transaksi setoran tidak ditemukan.")
                    ]
                )
            ),
            new OA\Response(
                response: 422,
                description: "Transaksi sudah divalidasi sebelumnya atau validasi gagal",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Transaksi setoran sudah divalidasi sebelumnya.")
                    ]
                )
            )
        ]
    )]
    public function validasi(Request $request, $setoranId)
    {
        $petugas = $request->user()->petugas;

        if (!$petugas) {
            return response()->json([
                'message' => 'Profil petugas tidak ditemukan.',
            ], 404);
        }

        $request->validate([
            'status_validasi' => 'required|in:disetujui,ditolak',
            'catatan_validasi' => 'nullable|string',
        ]);

        $transaksi = TransaksiSetoran::where(
                'setoran_id',
                $setoranId
            )
            ->where(
                'petugas_id',
                $petugas->petugas_id
            )
            ->with('detailSetoran')
            ->first();

        if (!$transaksi) {
            return response()->json([
                'message' => 'Transaksi setoran tidak ditemukan.',
            ], 404);
        }

        if ($transaksi->status_validasi !== 'menunggu') {
            return response()->json([
                'message' => 'Transaksi setoran sudah divalidasi sebelumnya.',
            ], 422);
        }

        $transaksi->update([
            'validator_petugas_id' => $petugas->petugas_id,
            'status_validasi' => $request->status_validasi,
            'catatan_validasi' => $request->catatan_validasi,
            'tanggal_validasi' => now(),
        ]);

        $transaksi->load([
            'detailSetoran.jenisSampah',
            'warga',
            'petugas',
            'validatorPetugas',
            'jadwalPenjemputan',
        ]);

        return response()->json([
            'message' => $request->status_validasi === 'disetujui'
                ? 'Setoran berhasil divalidasi.'
                : 'Setoran berhasil ditolak.',
            'data' => $transaksi,
        ]);
    }
}