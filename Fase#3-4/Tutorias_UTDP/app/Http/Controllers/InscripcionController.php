<?php

namespace App\Http\Controllers;

use App\Http\Requests\InsertarInscripcionRequest;
use App\Models\Materia;
use App\Models\Sesion;
use Illuminate\Http\Request;
use App\Models\Inscripcion;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
class InscripcionController extends Controller
{
    public function index(Request $request) {
        $infoMateria = Materia::where("cod_materia", $request->route("cod_materia"))->first();
        $sesionesDisponibles = DB::select('SELECT
            t.nombre_completo,
            t.puntaje,
            s.fecha,
            CONCAT(
            DATE_FORMAT(s.hora, "%H:%i"),
            " - ",
            DATE_FORMAT(ADDTIME(s.hora, s.duracion_sesion), "%H:%i")
        ) as horario,
            s.salon,
            s.cupos_disponibles as cupos,
            s.cod_sesion
            FROM `Imparte` im
                 INNER JOIN Tutor t ON t.cod_tutor = im.cod_tutor
                 INNER JOIN Sesion s ON im.cod_sesion = s.cod_sesion
                 LEFT JOIN Inscripcion ins ON ins.cod_sesion = im.cod_sesion AND ins.estudiante_uuid = ?
            WHERE im.cod_materia = ? AND s.estado = ? AND ins.cod_sesion IS NULL'
        , [$request->route("estudiante_uuid"),
            $request->route("cod_materia"),
            'activa']
        );
        return response()->json([   "nombre" => $infoMateria->nombre,
                                    "descripcion" => $infoMateria->descripcion,
                                    "sesiones" => $sesionesDisponibles]);
    }

    public function show(Request $request) {
        $infoMateria = Materia::where("cod_materia", $request->route("cod_materia"))->first();
        $sesionPorInscribir = DB::select('SELECT
            t.nombre_completo,
            t.puntaje,
            DATE_FORMAT(s.hora, "%H:%i") as hora,
            s.salon,
            s.cupos_disponibles as cupos
            FROM `Imparte` im
                 INNER JOIN Tutor t ON t.cod_tutor = im.cod_tutor
                 INNER JOIN Sesion s ON im.cod_sesion = s.cod_sesion
            WHERE im.cod_sesion = ?'
            , [$request->route("cod_sesion")]);

        return response()->json([   "nombre" => $infoMateria->nombre,
                                    "descripcion" => $infoMateria->descripcion,
                                    "sesion" => $sesionPorInscribir]);
    }

    public function store(InsertarInscripcionRequest $request) {
        $validated = $request->validated();
        Inscripcion::create($validated);
        return response()->json(["mensaje" => "Usted se encuentra oficialmente inscrit@ en la sesión"], 201);
    }
}
