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
                "string"
            ],

            "apellido" => [
                "required",
                "string"
            ],

            "cedula" => [
                "required",
                Rule::unique("Estudiante", "cedula"),
                new ValidStudentID()
            ],

            "correo" => [
                "required",
                "email",
                Rule::unique("Estudiante", "correo"),
                new ValidEmail()
            ],

            "telefono" => [
                "required",
                new ValidPhoneNumber()
            ],

            "cod_facultad" => [
                "required",
                Rule::exists("Facultad", "cod_facultad"),
                new ValidFaculty()
            ],

            "contraseña" => [
                "required"
            ]
        ];
    }

    public function messages(): array
    {
        return [
            "nombre.required" => "Por favor, llene los campos solicitados",
            "apellido.required" => "Por favor, llene los campos solicitados",
            "cedula.required" => "Por favor, llene los campos solicitados",
            "cedula.unique" => "Esta cédula ya existe en el sistema",
            "correo.required" => "Por favor, llene los campos solicitados",
            "correo.unique" => "El correo ingresado ya existe en el sistema",
            "telefono.required" => "Por favor, llene los campos solicitados",
            "cod_facultad.required" => "Por favor, llene los campos solicitados",
            "cod_facultad.exists" => "La facultad seleccionada no existe",
            "contraseña.required" => "Por favor, llene los campos solicitados"
        ];
    }
}
