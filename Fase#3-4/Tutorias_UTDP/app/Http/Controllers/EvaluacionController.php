<?php

namespace App\Http\Controllers;

use App\Http\Requests\InsertarEvaluacionRequest;
use App\Models\Evaluacion;
use App\Models\Imparte;
use App\Models\Inscripcion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;

class EvaluacionController extends Controller
{
    /**
     * GET /api/sesiones-por-evaluar/{estudiante_uuid}
     * Devuelve las sesiones que el estudiante tiene pendientes por evaluar.
     */
    public function index(Request $request)
    {
        $estudianteUUID = $request->route('estudiante_uuid');

        $sesiones = DB::table('Inscripcion as i')
            ->select(
                    's.cod_sesion',
                    't.nombre_completo as tutor',
                    'm.nombre as materia',
                    't.puntaje', // se llenará en la pantalla al evaluar
                    's.fecha',
                    DB::raw('DATE_FORMAT(s.hora, "%H:%i") as hora'),
                    's.salon'
                )
            ->join('Sesion as s', 'i.cod_sesion', '=', 's.cod_sesion')
            ->join('Imparte as im', 's.cod_sesion', '=', 'im.cod_sesion')
            ->join('Tutor as t', 'im.cod_tutor', '=', 't.cod_tutor')
            ->join('Materia as m', 'im.cod_materia', '=', 'm.cod_materia')
            ->leftJoin('Evaluacion as e', function ($join) {
                $join->on('e.cod_sesion', '=', 's.cod_sesion')
                     ->on('e.estudiante_uuid', '=', 'i.estudiante_uuid');
            })
            ->where('i.estudiante_uuid', $estudianteUUID)
            ->where('i.estado_eval', 'no hecha')
            ->where('s.estado', 'inactiva')
            // solo sesiones que aún NO han sido evaluadas por este estudiante
            ->whereNull('e.cod_eval')
            // si en tu tabla de sesión tienes un estado, puedes filtrar
            ->orderBy('s.fecha')
            ->get();
            
        if ($sesiones->isEmpty()) {
            return response()->json([
                'message' => 'No hay sesiones por evaluar.',
            ], 404);
        }

        return response()->json([
            'sesiones' => $sesiones,
        ], 200);
    }

    /**
     * POST /api/evaluaciones
     * Crea una evaluación para una sesión.
     */
    public function store(InsertarEvaluacionRequest $request) : JsonResponse
    {
        $validated = $request->validated();

        $estudianteUUID = $validated['estudiante_uuid'];
        $codSesion      = $validated['cod_sesion'];
        $puntuacion     = $validated['puntuacion'];

        // 1) Verificar que el estudiante esté inscrito en esa sesión
        $inscripcion = Inscripcion::where('estudiante_uuid', $estudianteUUID)
            ->where('cod_sesion', $codSesion)
            ->first();

        if (!$inscripcion) {
            return response()->json([
                "mensaje" => "El estudiante no está inscrito en la sesión indicada."
            ], 404);
        }

        // 2) Verificar que la sesión no haya sido evaluada ya por ese estudiante
        $yaEvaluo = Evaluacion::where('estudiante_uuid', $estudianteUUID)
            ->where('cod_sesion', $codSesion)
            ->exists();

        if ($yaEvaluo) {
            return response()->json([
                "mensaje" => "Esta sesión ya fue evaluada por este estudiante."
            ], 409);
        }

        // 3) Obtener el cod_tutor a partir de la tabla Imparte
        $imparte = Imparte::where('cod_sesion', $codSesion)->first();

        if (!$imparte) {
            return response()->json([
                "mensaje" => "No se encontró tutor asignado a la sesión indicada."
            ], 422);
        }

        // 4) Crear la evaluación (NO mandamos cod_eval)
        $evaluacion = Evaluacion::create([
            'puntuacion'      => $puntuacion,
            'fechaHora'       => now(),              // o $validated['fechaHora'] si lo envías desde el front
            'estudiante_uuid' => $estudianteUUID,
            'cod_tutor'       => $imparte->cod_tutor,
            'cod_sesion'      => $codSesion,
        ]);

        return response()->json([
            "mensaje"    => "Evaluación creada correctamente.",
            "evaluacion" => $evaluacion
        ], 201);
    }
}

/*Usar el mismo orden
Faltan cod de tutor y fecha*/
