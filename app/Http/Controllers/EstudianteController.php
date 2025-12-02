<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEstudianteRequest;
use App\Http\Requests\LoginEstudianteRequest;
use App\Models\Estudiante;
use Illuminate\Http\Request; 
use \Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\CambiarContrasenaRequest;

class EstudianteController extends Controller
{
    public function store(StoreEstudianteRequest $request)
    {
        $validated = $request->validated();
        $estudiante = Estudiante::create($validated);

        return response()->json([
            "message" => "¡Usted se ha registrado con éxito!",
            "data" => $estudiante
        ], 201);
    }

    public function login(LoginEstudianteRequest $request)
    {
        $validated = $request->validated();

        $correo = $validated['correo'];
        $contraseña = $validated['contraseña'];

        $estudiante = Estudiante::where('correo', $correo)->first();

        if (!$estudiante) {
            return response()->json([
                "message" => "Correo o contraseña incorrecta"
            ], 401);
        }

        // Comparar contraseñas (hashed)
        if (!Hash::check($contraseña, $estudiante->contraseña)) {
            return response()->json([
                "message" => "Correo o contraseña incorrecta"
            ], 401);
        }

        return response()->json([
            "message" => "Inicio de sesión exitoso",
            "uuid" => $estudiante->estudiante_uuid
        ], 201);
    }

    public function show(string $estudiante_uuid): JsonResponse{
        $infoEstudiante = Estudiante::select('nombre', 'apellido', 'cedula', 'correo', 'telefono', 'cod_facultad', 'contraseña', 'estudiante_uuid')
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
            'contraseña' => Hash::make($request->input('contrasena_nueva'))
        ]);

        return response()->json(['mensaje' => 'Contraseña actualizada correctamente'], 200);
    }


}

