<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Estudiante;
use \Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\CambiarContrasenaRequest;

class EstudianteController extends Controller
{
    public function show(string $estudiante_uuid): JsonResponse{
        $infoEstudiante = Estudiante::select('nombre', 'apellido', 'cedula', 'correo', 'telefono', 'cod_facultad', 'contrasena', 'estudiante_uuid')
            ->where('estudiante_uuid', $estudiante_uuid)
            ->first();

        if (!$infoEstudiante) {
            return response()->json([
                "error" => "Estudiante no encontrado"
            ], 404);
        }

        return response()->json($infoEstudiante);
    }

    public function cambiarContrasena(CambiarContrasenaRequest $request, $estudiante_uuid)
    {
        DB::table('Estudiante')->where('estudiante_uuid', $estudiante_uuid)->update([
            'contrasena' => Hash::make($request->input('contrasena_nueva'))
        ]);

        return response()->json(['mensaje' => 'Contraseña actualizada correctamente'], 200);
    }


}
