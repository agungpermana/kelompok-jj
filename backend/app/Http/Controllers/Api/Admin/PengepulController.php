<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pengepul;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Admin - Pengepul", description: "CRUD Data Pengepul oleh Admin")]
class PengepulController extends Controller
{
    #[OA\Get(
        path: "/admin/pengepul",
        summary: "Daftar semua pengepul",
        description: "Mengambil daftar data pengepul dengan opsi pencarian dan filter status.",
        tags: ["Admin - Pengepul"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "search",
                in: "query",
                required: false,
                description: "Cari berdasarkan nama pengepul, nomor telepon, atau alamat",
                schema: new OA\Schema(type: "string")
            ),
            new OA\Parameter(
                name: "status",
                in: "query",
                required: false,
                description: "Filter status akun (aktif/nonaktif)",
                schema: new OA\Schema(type: "string", enum: ["aktif", "nonaktif"])
            ),
            new OA\Parameter(
                name: "page",
                in: "query",
                required: false,
                schema: new OA\Schema(type: "integer", example: 1)
            ),
        ],
        responses: [
            new OA\Response(response: 200, description: "Daftar pengepul berhasil diambil"),
            new OA\Response(response: 401, description: "Unauthenticated"),
        ]
    )]
    public function index(Request $request)
    {
        $query = Pengepul::with('user');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_pengepul', 'like', "%{$search}%")
                  ->orWhere('no_telepon', 'like', "%{$search}%")
                  ->orWhere('alamat', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $status = $request->status;
            $query->whereHas('user', function ($q) use ($status) {
                $q->where('status', $status);
            });
        }

        $perPage = (int) $request->input('per_page', 10);
        $pengepul = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json($pengepul);
    }

    #[OA\Post(
        path: "/admin/pengepul",
        summary: "Tambah pengepul baru",
        description: "Menambahkan data pengepul baru beserta akun user terkait secara otomatis (role: pengepul).",
        tags: ["Admin - Pengepul"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["username", "email", "password", "nama_pengepul"],
                properties: [
                    new OA\Property(property: "username", type: "string", example: "pengepul_jaya"),
                    new OA\Property(property: "email", type: "string", format: "email", example: "jaya@pengepul.test"),
                    new OA\Property(property: "password", type: "string", minLength: 6, example: "password123"),
                    new OA\Property(property: "nama_pengepul", type: "string", example: "CV Jaya Abadi"),
                    new OA\Property(property: "alamat", type: "string", nullable: true, example: "Jl. Industri No. 45"),
                    new OA\Property(property: "no_telepon", type: "string", nullable: true, example: "081234567890"),
                    new OA\Property(property: "status", type: "string", enum: ["aktif", "nonaktif"], example: "aktif"),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Pengepul berhasil ditambahkan"),
            new OA\Response(response: 422, description: "Validasi gagal"),
        ]
    )]
    public function store(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:50|unique:users,username',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => ['required', 'string', Password::min(6)],
            'nama_pengepul' => 'required|string|max:100',
            'alamat' => 'nullable|string',
            'no_telepon' => 'nullable|string|max:20',
            'status' => 'nullable|string|in:aktif,nonaktif',
        ]);

        DB::beginTransaction();

        try {
            // Otomatis membuat akun user dengan role pengepul
            $user = User::create([
                'username' => $validated['username'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'role' => 'pengepul',
                'status' => $validated['status'] ?? 'aktif',
            ]);

            $pengepul = Pengepul::create([
                'user_id' => $user->id,
                'nama_pengepul' => $validated['nama_pengepul'],
                'alamat' => $validated['alamat'] ?? null,
                'no_telepon' => $validated['no_telepon'] ?? null,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Pengepul berhasil ditambahkan.',
                'data' => $pengepul->load('user'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Gagal menambahkan pengepul.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    #[OA\Get(
        path: "/admin/pengepul/{id}",
        summary: "Detail pengepul",
        description: "Mengambil data detail pengepul berdasarkan ID.",
        tags: ["Admin - Pengepul"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "integer", example: 1)
            )
        ],
        responses: [
            new OA\Response(response: 200, description: "Detail pengepul berhasil diambil"),
            new OA\Response(response: 404, description: "Pengepul tidak ditemukan"),
        ]
    )]
    public function show($id)
    {
        $pengepul = Pengepul::with('user')->findOrFail($id);

        return response()->json([
            'data' => $pengepul,
        ]);
    }

    #[OA\Put(
        path: "/admin/pengepul/{id}",
        summary: "Perbarui data pengepul",
        description: "Memperbarui data pengepul dan status akun pengguna terkait.",
        tags: ["Admin - Pengepul"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "integer", example: 1)
            )
        ],
        responses: [
            new OA\Response(response: 200, description: "Pengepul berhasil diperbarui"),
            new OA\Response(response: 404, description: "Pengepul tidak ditemukan"),
        ]
    )]
    public function update(Request $request, $id)
    {
        $pengepul = Pengepul::with('user')->findOrFail($id);

        $validated = $request->validate([
            'nama_pengepul' => 'required|string|max:100',
            'alamat' => 'nullable|string',
            'no_telepon' => 'nullable|string|max:20',
            'status' => 'nullable|string|in:aktif,nonaktif',
            'password' => ['nullable', 'string', Password::min(6)],
        ]);

        DB::beginTransaction();

        try {
            $pengepul->update([
                'nama_pengepul' => $validated['nama_pengepul'],
                'alamat' => $validated['alamat'] ?? null,
                'no_telepon' => $validated['no_telepon'] ?? null,
            ]);

            if ($pengepul->user) {
                $userUpdates = [];
                if (isset($validated['status'])) {
                    $userUpdates['status'] = $validated['status'];
                }
                if (!empty($validated['password'])) {
                    $userUpdates['password'] = $validated['password'];
                }
                if (!empty($userUpdates)) {
                    $pengepul->user->update($userUpdates);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Pengepul berhasil diperbarui.',
                'data' => $pengepul->load('user'),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Gagal memperbarui pengepul.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    #[OA\Delete(
        path: "/admin/pengepul/{id}",
        summary: "Hapus pengepul",
        description: "Menghapus data pengepul beserta akun user terkait.",
        tags: ["Admin - Pengepul"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "integer", example: 1)
            )
        ],
        responses: [
            new OA\Response(response: 200, description: "Pengepul berhasil dihapus"),
            new OA\Response(response: 404, description: "Pengepul tidak ditemukan"),
        ]
    )]
    public function destroy($id)
    {
        $pengepul = Pengepul::with('user')->findOrFail($id);

        DB::beginTransaction();

        try {
            if ($pengepul->user) {
                $pengepul->user->delete();
            } else {
                $pengepul->delete();
            }

            DB::commit();

            return response()->json([
                'message' => 'Pengepul berhasil dihapus.',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Gagal menghapus pengepul.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
