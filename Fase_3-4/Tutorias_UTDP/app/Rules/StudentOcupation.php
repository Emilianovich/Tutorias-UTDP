<?php

namespace App\Rules;

use App\Models\Sesion;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StudentOcupation implements ValidationRule
{
  protected array $infoInscripcion;

  public function __construct(array $infoInscripcion) {
      $this->infoInscripcion = $infoInscripcion;
  }
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $consulta = Sesion::where("cod_sesion", $this->infoInscripcion["cod_sesion"])->first();
        if (empty($consulta)) {
            $fail("Se requiere un código de sesión válido para poder continuar con la inscripción");
            return;
        }
        $fechaSesion =  Carbon::parse($consulta->fecha)->format('Y-m-d');
        $horaSesion =  Carbon::parse($consulta->hora)->format('H:i:s');
        $fechaDuracionSesion = Carbon::parse($fechaSesion . ' ' . $horaSesion);

        $consultaDisponibilidad = DB::table('Sesion as s')
            ->join('Inscripcion as ins', 'ins.cod_sesion', '=', 's.cod_sesion')
            ->selectRaw('DATE_ADD(s.fecha, INTERVAL TIME_TO_SEC(s.hora) SECOND) AS hora_inicio_sesion,
                                   DATE_ADD(s.fecha, INTERVAL TIME_TO_SEC(ADDTIME(s.hora, s.duracion_sesion)) SECOND) AS hora_final_sesion')
            ->where('ins.estudiante_uuid', $this->infoInscripcion['estudiante_uuid'])
            ->get();

        foreach ($consultaDisponibilidad as $fechaDuracion) {
            if ($fechaDuracionSesion->between(Carbon::parse($fechaDuracion->hora_inicio_sesion),Carbon::parse($fechaDuracion->hora_final_sesion)))  {
                $fail("No puedes inscribirte en esta sesión, estás inscrito en otra a la misma hora");
            }
        }
    }

}
