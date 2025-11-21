<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Estudiante;
use App\Models\Facultad;

use App\Rules\ValidEmail;
use App\Rules\ValidPhoneNumber;
use App\Rules\ValidStudentID;
use App\Rules\ValidFaculty;

class StoreEstudianteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "nombre" => [
                "required",
                "string",
                "max:50"
            ],

            "apellido" => [
                "required",
                "string",
                "max:50"
            ],

            "cedula" => [
                "required",
                "string",
                "max:13",
                Rule::unique("Estudiante", "cedula"),
                new ValidStudentID()   // tu regla personalizada
            ],

            "correo" => [
                "required",
                "string",
                "email",
                "max:75",
                Rule::unique("Estudiante", "correo"),
                new ValidEmail()       // tu regla personalizada
            ],

            "telefono" => [
                "required",
                "string",
                "max:9",
                new ValidPhoneNumber() // tu regla personalizada
            ],

            "cod_facultad" => [
                "required",
                "string",
                "max:4",
                Rule::exists("Facultad", "cod_facultad"),
                new ValidFaculty()     // tu regla personalizada
            ],

            "contraseña" => [
                "required",
                "string",
                "min:6",
                "max:100"
            ]
        ];
    }

    public function messages(): array
    {
        return [
            "nombre.required" => "El nombre es obligatorio.",
            "apellido.required" => "El apellido es obligatorio.",
            "cedula.required" => "La cédula es obligatoria.",
            "cedula.unique" => "Esta cédula ya está registrada.",
            "correo.required" => "El correo es obligatorio.",
            "correo.unique" => "Este correo ya está registrado.",
            "telefono.required" => "El teléfono es obligatorio.",
            "cod_facultad.required" => "Debe asignar una facultad.",
            "cod_facultad.exists" => "La facultad seleccionada no existe.",
            "contraseña.required" => "Debe proporcionar una contraseña."
        ];
    }
}
