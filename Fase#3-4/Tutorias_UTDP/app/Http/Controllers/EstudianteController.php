<?php

namespace App\Http\Controllers;

use App\Models\Estudiante;
use Illuminate\Http\Request;
use App\Http\Requests\StoreEstudianteRequest;

class EstudianteController extends Controller
{
    public function store(StoreEstudianteRequest $request)
    {
        $validated = $request->validated();
        $estudiante = Estudiante::create($validated);

        return response()->json([
            "message" => "Estudiante registrado con exito",
            "data" => $estudiante
        ], 201);
    }
}
