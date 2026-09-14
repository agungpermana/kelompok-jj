<?php

namespace Database\Seeders;

use App\Models\JenisSampah;
use Illuminate\Database\Seeder;

class JenisSampahSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'nama_jenis_sampah' => 'Botol Plastik',
                'kategori' => 'Plastik',
                'satuan' => 'Kg',
                'keterangan' => 'Botol plastik minuman bersih (PET)',
                'icon' => 'bottle',
                'status' => 'aktif',
            ],
            [
                'nama_jenis_sampah' => 'Gelas Plastik',
                'kategori' => 'Plastik',
                'satuan' => 'Kg',
                'keterangan' => 'Gelas plastik minuman bersih (PP)',
                'icon' => 'cup',
                'status' => 'aktif',
            ],
            [
                'nama_jenis_sampah' => 'Kresek / Plastik PE',
                'kategori' => 'Plastik',
                'satuan' => 'Kg',
                'keterangan' => 'Kantong kresek dan plastik kemasan',
                'icon' => 'bag',
                'status' => 'aktif',
            ],
            [
                'nama_jenis_sampah' => 'Kardus',
                'kategori' => 'Kertas',
                'satuan' => 'Kg',
                'keterangan' => 'Kardus boks kering tanpa perekat tebal',
                'icon' => 'box',
                'status' => 'aktif',
            ],
            [
                'nama_jenis_sampah' => 'Kertas HVS',
                'kategori' => 'Kertas',
                'satuan' => 'Kg',
                'keterangan' => 'Kertas dokumen HVS bekas putih',
                'icon' => 'paper',
                'status' => 'aktif',
            ],
            [
                'nama_jenis_sampah' => 'Koran',
                'kategori' => 'Kertas',
                'satuan' => 'Kg',
                'keterangan' => 'Koran bekas rapi dan kering',
                'icon' => 'newspaper',
                'status' => 'aktif',
            ],
            [
                'nama_jenis_sampah' => 'Aluminium',
                'kategori' => 'Logam',
                'satuan' => 'Kg',
                'keterangan' => 'Pipa, kusen, atau plat aluminium bekas',
                'icon' => 'metal_can',
                'status' => 'aktif',
            ],
            [
                'nama_jenis_sampah' => 'Kaleng Bekas',
                'kategori' => 'Logam',
                'satuan' => 'Kg',
                'keterangan' => 'Kaleng biskuit dan makanan kaleng',
                'icon' => 'gear_can',
                'status' => 'aktif',
            ],
            [
                'nama_jenis_sampah' => 'Besi',
                'kategori' => 'Logam',
                'satuan' => 'Kg',
                'keterangan' => 'Besi bekas padat, potongan plat besi',
                'icon' => 'metal_bar',
                'status' => 'aktif',
            ],
            [
                'nama_jenis_sampah' => 'Kaca Bening',
                'kategori' => 'Kaca',
                'satuan' => 'Kg',
                'keterangan' => 'Botol dan toples kaca bening utuh',
                'icon' => 'glass_bottle',
                'status' => 'aktif',
            ],
            [
                'nama_jenis_sampah' => 'Kaca Berwarna',
                'kategori' => 'Kaca',
                'satuan' => 'Kg',
                'keterangan' => 'Botol kaca berwarna (cokelat/hijau)',
                'icon' => 'glass_bottle',
                'status' => 'aktif',
            ],
            [
                'nama_jenis_sampah' => 'Tutup Botol Plastik',
                'kategori' => 'Plastik',
                'satuan' => 'Kg',
                'keterangan' => 'Tutup botol plastik HDPE bersih',
                'icon' => 'cup',
                'status' => 'aktif',
            ],
        ];

        foreach ($items as $item) {
            JenisSampah::updateOrCreate(
                ['nama_jenis_sampah' => $item['nama_jenis_sampah']],
                $item
            );
        }
    }
}