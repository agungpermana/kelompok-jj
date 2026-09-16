<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\TransaksiPenjualan;
use App\Models\DetailPenjualan;
use App\Models\JenisSampah;
use App\Models\StokSampah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransaksiPenjualanController extends Controller
{
    public function jenisSampah()
    {
        $data = JenisSampah::with(['hargaSampah' => function ($q) {
            $q->where('status', 'aktif')
              ->whereDate('berlaku_mulai', '<=', now())
              ->where(function ($q) {
                  $q->whereNull('berlaku_selesai')->orWhereDate('berlaku_selesai', '>=', now());
              })
              ->orderByDesc('berlaku_mulai');
        }, 'stokSampah'])->get();

        // Map harga aktif dan stok ke setiap jenis sampah
        $mapped = $data->map(function ($item) {
            $harga = $item->hargaSampah->first();
            return [
                'jenis_sampah_id' => $item->jenis_sampah_id,
                'nama_jenis_sampah' => $item->nama_jenis_sampah,
                'satuan' => $item->satuan ?? 'kg',
                'harga_jual' => $harga ? $harga->harga_per_satuan : 0,
                'stok_tersedia' => $item->stokSampah ? $item->stokSampah->jumlah_stok : 0,
            ];
        });

        return response()->json([
            'message' => 'Daftar jenis sampah berhasil diambil.',
            'data' => $mapped
        ]);
    }

    public function index(Request $request)
    {
        $query = TransaksiPenjualan::with(['pengepul', 'admin', 'detailPenjualan.jenisSampah'])
            ->orderByDesc('penjualan_id');

        // Filter status
        if ($request->has('status') && $request->status !== 'semua') {
            $query->where('status_transaksi', $request->status);
        }

        // Filter tanggal
        if ($request->has('dari') && $request->dari) {
            $query->whereDate('tanggal_transaksi', '>=', $request->dari);
        }
        if ($request->has('sampai') && $request->sampai) {
            $query->whereDate('tanggal_transaksi', '<=', $request->sampai);
        }

        // Filter pengepul
        if ($request->has('pengepul_id') && $request->pengepul_id) {
            $query->where('pengepul_id', $request->pengepul_id);
        }

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->whereHas('pengepul', function ($q) use ($search) {
                $q->where('nama_pengepul', 'like', "%{$search}%");
            });
        }

        return response()->json([
            'message' => 'Daftar transaksi penjualan berhasil diambil.',
            'data' => $query->get()
        ]);
    }

    public function show($id)
    {
        $penjualan = TransaksiPenjualan::with(['pengepul', 'admin', 'detailPenjualan.jenisSampah'])
            ->find($id);

        if (!$penjualan) {
            return response()->json(['message' => 'Transaksi penjualan tidak ditemukan.'], 404);
        }

        return response()->json([
            'message' => 'Detail transaksi penjualan berhasil diambil.',
            'data' => $penjualan
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'pengepul_id' => 'required|integer|exists:pengepul,pengepul_id',
            'tanggal_transaksi' => 'required|date',
            'media_konfirmasi' => 'required|string|max:50',
            'metode_transaksi' => 'required|string|max:50',
            'catatan' => 'nullable|string|max:500',
            'detail' => 'required|array|min:1',
            'detail.*.jenis_sampah_id' => 'required|integer|exists:jenis_sampah,jenis_sampah_id',
            'detail.*.jumlah_terjual' => 'required|numeric|min:0.01',
        ]);

        $admin = $request->user()->admin;
        if (!$admin) {
            return response()->json(['message' => 'Profil admin tidak ditemukan.'], 404);
        }

        $result = DB::transaction(function () use ($request, $admin) {
            $totalPenjualan = 0;
            $details = [];

            // Hitung total dan siapkan detail
            foreach ($request->detail as $item) {
                // Ambil harga dari database (tidak dari input)
                $jenis = JenisSampah::find($item['jenis_sampah_id']);
                $harga = $jenis->hargaSampah()
                    ->where('status', 'aktif')
                    ->whereDate('berlaku_mulai', '<=', now())
                    ->where(function ($q) {
                        $q->whereNull('berlaku_selesai')->orWhereDate('berlaku_selesai', '>=', now());
                    })
                    ->orderByDesc('berlaku_mulai')
                    ->first();

                $hargaSatuan = $harga ? $harga->harga_per_satuan : 0;
                $subtotal = $item['jumlah_terjual'] * $hargaSatuan;
                $totalPenjualan += $subtotal;
                $details[] = [
                    'jenis_sampah_id' => $item['jenis_sampah_id'],
                    'jumlah_terjual' => $item['jumlah_terjual'],
                    'harga_satuan' => $hargaSatuan,
                    'subtotal' => $subtotal,
                ];
            }

            // Buat transaksi penjualan
            $penjualan = TransaksiPenjualan::create([
                'pengepul_id' => $request->pengepul_id,
                'admin_id' => $admin->admin_id,
                'tanggal_transaksi' => $request->tanggal_transaksi,
                'total_penjualan' => $totalPenjualan,
                'status_transaksi' => 'selesai',
                'media_konfirmasi' => $request->media_konfirmasi,
                'metode_transaksi' => $request->metode_transaksi,
                'catatan' => $request->catatan,
            ]);

            // Buat detail penjualan dan kurangi stok
            foreach ($details as $detail) {
                DetailPenjualan::create(array_merge($detail, [
                    'penjualan_id' => $penjualan->penjualan_id,
                ]));

                // Kurangi stok sampah
                $stok = StokSampah::where('jenis_sampah_id', $detail['jenis_sampah_id'])->first();
                if ($stok) {
                    $stok->decrement('jumlah_stok', $detail['jumlah_terjual']);
                    $stok->update(['terakhir_diperbarui' => now()]);
                }
            }

            return $penjualan;
        });

        $result->load(['pengepul', 'admin', 'detailPenjualan.jenisSampah']);

        return response()->json([
            'message' => 'Transaksi penjualan berhasil dibuat.',
            'data' => $result
        ], 201);
    }

    public function destroy($id)
    {
        $penjualan = TransaksiPenjualan::with('detailPenjualan')->find($id);
        if (!$penjualan) {
            return response()->json(['message' => 'Transaksi penjualan tidak ditemukan.'], 404);
        }

        DB::transaction(function () use ($penjualan) {
            // Kembalikan stok sampah
            foreach ($penjualan->detailPenjualan as $detail) {
                $stok = StokSampah::where('jenis_sampah_id', $detail->jenis_sampah_id)->first();
                if ($stok) {
                    $stok->increment('jumlah_stok', $detail->jumlah_terjual);
                    $stok->update(['terakhir_diperbarui' => now()]);
                }
            }

            $penjualan->delete();
        });

        return response()->json(['message' => 'Transaksi penjualan berhasil dihapus.']);
    }
}
