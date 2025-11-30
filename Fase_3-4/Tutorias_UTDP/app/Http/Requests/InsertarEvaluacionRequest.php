<?php

namespace App\Http\Requests;

use App\Models\Estudiante;
use App\Models\Sesion;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InsertarEvaluacionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'estudiante_uuid' => [
                'required',
                'string',
                'size:36',
                Rule::exists(Estudiante::class, 'estudiante_uuid'),
            ],
            'cod_sesion' => [
                'required',
                'string',
                'size:5',
                Rule::exists(Sesion::class, 'cod_sesion'),
            ],
            'puntuacion' => [
                'required',
                'integer',
                'between:1,5',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'estudiante_uuid.required' => 'Se requiere la información del estudiante.',
            'estudiante_uuid.exists'   => 'El estudiante indicado no existe.',
            'cod_sesion.required'      => 'Se requiere la sesión a evaluar.',
            'cod_sesion.exists'        => 'La sesión indicada no existe.',
            'puntuacion.required'      => 'Debe seleccionar una puntuación entre 1 y 5.',
            'puntuacion.between'       => 'La puntuación debe estar entre 1 y 5.',
        ];
    }
}
