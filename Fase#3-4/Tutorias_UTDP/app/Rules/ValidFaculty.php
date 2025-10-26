<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidFaculty implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $facultadesValidas = ['FCYT', 'FIC', 'FIE', 'FII', 'FIM', 'FISC'];

        if (!in_array($value, $facultadesValidas)) {
            $fail("Por favor, seleccione una facultad válida");
        }
    }
}
