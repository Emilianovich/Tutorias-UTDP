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
            ->whereNull('e.cod_eval')
            ->orderBy('s.fecha')
            ->get();

        if ($sesiones->isEmpty()) {
            return response()->json(['message' => 'No hay sesiones por evaluar'], 404);
        }

        return response()->json(['sesiones' => $sesiones], 200);
    }

    public function store(InsertarEvaluacionRequest $request) : JsonResponse
    {
        $validated = $request->validated();
        $codSesion = $validated['cod_sesion'];

        //Buscar el tutor que impartió la sesión
        $codTutor = Imparte::where('cod_sesion', $codSesion)->value('cod_tutor');

        //Verificar que el estudiante esté inscrito en la sesión
        $inscripcion = Inscripcion::where('estudiante_uuid', $validated['estudiante_uuid'])
            ->where('cod_sesion', $codSesion)
            ->first();
        //Verificar si el estudiante no ha evaluado la sesión
        $yaEvaluo = Evaluacion::where('estudiante_uuid', $validated['estudiante_uuid'])
            ->where('cod_sesion', $codSesion)
            ->exists();

        if (!$inscripcion) {
            return response()->json(["message" => "El estudiante no está inscrito en la sesión indicada"],404);
        }

        elseif ($yaEvaluo) {
            return response()->json(["message" => "Esta sesión ya fue evaluada por este estudiante"], 409);
        }

        else {
            $evaluacion = Evaluacion::create([
                'puntuacion'      => $validated['puntuacion'],
                'fechaHora'       => now(),
                'estudiante_uuid' => $validated['estudiante_uuid'],
                'cod_tutor'       => $codTutor,
                'cod_sesion'      => $validated['cod_sesion'],
            ]);
            return response()->json(["message" => "Evaluación enviada exitosamente",
                                    "evaluacion" => $evaluacion], 201);
        }
    }
}
