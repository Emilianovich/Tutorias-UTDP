<?php

namespace App\Http\Controllers;

use App\Http\Requests\InsertarInscripcionRequest;
use App\Models\Materia;
use Illuminate\Http\Request;
use App\Models\Inscripcion;
use Illuminate\Support\Facades\DB;
use \Illuminate\Http\JsonResponse;
class InscripcionController extends Controller
{
    public function index(Request $request) : JsonResponse {
        $infoMateria = Materia::where("cod_materia", $request->route("cod_materia"))->first();
        $sesionesDisponibles = DB::table('Imparte AS im')
            ->select('t.nombre_completo', 't.puntaje', 's.fecha', DB::raw('CONCAT(DATE_FORMAT(s.hora, "%H:%i"), " - ", DATE_FORMAT(ADDTIME(s.hora, s.duracion_sesion), "%H:%i")) as horario'), 's.salon', 's.cupos_disponibles as cupos', 's.cod_sesion')
            ->join('Tutor AS t', 'im.cod_tutor', '=', 't.cod_tutor')
            ->join('Sesion AS s', 'im.cod_sesion', '=', 's.cod_sesion')
            ->leftJoin('Inscripcion AS ins', function ($join) use ($request) {
                $join->on('im.cod_sesion', '=', 'ins.cod_sesion')
                    ->where('ins.estudiante_uuid', '=', $request->route("estudiante_uuid"));})
            ->where('im.cod_materia', '=', $request->route("cod_materia"))
            ->where('s.estado', '=' , 'activa')
            ->whereNull('ins.cod_sesion')
            ->get();
        return response()->json([   "nombre" => $infoMateria->nombre,
                                    "descripcion" => $infoMateria->descripcion,
                                    "sesiones" => $sesionesDisponibles]);
    }

    public function show(Request $request): JsonResponse
    {
        $infoMateria = Materia::where("cod_materia", $request->route("cod_materia"))->first();
        $sesionPorInscribir = DB::table("Imparte as im")
            ->select('t.nombre_completo', 't.puntaje', DB::raw('DATE_FORMAT(s.hora, "%H:%i") as hora'), 's.salon', 's.cupos_disponibles AS cupos')
            ->join('Tutor AS t', 'im.cod_tutor', '=', 't.cod_tutor')
            ->join('Sesion AS s', 'im.cod_sesion', '=', 's.cod_sesion')
            ->where('im.cod_sesion', '=', $request->route("cod_sesion"))
            ->first();

        return response()->json([   "nombre" => $infoMateria->nombre,
                                    "descripcion" => $infoMateria->descripcion,
                                    "sesion" => $sesionPorInscribir]);
    }

    public function store(InsertarInscripcionRequest $request) : JsonResponse {
        $validated = $request->validated();
        Inscripcion::create($validated);
        return response()->json(["mensaje" => "Usted se encuentra oficialmente inscrit@ en la sesión"], 201);
    }
}
