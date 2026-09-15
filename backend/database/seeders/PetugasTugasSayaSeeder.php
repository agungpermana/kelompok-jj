<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\DetailPengajuanSampah;
use App\Models\JadwalPenjemputan;
use App\Models\JenisSampah;
use App\Models\PengajuanPenjemputan;
use App\Models\Petugas;
use App\Models\User;
use App\Models\Warga;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PetugasTugasSayaSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure Petugas Ahmad Fauzi exists
        $userPetugas = User::updateOrCreate(
            ['email' => 'petugas@trashure.test'],
            [
                'username' => 'petugas',
                'password' => Hash::make('password'),
                'role' => 'petugas',
                'status' => 'aktif',
            ]
        );

        $petugas = Petugas::updateOrCreate(
            ['user_id' => $userPetugas->id],
            [
                'nama_petugas' => 'Ahmad Fauzi',
                'jenis_kelamin' => 'L',
                'alamat' => 'Jakarta',
                'no_telepon' => '081234567890',
            ]
        );

        // 2. Ensure Admin exists for foreign key
        $admin = Admin::first();
        if (!$admin) {
            $userAdmin = User::updateOrCreate(
                ['email' => 'admin@trashure.test'],
                [
                    'username' => 'admin',
                    'password' => Hash::make('password'),
                    'role' => 'admin',
                    'status' => 'aktif',
                ]
            );
            $admin = Admin::updateOrCreate(
                ['user_id' => $userAdmin->id],
                ['nama_admin' => 'Admin Trashure']
            );
        }

        // 3. Ensure base JenisSampah exist: Plastik, Kertas, Logam, Kaca
        $jenisSampahList = [
            'Plastik' => JenisSampah::updateOrCreate(
                ['nama_jenis_sampah' => 'Plastik'],
                ['satuan' => 'Kg', 'keterangan' => 'Sampah plastik daur ulang', 'status' => 'aktif']
            ),
            'Kertas' => JenisSampah::updateOrCreate(
                ['nama_jenis_sampah' => 'Kertas'],
                ['satuan' => 'Kg', 'keterangan' => 'Sampah kertas dan karton daur ulang', 'status' => 'aktif']
            ),
            'Logam' => JenisSampah::updateOrCreate(
                ['nama_jenis_sampah' => 'Logam'],
                ['satuan' => 'Kg', 'keterangan' => 'Sampah kaleng dan logam daur ulang', 'status' => 'aktif']
            ),
            'Kaca' => JenisSampah::updateOrCreate(
                ['nama_jenis_sampah' => 'Kaca'],
                ['satuan' => 'Kg', 'keterangan' => 'Sampah botol dan pecahan kaca daur ulang', 'status' => 'aktif']
            ),
        ];

        // Seed HargaSampah for each main waste category
        $hargaData = [
            'Plastik' => ['harga' => 2500, 'poin' => 2.5],
            'Kertas' => ['harga' => 2000, 'poin' => 2.0],
            'Logam' => ['harga' => 6000, 'poin' => 6.0],
            'Kaca' => ['harga' => 1000, 'poin' => 1.0],
        ];

        foreach ($hargaData as $namaJenis => $h) {
            $js = $jenisSampahList[$namaJenis];
            \App\Models\HargaSampah::updateOrCreate(
                [
                    'jenis_sampah_id' => $js->jenis_sampah_id,
                    'status' => 'aktif',
                ],
                [
                    'harga_per_satuan' => $h['harga'],
                    'nilai_poin_per_satuan' => $h['poin'],
                    'berlaku_mulai' => '2024-01-01',
                    'berlaku_selesai' => null,
                ]
            );
        }

        // 4. Data tasks matching screenshot:
        $tugasData = [
            [
                'nama' => 'Siti Nurhayati',
                'nik' => '3171000000000101',
                'no_telepon' => '0812-3456-7890',
                'alamat' => 'Jl. Anggrek No. 5, RT 02 / RW 03',
                'waktu' => '09:00:00',
                'tanggal' => '2024-08-22',
                'status_jadwal' => 'terjadwal',
                'status_pengajuan' => 'dijadwalkan',
                'sampah' => [
                    ['jenis' => 'Plastik', 'berat' => 3.50],
                    ['jenis' => 'Kertas', 'berat' => 2.00],
                ],
            ],
            [
                'nama' => 'Budi Santoso',
                'nik' => '3171000000000102',
                'no_telepon' => '0813-2222-3333',
                'alamat' => 'Jl. Melati No. 12, RT 01 / RW 02',
                'waktu' => '10:30:00',
                'tanggal' => '2024-08-22',
                'status_jadwal' => 'terjadwal',
                'status_pengajuan' => 'dijadwalkan',
                'sampah' => [
                    ['jenis' => 'Plastik', 'berat' => 4.00],
                ],
            ],
            [
                'nama' => 'Dewi Lestari',
                'nik' => '3171000000000103',
                'no_telepon' => '0821-4444-5555',
                'alamat' => 'Jl. Kenanga No. 8, RT 03 / RW 01',
                'waktu' => '13:00:00',
                'tanggal' => '2024-08-22',
                'status_jadwal' => 'terjadwal',
                'status_pengajuan' => 'dijadwalkan',
                'sampah' => [
                    ['jenis' => 'Logam', 'berat' => 3.00],
                    ['jenis' => 'Kaca', 'berat' => 2.50],
                ],
            ],
            [
                'nama' => 'Ahmad Hidayat',
                'nik' => '3171000000000104',
                'no_telepon' => '0857-6666-7777',
                'alamat' => 'Jl. Mawar No. 3, RT 02 / RW 03',
                'waktu' => '15:00:00',
                'tanggal' => '2024-08-22',
                'status_jadwal' => 'terjadwal',
                'status_pengajuan' => 'dijadwalkan',
                'sampah' => [
                    ['jenis' => 'Kertas', 'berat' => 3.00],
                ],
            ],
            [
                'nama' => 'Rina Wulandari',
                'nik' => '3171000000000105',
                'no_telepon' => '0812-8888-9999',
                'alamat' => 'Jl. Dahlia No. 7, RT 04 / RW 02',
                'waktu' => '08:30:00',
                'tanggal' => '2024-08-22',
                'status_jadwal' => 'diproses',
                'status_pengajuan' => 'diproses',
                'sampah' => [
                    ['jenis' => 'Plastik', 'berat' => 3.00],
                    ['jenis' => 'Kertas', 'berat' => 2.00],
                ],
            ],
        ];

        foreach ($tugasData as $index => $item) {
            $userWarga = User::updateOrCreate(
                ['email' => 'warga' . ($index + 1) . '@trashure.test'],
                [
                    'username' => strtolower(str_replace(' ', '', $item['nama'])),
                    'password' => Hash::make('password'),
                    'role' => 'warga',
                    'status' => 'aktif',
                ]
            );

            $warga = Warga::updateOrCreate(
                ['nik' => $item['nik']],
                [
                    'user_id' => $userWarga->id,
                    'nama_warga' => $item['nama'],
                    'jenis_kelamin' => 'P',
                    'alamat' => $item['alamat'],
                    'no_telepon' => $item['no_telepon'],
                ]
            );

            $warga->saldoPoin()->updateOrCreate(
                ['warga_id' => $warga->warga_id],
                ['saldo_poin' => 0, 'terakhir_diperbarui' => now()]
            );

            $totalBerat = array_sum(array_column($item['sampah'], 'berat'));

            // Create or update PengajuanPenjemputan
            $pengajuan = PengajuanPenjemputan::updateOrCreate(
                [
                    'warga_id' => $warga->warga_id,
                    'alamat_penjemputan' => $item['alamat'],
                ],
                [
                    'tanggal_pengajuan' => $item['tanggal'] . ' 07:00:00',
                    'perkiraan_total_berat' => $totalBerat,
                    'catatan' => 'Penjemputan sampah rutin warga',
                    'status_pengajuan' => $item['status_pengajuan'],
                ]
            );

            // Re-create detail sampah
            DetailPengajuanSampah::where('pengajuan_id', $pengajuan->pengajuan_id)->delete();
            foreach ($item['sampah'] as $sampahItem) {
                $js = $jenisSampahList[$sampahItem['jenis']];
                DetailPengajuanSampah::create([
                    'pengajuan_id' => $pengajuan->pengajuan_id,
                    'jenis_sampah_id' => $js->jenis_sampah_id,
                    'perkiraan_berat' => $sampahItem['berat'],
                ]);
            }

            // Create or update JadwalPenjemputan
            JadwalPenjemputan::updateOrCreate(
                ['pengajuan_id' => $pengajuan->pengajuan_id],
                [
                    'admin_id' => $admin->admin_id,
                    'petugas_id' => $petugas->petugas_id,
                    'tanggal_penjemputan' => $item['tanggal'],
                    'waktu_penjemputan' => $item['waktu'],
                    'status_jadwal' => $item['status_jadwal'],
                    'catatan' => 'Tugas penjemputan ' . $item['nama'],
                ]
            );
        }
    }
}
