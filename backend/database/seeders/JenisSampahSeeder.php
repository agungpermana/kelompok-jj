<?php

namespace Database\Seeders;

use App\Models\JenisSampah;
use Illuminate\Database\Seeder;

class JenisSampahSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['nama_jenis_sampah' => 'Botol Plastik', 'satuan' => 'Kg', 'keterangan' => 'Botol plastik PET bening atau berwarna bersih tanpa tutup dan label.'],
            ['nama_jenis_sampah' => 'Gelas Plastik', 'satuan' => 'Kg', 'keterangan' => 'Gelas plastik PP kemasan air mineral/minuman dalam keadaan bersih.'],
            ['nama_jenis_sampah' => 'Kresek / Plastik PE', 'satuan' => 'Kg', 'keterangan' => 'Kantong kresek atau plastik lembaran PE bersih kering.'],
            ['nama_jenis_sampah' => 'Kardus', 'satuan' => 'Kg', 'keterangan' => 'Kardus box cokelat tebal dalam kondisi kering terlipat rapi.'],
            ['nama_jenis_sampah' => 'Kertas HVS', 'satuan' => 'Kg', 'keterangan' => 'Kertas dokumen/kantor putih tanpa staples atau lem.'],
            ['nama_jenis_sampah' => 'Koran', 'satuan' => 'Kg', 'keterangan' => 'Koran bekas cetak dalam kondisi kering terikat rapi.'],
            ['nama_jenis_sampah' => 'Aluminium', 'satuan' => 'Kg', 'keterangan' => 'Peralatan atau kaleng aluminium ringan bebas kotoran padat.'],
            ['nama_jenis_sampah' => 'Kaleng Bekas', 'satuan' => 'Kg', 'keterangan' => 'Kaleng biskuit atau susu kaleng seng bersih.'],
            ['nama_jenis_sampah' => 'Besi', 'satuan' => 'Kg', 'keterangan' => 'Besi tua, rangka besi, paku bebas karat berlebih.'],
            ['nama_jenis_sampah' => 'Kaca Bening', 'satuan' => 'Kg', 'keterangan' => 'Botol atau toples kaca transparan utuh dan bersih.'],
            ['nama_jenis_sampah' => 'Kaca Warna', 'satuan' => 'Kg', 'keterangan' => 'Botol kaca berwarna cokelat atau hijau kemasan kecap/sirup.'],
            ['nama_jenis_sampah' => 'Kaca Pecah', 'satuan' => 'Kg', 'keterangan' => 'Pecahan kaca bersih yang telah dipacking aman dalam karung/wadah.'],
        ];

        foreach ($items as $item) {
            JenisSampah::updateOrCreate(
                ['nama_jenis_sampah' => $item['nama_jenis_sampah']],
                [
                    'satuan' => $item['satuan'],
                    'keterangan' => $item['keterangan'],
                    'status' => 'aktif',
                ]
            );
        }
    }
}