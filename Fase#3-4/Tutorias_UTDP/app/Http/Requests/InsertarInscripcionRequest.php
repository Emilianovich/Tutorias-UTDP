<?php

namespace App\Http\Requests;

use App\Models\Estudiante;
use App\Models\Imparte;
use App\Models\Inscripcion;
use App\Models\Sesion;
use App\Rules\ActiveSesion;
use App\Rules\StudentOcupation;
use App\Rules\ValidDate;
use http\Env\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InsertarInscripcionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        Log::info("Esto es lo que estoy recibiendo del front: estudiante_uuid " . $this->input("estudiante_uuid") . " cod_sesion: ". $this->input("cod_sesion") .  " fecha: " . $this->input("fecha_hora"));
        return [
            "estudiante_uuid" => ["required",
                                  Rule::exists(Estudiante::class, 'estudiante_uuid'),
                                  Rule::unique(Inscripcion::class, 'estudiante_uuid')->where("cod_sesion", $this->input("cod_sesion"))],
            "cod_sesion" => ["required",
                            Rule::exists(Sesion::class, 'cod_sesion'),
                            new ValidDate(),
                            new ActiveSesion()],

            "fecha_hora" => ["required",
                            new StudentOcupation($this->all())],
        ];
    }

    public function messages(): array {
        return [
            "estudiante_uuid.required" => "Se requiere la información del estudiante para proceder con la inscripción",
            "estudiante_uuid.exists" => "Se requiere la información del estudiante para proceder con la inscripción",
            "estudiante_uuid.unique" => "Usted ya está inscrito en esta sesión",
            "cod_sesion.required" => "Se requiere la información de la sesión para proceder con la inscripcion",
            "cod_sesion.exists" => "Se requiere un código de sesión válido para poder continuar con la inscripción",
            "fecha_hora.required" => "Se requiere de la hora actual para proceder con la inscripcion",
        ];
    }

}
