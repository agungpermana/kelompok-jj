<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\DetailSetoran;
use App\Models\JadwalPenjemputan;
use App\Models\JenisSampah;
use App\Models\PengajuanPenjemputan;
use App\Models\Petugas;
use App\Models\PoinSementara;
use App\Models\TransaksiSetoran;
use App\Models\Warga;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class TransaksiSetoranSeeder extends Seeder
{
    public function run(): void
    {
        $warga = Warga::first();
        $petugas = Petugas::first();
        $admin = Admin::first();

        if (!$warga || !$petugas || !$admin) {
            return;
        }

        // Ambil jenis sampah dari DB
        $botol = JenisSampah::where('nama_jenis_sampah', 'like', '%Botol%')->first();
        $kardus = JenisSampah::where('nama_jenis_sampah', 'like', '%Kardus%')->first();
        $aluminium = JenisSampah::where('nama_jenis_sampah', 'like', '%Aluminium%')->first()
            ?? JenisSampah::where('nama_jenis_sampah', 'like', '%Kaleng%')->first();
        $plastik = JenisSampah::where('nama_jenis_sampah', 'like', '%Kresek%')->first()
            ?? JenisSampah::where('nama_jenis_sampah', 'like', '%Plastik%')->first();

        $createSetoran = function (
            $tanggalSetoran,
            $statusValidasi,
            $totalBerat,
            $totalPoin,
            array $details,
            $catatanValidasi = null,
            $tanggalValidasi = null
        ) use ($warga, $petugas, $admin) {
            $pengajuan = PengajuanPenjemputan::create([
                'warga_id' => $warga->warga_id,
                'tanggal_pengajuan' => Carbon::parse($tanggalSetoran)->subDays(2),
                'alamat_penjemputan' => $warga->alamat ?? 'Jl. Merdeka No. 45 RT 02/RW 03, Kelurahan Damai',
                'perkiraan_total_berat' => $totalBerat,
                'catatan' => 'Sampah siap jemput di teras depan',
                'status_pengajuan' => 'selesai',
            ]);

            $jadwal = JadwalPenjemputan::create([
                'pengajuan_id' => $pengajuan->pengajuan_id,
                'admin_id' => $admin->admin_id,
                'petugas_id' => $petugas->petugas_id,
                'tanggal_penjemputan' => Carbon::parse($tanggalSetoran)->toDateString(),
                'waktu_penjemputan' => Carbon::parse($tanggalSetoran)->format('H:i:s'),
                'status_jadwal' => 'selesai',
                'catatan' => 'Penjemputan selesai',
            ]);

            $transaksi = TransaksiSetoran::create([
                'pengajuan_id' => $pengajuan->pengajuan_id,
                'jadwal_id' => $jadwal->jadwal_id,
                'warga_id' => $warga->warga_id,
                'petugas_id' => $petugas->petugas_id,
                'validator_petugas_id' => $statusValidasi !== 'menunggu' ? $petugas->petugas_id : null,
                'tanggal_setoran' => Carbon::parse($tanggalSetoran),
                'konfirmasi_pengambilan' => '1',
                'status_validasi' => $statusValidasi,
                'catatan_validasi' => $catatanValidasi,
                'tanggal_validasi' => $tanggalValidasi ? Carbon::parse($tanggalValidasi) : null,
                'total_berat_aktual' => $totalBerat,
                'total_poin_sementara' => $totalPoin,
            ]);

            foreach ($details as $d) {
                if (!empty($d['jenis_sampah_id'])) {
                    DetailSetoran::create([
                        'setoran_id' => $transaksi->setoran_id,
                        'jenis_sampah_id' => $d['jenis_sampah_id'],
                        'berat_aktual' => $d['berat_aktual'],
                        'harga_satuan' => $d['harga_satuan'] ?? 2000,
                        'nilai_poin_per_satuan' => $d['nilai_poin_per_satuan'] ?? 40,
                        'poin_sementara' => $d['poin_sementara'] ?? 0,
                    ]);
                }
            }

            if ($totalPoin > 0) {
                PoinSementara::create([
                    'warga_id' => $warga->warga_id,
                    'setoran_id' => $transaksi->setoran_id,
                    'jumlah_poin' => $totalPoin,
                    'status_poin' => $statusValidasi === 'disetujui' ? 'disetujui' : 'menunggu',
                    'validator_admin_id' => $statusValidasi === 'disetujui' ? $admin->admin_id : null,
                    'tanggal_validasi' => $statusValidasi === 'disetujui' ? Carbon::parse($tanggalValidasi ?? $tanggalSetoran) : null,
                ]);
            }

            return $transaksi;
        };

        // 1. Setoran 1: Disetujui (22 Mei 2024, 10:35) -> 7.20 kg, 304 poin
        $createSetoran(
            '2024-05-22 10:35:00',
            'disetujui',
            7.20,
            304,
            [
                ['jenis_sampah_id' => $botol?->jenis_sampah_id, 'berat_aktual' => 2.40, 'harga_satuan' => 2000, 'nilai_poin_per_satuan' => 40, 'poin_sementara' => 96],
                ['jenis_sampah_id' => $kardus?->jenis_sampah_id, 'berat_aktual' => 3.20, 'harga_satuan' => 2000, 'nilai_poin_per_satuan' => 40, 'poin_sementara' => 128],
                ['jenis_sampah_id' => $aluminium?->jenis_sampah_id, 'berat_aktual' => 1.60, 'harga_satuan' => 5000, 'nilai_poin_per_satuan' => 50, 'poin_sementara' => 80],
            ],
            'Sampah bersih dan terpilah rapi.',
            '2024-05-23 09:15:00'
        );

        // 2. Setoran 2: Menunggu Validasi (20 Mei 2024, 14:20) -> 4.70 kg, 165 poin
        $createSetoran(
            '2024-05-20 14:20:00',
            'menunggu',
            4.70,
            165,
            [
                ['jenis_sampah_id' => $plastik?->jenis_sampah_id, 'berat_aktual' => 1.00, 'harga_satuan' => 1000, 'nilai_poin_per_satuan' => 25, 'poin_sementara' => 25],
                ['jenis_sampah_id' => $kardus?->jenis_sampah_id, 'berat_aktual' => 2.50, 'harga_satuan' => 2000, 'nilai_poin_per_satuan' => 32, 'poin_sementara' => 80],
                ['jenis_sampah_id' => $aluminium?->jenis_sampah_id, 'berat_aktual' => 1.20, 'harga_satuan' => 5000, 'nilai_poin_per_satuan' => 50, 'poin_sementara' => 60],
            ]
        );

        // 3. Setoran 3: Ditolak (18 Mei 2024, 09:15) -> 3.50 kg, 0 poin
        $createSetoran(
            '2024-05-18 09:15:00',
            'ditolak',
            3.50,
            0,
            [
                ['jenis_sampah_id' => $botol?->jenis_sampah_id, 'berat_aktual' => 1.50, 'harga_satuan' => 2000, 'nilai_poin_per_satuan' => 0, 'poin_sementara' => 0],
                ['jenis_sampah_id' => $kardus?->jenis_sampah_id, 'berat_aktual' => 2.00, 'harga_satuan' => 2000, 'nilai_poin_per_satuan' => 0, 'poin_sementara' => 0],
            ],
            'Sampah masih tercampur basah dan sisa makanan.',
            '2024-05-18 11:00:00'
        );

        // 4. Setoran 4: Disetujui (15 Mei 2024, 16:40) -> 3.00 kg, 90 poin
        $createSetoran(
            '2024-05-15 16:40:00',
            'disetujui',
            3.00,
            90,
            [
                ['jenis_sampah_id' => $plastik?->jenis_sampah_id, 'berat_aktual' => 2.00, 'harga_satuan' => 1000, 'nilai_poin_per_satuan' => 20, 'poin_sementara' => 40],
                ['jenis_sampah_id' => $aluminium?->jenis_sampah_id, 'berat_aktual' => 1.00, 'harga_satuan' => 5000, 'nilai_poin_per_satuan' => 50, 'poin_sementara' => 50],
            ],
            'Kondisi kering dan bersih.',
            '2024-05-16 08:30:00'
        );

        // 5. Setoran 5: Menunggu Validasi (12 Mei 2024, 11:10) -> 2.80 kg, 110 poin
        $createSetoran(
            '2024-05-12 11:10:00',
            'menunggu',
            2.80,
            110,
            [
                ['jenis_sampah_id' => $kardus?->jenis_sampah_id, 'berat_aktual' => 2.80, 'harga_satuan' => 2000, 'nilai_poin_per_satuan' => 40, 'poin_sementara' => 110],
            ]
        );

        // 6 - 12. Tambahan transaksi setoran agar total 12 kali, 45.20 kg, 1250 poin (persis sesuai mockup ringkasan)
        $extraSetoran = [
            ['date' => '2024-05-08 09:30:00', 'kg' => 4.00, 'poin' => 150],
            ['date' => '2024-05-02 14:00:00', 'kg' => 3.50, 'poin' => 120],
            ['date' => '2024-04-26 10:15:00', 'kg' => 4.20, 'poin' => 140],
            ['date' => '2024-04-18 15:20:00', 'kg' => 3.80, 'poin' => 130],
            ['date' => '2024-04-10 11:45:00', 'kg' => 2.50, 'poin' => 80],
            ['date' => '2024-04-03 08:30:00', 'kg' => 3.00, 'poin' => 100],
            ['date' => '2024-03-25 13:00:00', 'kg' => 7.70, 'poin' => 136],
        ];

        foreach ($extraSetoran as $ex) {
            $createSetoran(
                $ex['date'],
                'disetujui',
                $ex['kg'],
                $ex['poin'],
                [
                    ['jenis_sampah_id' => $botol?->jenis_sampah_id, 'berat_aktual' => $ex['kg'], 'harga_satuan' => 2000, 'nilai_poin_per_satuan' => 35, 'poin_sementara' => $ex['poin']],
                ],
                'Validasi otomatis berhasil.',
                Carbon::parse($ex['date'])->addHours(12)
            );
        }
    }
}
