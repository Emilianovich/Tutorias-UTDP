<?php

namespace App\Http\Requests;

use App\Models\Estudiante;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Foundation\Http\FormRequest;

class CambiarContrasenaRequest extends FormRequest{
    public function authorize():bool{
        return true;
    }

    public function rules(): array{
        return [
            'contrasena_nueva' => 'required|confirmed',
        ];
    }

    public function messages(): array{
        return [
            'contrasena_nueva.required' => 'Por favor, llene los campos solicitados',
            'contrasena_nueva.confirmed' => 'La confirmación de la contraseña no coincide.'
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $estudiante_uuid = $this->route('estudiante_uuid');
            $usuario = DB::table('Estudiante')->where('estudiante_uuid', $estudiante_uuid)->first();

            if ($usuario && Hash::check($this->input('contrasena_nueva'), $usuario->contrasena)) {
                $validator->errors()->add('contrasena_nueva', 'La nueva contraseña debe de ser diferente a la anterior');
            }
        });
    }
}
