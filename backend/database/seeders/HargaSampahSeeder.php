<?php

namespace Database\Seeders;

use App\Models\HargaSampah;
use App\Models\JenisSampah;
use Illuminate\Database\Seeder;

class HargaSampahSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'nama_jenis_sampah' => 'Botol Plastik',
                'harga_per_satuan' => 2000,
                'nilai_poin_per_satuan' => 2,
            ],
            [
                'nama_jenis_sampah' => 'Gelas Plastik',
                'harga_per_satuan' => 1500,
                'nilai_poin_per_satuan' => 1.5,
            ],
            [
                'nama_jenis_sampah' => 'Kresek / Plastik PE',
                'harga_per_satuan' => 1000,
                'nilai_poin_per_satuan' => 1,
            ],
            [
                'nama_jenis_sampah' => 'Kardus',
                'harga_per_satuan' => 2000,
                'nilai_poin_per_satuan' => 2,
            ],
            [
                'nama_jenis_sampah' => 'Kertas HVS',
                'harga_per_satuan' => 1500,
                'nilai_poin_per_satuan' => 1.5,
            ],
            [
                'nama_jenis_sampah' => 'Koran',
                'harga_per_satuan' => 1200,
                'nilai_poin_per_satuan' => 1.2,
            ],
            [
                'nama_jenis_sampah' => 'Aluminium',
                'harga_per_satuan' => 10000,
                'nilai_poin_per_satuan' => 10,
            ],
            [
                'nama_jenis_sampah' => 'Kaleng Bekas',
                'harga_per_satuan' => 8000,
                'nilai_poin_per_satuan' => 8,
            ],
            [
                'nama_jenis_sampah' => 'Besi',
                'harga_per_satuan' => 5000,
                'nilai_poin_per_satuan' => 5,
            ],
            [
                'nama_jenis_sampah' => 'Kaca Bening',
                'harga_per_satuan' => 1000,
                'nilai_poin_per_satuan' => 1,
            ],
            [
                'nama_jenis_sampah' => 'Kaca Berwarna',
                'harga_per_satuan' => 1200,
                'nilai_poin_per_satuan' => 1.2,
            ],
            [
                'nama_jenis_sampah' => 'Tutup Botol Plastik',
                'harga_per_satuan' => 2500,
                'nilai_poin_per_satuan' => 2.5,
            ],
        ];

        foreach ($data as $item) {
            $jenisSampah = JenisSampah::where(
                'nama_jenis_sampah',
                $item['nama_jenis_sampah']
            )->firstOrFail();

            HargaSampah::updateOrCreate(
                [
                    'jenis_sampah_id' => $jenisSampah->jenis_sampah_id,
                    'berlaku_mulai' => now()->toDateString(),
                ],
                [
                    'harga_per_satuan' => $item['harga_per_satuan'],
                    'nilai_poin_per_satuan' => $item['nilai_poin_per_satuan'],
                    'status' => 'aktif',
                ]
            );
        }
    }
}