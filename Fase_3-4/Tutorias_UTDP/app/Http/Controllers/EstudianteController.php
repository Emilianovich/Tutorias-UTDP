<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginEstudianteRequest;
use App\Models\Estudiante;
use Illuminate\Http\Request;
use App\Http\Requests\StoreEstudianteRequest;
use Illuminate\Support\Facades\Hash;

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
}
