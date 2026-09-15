<?php

namespace Database\Seeders;

use App\Models\JadwalPenjemputan;
use App\Models\PengajuanPenjemputan;
use App\Models\DetailPengajuanSampah;
use App\Models\Warga;
use App\Models\Petugas;
use App\Models\Admin;
use App\Models\JenisSampah;
use Illuminate\Database\Seeder;

class PenjemputanSeeder extends Seeder
{
    public function run(): void
    {
        // Get existing data atau create minimal
        $admin = Admin::first() ?? Admin::factory()->create();
        $petugas = Petugas::first() ?? Petugas::factory()->create();
        $warga = Warga::first() ?? Warga::factory()->create();
        $jenisSampah = JenisSampah::first() ?? JenisSampah::factory()->create();

        // Create 3 pengajuan dinamis
        for ($i = 1; $i <= 3; $i++) {
            $pengajuan = PengajuanPenjemputan::create([
                'warga_id' => $warga->warga_id,
                'tanggal_pengajuan' => now()->addDays($i),
                'alamat_penjemputan' => "Jalan Merdeka No. {$i}0, Jakarta",
                'perkiraan_total_berat' => rand(10, 50),
                'catatan' => "Pengajuan penjemputan ke-{$i}",
                'status_pengajuan' => 'diajukan',
            ]);

            // Add detail pengajuan
            DetailPengajuanSampah::create([
                'pengajuan_id' => $pengajuan->pengajuan_id,
                'jenis_sampah_id' => $jenisSampah->jenis_sampah_id,
                'perkiraan_berat' => rand(5, 25),
            ]);

            // Create jadwal untuk pengajuan pertama saja
            if ($i === 1) {
                JadwalPenjemputan::create([
                    'pengajuan_id' => $pengajuan->pengajuan_id,
                    'admin_id' => $admin->admin_id,
                    'petugas_id' => $petugas->petugas_id,
                    'tanggal_penjemputan' => now()->addDays(1)->toDateString(),
                    'waktu_penjemputan' => '09:00',
                    'status_jadwal' => 'terjadwal',
                    'catatan' => 'Jadwal penjemputan pertama',
                ]);
            }
        }
    }
}
