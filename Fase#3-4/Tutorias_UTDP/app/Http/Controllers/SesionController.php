<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class SesionController extends Controller
{
    public function sesionAnterior(string $estudiante_uuid): JsonResponse{
        $sesionesAnteriores = DB::table('Inscripcion as Ins')
            ->join('Sesion as S','Ins.cod_sesion','=','S.cod_sesion')
            ->join('Imparte as Im','Ins.cod_sesion','=','Im.cod_sesion')
            ->join('Tutor as T','Im.cod_tutor','=','T.cod_tutor')
            ->join('Materia as M','Im.cod_materia','=','M.cod_materia')
            ->where('Ins.estudiante_uuid',$estudiante_uuid)
            ->where('S.fecha', '<', now()->toDateString())
            ->select(
                'M.nombre',
                DB::raw('CONCAT(DATE_FORMAT(S.hora, "%h:%i %p"), " - ", DATE_FORMAT(ADDTIME(S.hora, S.duracion_sesion), "%h:%i %p")) as horario'),
                'S.salon',
                'T.nombre_completo'
            )
            ->orderBy('S.fecha','desc')
            ->get();

        return response()->json($sesionesAnteriores);

    }

    public function sesionPendiente(string $estudiante_uuid): JsonResponse{
        $sesionesPendientes = DB::table('Inscripcion as Ins')
            ->join('Sesion as S','Ins.cod_sesion','=','S.cod_sesion')
            ->join('Imparte as Im','Ins.cod_sesion','=','Im.cod_sesion')
            ->join('Tutor as T','Im.cod_tutor','=','T.cod_tutor')
            ->join('Materia as M','Im.cod_materia','=','M.cod_materia')
            ->where('Ins.estudiante_uuid',$estudiante_uuid)
            ->where('S.fecha', '>', now()->toDateString())
            ->select(
                'M.nombre',
                DB::raw('CONCAT(DATE_FORMAT(S.hora, "%h:%i %p"), " - ", DATE_FORMAT(ADDTIME(S.hora, S.duracion_sesion), "%h:%i %p")) as horario'),
                'S.salon',
                'T.nombre_completo',
                'S.cod_sesion'
            )
            ->orderBy('S.fecha','asc')
            ->get();

        return response()->json($sesionesPendientes);

    }
}
