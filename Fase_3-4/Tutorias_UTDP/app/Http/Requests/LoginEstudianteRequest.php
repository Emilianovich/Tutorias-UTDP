<?php

namespace App\Http\Requests;

use App\Models\Estudiante;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Rules\ValidEmail;

class LoginEstudianteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "correo" => [
                "required",
                "email",
                Rule::exists("Estudiante", "correo")
            ],

            "contraseña" => [
                "required"
            ]
        ];
    }

    public function messages(): array
    {
        return [
            "correo.required" => "El campo correo es obligatorio.",
            "correo.exists" => "Correo o contraseña incorrecta.",
            "contraseña.required" => "El campo contraseña es obligatorio."
        ];
    }
}
