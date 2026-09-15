<?php

namespace App\Http\Controllers\Api\Warga;

use App\Http\Controllers\Controller;
use App\Models\PengajuanPenjemputan;
use App\Models\TransaksiSetoran;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class SetoranController extends Controller
{
    #[OA\Get(
        path: "/warga/setoran",
        summary: "Daftar riwayat setoran sampah (Warga)",
        description: "Mengambil riwayat seluruh transaksi setoran sampah dan pengajuan penjemputan milik warga yang sedang login beserta ringkasan statistik dan filter status.",
        tags: ["Warga - Setoran"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "status",
                in: "query",
                required: false,
                description: "Filter status validasi (semua, menunggu, disetujui, ditolak)",
                schema: new OA\Schema(type: "string", enum: ["semua", "menunggu", "disetujui", "ditolak"], example: "semua")
            ),
            new OA\Parameter(
                name: "bulan",
                in: "query",
                required: false,
                description: "Filter bulan setoran format YYYY-MM (contoh: 2026-09)",
                schema: new OA\Schema(type: "string", example: "2026-09")
            ),
            new OA\Parameter(
                name: "sort",
                in: "query",
                required: false,
                description: "Urutan data berdasarkan tanggal (terbaru, terlama)",
                schema: new OA\Schema(type: "string", enum: ["terbaru", "terlama"], example: "terbaru")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Riwayat setoran berhasil diambil",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Riwayat setoran berhasil diambil."),
                        new OA\Property(property: "data", type: "array", items: new OA\Items(type: "object")),
                        new OA\Property(
                            property: "ringkasan",
                            type: "object",
                            properties: [
                                new OA\Property(property: "total_setoran", type: "integer", example: 1),
                                new OA\Property(property: "total_berat_sampah", type: "number", format: "float", example: 5.2),
                                new OA\Property(property: "total_poin_diterima", type: "integer", example: 100),
                                new OA\Property(property: "menunggu_validasi", type: "integer", example: 1),
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
            ),
            new OA\Response(
                response: 404,
                description: "Profil warga tidak ditemukan",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Profil warga tidak ditemukan.")
                    ]
                )
            )
        ]
    )]
    public function index(Request $request)
    {
        $warga = $request->user()->warga;

        if (!$warga) {
            return response()->json([
                'message' => 'Profil warga tidak ditemukan.',
            ], 404);
        }

        // Ambil seluruh data pengajuan penjemputan warga
        $pengajuanList = PengajuanPenjemputan::where('warga_id', $warga->warga_id)
            ->with([
                'detailPengajuanSampah.jenisSampah',
                'jadwalPenjemputan.petugas',
                'transaksiSetoran.detailSetoran.jenisSampah',
                'transaksiSetoran.petugas',
                'transaksiSetoran.validatorPetugas',
                'transaksiSetoran.poinSementara',
            ])
            ->get();

        $processedPengajuanIds = $pengajuanList->pluck('pengajuan_id')->filter()->all();

        // Ambil transaksi setoran mandiri/langsung jika ada
        $standaloneSetoran = TransaksiSetoran::where('warga_id', $warga->warga_id)
            ->where(function ($q) use ($processedPengajuanIds) {
                $q->whereNull('pengajuan_id')
                  ->orWhereNotIn('pengajuan_id', $processedPengajuanIds);
            })
            ->with([
                'detailSetoran.jenisSampah',
                'petugas',
                'validatorPetugas',
                'poinSementara',
                'jadwalPenjemputan',
                'pengajuanPenjemputan',
            ])
            ->get();

        $items = collect();

        foreach ($pengajuanList as $p) {
            $items->push($this->formatPengajuanToSetoran($p));
        }

        foreach ($standaloneSetoran as $s) {
            $items->push($this->formatTransaksiSetoran($s));
        }

        // Ringkasan statistik akun warga
        $totalSetoran = $items->count();
        $totalBerat = round((float) $items->sum('total_berat_aktual'), 2);
        $totalPoin = (int) $items->where('status_validasi', 'disetujui')->sum('total_poin_sementara');
        $menungguValidasi = (int) $items->where('status_validasi', 'menunggu')->count();

        // Filter status
        $status = $request->query('status', 'semua');
        if ($status && $status !== 'semua') {
            if ($status === 'menunggu_validasi' || $status === 'menunggu') {
                $items = $items->where('status_validasi', 'menunggu');
            } elseif (in_array($status, ['disetujui', 'ditolak'])) {
                $items = $items->where('status_validasi', $status);
            }
        }

        // Filter bulan (YYYY-MM) jika disertakan
        if ($request->filled('bulan')) {
            $bulan = $request->query('bulan');
            $items = $items->filter(function ($item) use ($bulan) {
                return isset($item['tanggal_setoran']) && str_starts_with($item['tanggal_setoran'], $bulan);
            });
        }

        // Sorting
        $sort = $request->query('sort', 'terbaru');
        if ($sort === 'terlama') {
            $items = $items->sortBy('tanggal_setoran')->values();
        } else {
            $items = $items->sortByDesc('tanggal_setoran')->values();
        }

        return response()->json([
            'message' => 'Riwayat setoran berhasil diambil.',
            'data' => $items,
            'ringkasan' => [
                'total_setoran' => $totalSetoran,
                'total_berat_sampah' => $totalBerat,
                'total_poin_diterima' => $totalPoin,
                'menunggu_validasi' => $menungguValidasi,
            ],
        ]);
    }

    #[OA\Get(
        path: "/warga/setoran/{id}",
        summary: "Detail riwayat setoran sampah (Warga)",
        description: "Mengambil rincian informasi satu transaksi setoran sampah milik warga berdasarkan ID setoran atau ID pengajuan.",
        tags: ["Warga - Setoran"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                description: "ID Transaksi Setoran atau Pengajuan",
                schema: new OA\Schema(type: "integer", example: 1)
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Detail setoran berhasil diambil",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Detail setoran berhasil diambil."),
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
                description: "Setoran atau profil warga tidak ditemukan",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Setoran tidak ditemukan.")
                    ]
                )
            )
        ]
    )]
    public function show(Request $request, $id)
    {
        $warga = $request->user()->warga;

        if (!$warga) {
            return response()->json([
                'message' => 'Profil warga tidak ditemukan.',
            ], 404);
        }

        // Coba cari di TransaksiSetoran
        $transaksi = TransaksiSetoran::where('setoran_id', $id)
            ->where('warga_id', $warga->warga_id)
            ->with([
                'detailSetoran.jenisSampah',
                'petugas',
                'validatorPetugas',
                'poinSementara',
                'jadwalPenjemputan',
                'pengajuanPenjemputan.detailPengajuanSampah.jenisSampah',
            ])
            ->first();

        if ($transaksi) {
            return response()->json([
                'message' => 'Detail setoran berhasil diambil.',
                'data' => $this->formatTransaksiSetoran($transaksi),
            ]);
        }

        // Coba cari di PengajuanPenjemputan
        $pengajuan = PengajuanPenjemputan::where('pengajuan_id', $id)
            ->where('warga_id', $warga->warga_id)
            ->with([
                'detailPengajuanSampah.jenisSampah',
                'jadwalPenjemputan.petugas',
                'transaksiSetoran.detailSetoran.jenisSampah',
                'transaksiSetoran.petugas',
                'transaksiSetoran.validatorPetugas',
                'transaksiSetoran.poinSementara',
            ])
            ->first();

        if ($pengajuan) {
            return response()->json([
                'message' => 'Detail setoran berhasil diambil.',
                'data' => $this->formatPengajuanToSetoran($pengajuan),
            ]);
        }

        return response()->json([
            'message' => 'Setoran tidak ditemukan.',
        ], 404);
    }

    private function extractPreferensiJadwal($pengajuan): array
    {
        if (!$pengajuan) {
            return [
                'tanggal' => null,
                'waktu' => null,
            ];
        }

        // 1. Cek jadwal resmi jika sudah ditetapkan oleh admin / petugas
        if ($pengajuan->jadwalPenjemputan) {
            $tgl = $pengajuan->jadwalPenjemputan->tanggal_penjemputan;
            $wkt = $pengajuan->jadwalPenjemputan->waktu_penjemputan;
            return [
                'tanggal' => $tgl,
                'waktu' => substr((string) $wkt, 0, 5) . ' WIB',
            ];
        }

        // 2. Cek catatan pengajuan: "Preferensi Jadwal: YYYY-MM-DD (Sesi Waktu)"
        if ($pengajuan->catatan && preg_match('/Preferensi Jadwal:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})(?:\s*\((.*?)\))?(?:\s*\||$)/is', $pengajuan->catatan, $matches)) {
            $tgl = $matches[1];
            $sesi = isset($matches[2]) ? trim($matches[2]) : '';
            return [
                'tanggal' => $tgl,
                'waktu' => $sesi ?: '08:00 - 11:00 (Pagi)',
            ];
        }

        // 3. Fallback jika tidak tertera di catatan: H+1 dari tanggal pengajuan
        $tglDefault = $pengajuan->tanggal_pengajuan 
            ? $pengajuan->tanggal_pengajuan->copy()->addDay()->format('Y-m-d') 
            : now()->addDay()->format('Y-m-d');

        return [
            'tanggal' => $tglDefault,
            'waktu' => '08:00 - 11:00 (Pagi)',
        ];
    }

    private function formatPengajuanToSetoran(PengajuanPenjemputan $pengajuan): array
    {
        $hasTransaksi = $pengajuan->transaksiSetoran !== null;
        $t = $pengajuan->transaksiSetoran;

        if ($hasTransaksi && $t) {
            return $this->formatTransaksiSetoran($t);
        }

        $preferensi = $this->extractPreferensiJadwal($pengajuan);
        $waktuPerkiraanString = $preferensi['tanggal'] ? "{$preferensi['tanggal']} 08:00:00" : null;

        // Pengajuan yang belum memiliki transaksi setoran
        $detailSetoran = $pengajuan->detailPengajuanSampah->map(function ($d) {
            return [
                'detail_setoran_id' => $d->detail_pengajuan_id,
                'setoran_id' => $d->pengajuan_id,
                'jenis_sampah_id' => $d->jenis_sampah_id,
                'berat_aktual' => (float) $d->perkiraan_berat,
                'harga_satuan' => 0,
                'nilai_poin_per_satuan' => 0,
                'poin_sementara' => 0,
                'jenis_sampah' => $d->jenisSampah ? [
                    'jenis_sampah_id' => $d->jenisSampah->jenis_sampah_id,
                    'nama_jenis_sampah' => $d->jenisSampah->nama_jenis_sampah,
                    'satuan' => $d->jenisSampah->satuan,
                    'keterangan' => $d->jenisSampah->keterangan,
                ] : null,
            ];
        })->values()->all();

        return [
            'setoran_id' => $pengajuan->pengajuan_id,
            'pengajuan_id' => $pengajuan->pengajuan_id,
            'jadwal_id' => $pengajuan->jadwalPenjemputan ? $pengajuan->jadwalPenjemputan->jadwal_id : null,
            'warga_id' => $pengajuan->warga_id,
            'petugas_id' => $pengajuan->jadwalPenjemputan ? $pengajuan->jadwalPenjemputan->petugas_id : null,
            'validator_petugas_id' => null,
            // Jika belum divalidasi, tampilkan waktu perkiraan sesuai permintaan pengajuan
            'tanggal_setoran' => $waktuPerkiraanString ?? ($pengajuan->tanggal_pengajuan ? $pengajuan->tanggal_pengajuan->format('Y-m-d H:i:s') : now()->format('Y-m-d H:i:s')),
            'perkiraan_tanggal_jemput' => $preferensi['tanggal'],
            'perkiraan_waktu_jemput' => $preferensi['waktu'],
            'tanggal_diajukan' => $pengajuan->tanggal_pengajuan ? $pengajuan->tanggal_pengajuan->format('Y-m-d H:i:s') : ($pengajuan->created_at ? $pengajuan->created_at->format('Y-m-d H:i:s') : null),
            'konfirmasi_pengambilan' => '0',
            'status_validasi' => ($pengajuan->status_pengajuan === 'dibatalkan' ? 'ditolak' : 'menunggu'),
            'catatan_validasi' => $pengajuan->catatan ? 'Catatan Pengajuan: ' . $pengajuan->catatan : null,
            'tanggal_validasi' => null,
            'total_berat_aktual' => (float) $pengajuan->perkiraan_total_berat,
            'total_poin_sementara' => 0,
            'detail_setoran' => $detailSetoran,
            'petugas' => $pengajuan->jadwalPenjemputan && $pengajuan->jadwalPenjemputan->petugas ? [
                'petugas_id' => $pengajuan->jadwalPenjemputan->petugas->petugas_id,
                'nama_petugas' => $pengajuan->jadwalPenjemputan->petugas->nama_petugas,
                'no_telepon' => $pengajuan->jadwalPenjemputan->petugas->no_telepon,
            ] : null,
            'validator_petugas' => null,
            'poin_sementara' => null,
            'alamat_penjemputan' => $pengajuan->alamat_penjemputan,
            'status_pengajuan' => $pengajuan->status_pengajuan,
            'catatan_pengajuan' => $pengajuan->catatan,
        ];
    }

    private function formatTransaksiSetoran(TransaksiSetoran $t): array
    {
        $preferensi = $this->extractPreferensiJadwal($t->pengajuanPenjemputan);
        $isMenunggu = $t->status_validasi === 'menunggu';

        return [
            'setoran_id' => $t->setoran_id,
            'pengajuan_id' => $t->pengajuan_id,
            'jadwal_id' => $t->jadwal_id,
            'warga_id' => $t->warga_id,
            'petugas_id' => $t->petugas_id,
            'validator_petugas_id' => $t->validator_petugas_id,
            // Jika belum divalidasi dan ada perkiraan jadwal dari pengajuan, tampilkan perkiraan tersebut
            'tanggal_setoran' => ($isMenunggu && $preferensi['tanggal'])
                ? "{$preferensi['tanggal']} 08:00:00"
                : ($t->tanggal_setoran ? $t->tanggal_setoran->format('Y-m-d H:i:s') : now()->format('Y-m-d H:i:s')),
            'perkiraan_tanggal_jemput' => $preferensi['tanggal'],
            'perkiraan_waktu_jemput' => $preferensi['waktu'],
            'tanggal_diajukan' => $t->pengajuanPenjemputan && $t->pengajuanPenjemputan->tanggal_pengajuan
                ? $t->pengajuanPenjemputan->tanggal_pengajuan->format('Y-m-d H:i:s')
                : null,
            'konfirmasi_pengambilan' => (string) ($t->konfirmasi_pengambilan ?? '1'),
            'status_validasi' => $t->status_validasi,
            'catatan_validasi' => $t->catatan_validasi,
            'tanggal_validasi' => $t->tanggal_validasi ? $t->tanggal_validasi->format('Y-m-d H:i:s') : null,
            'total_berat_aktual' => (float) $t->total_berat_aktual,
            'total_poin_sementara' => (int) $t->total_poin_sementara,
            'detail_setoran' => $t->detailSetoran,
            'petugas' => $t->petugas,
            'validator_petugas' => $t->validatorPetugas,
            'poin_sementara' => $t->poinSementara,
            'alamat_penjemputan' => $t->pengajuanPenjemputan ? $t->pengajuanPenjemputan->alamat_penjemputan : null,
            'status_pengajuan' => $t->pengajuanPenjemputan ? $t->pengajuanPenjemputan->status_pengajuan : 'selesai',
            'catatan_pengajuan' => $t->pengajuanPenjemputan ? $t->pengajuanPenjemputan->catatan : null,
        ];
    }
}
