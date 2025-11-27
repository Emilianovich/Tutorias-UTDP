<?php

namespace App\Rules;

use App\Models\Sesion;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ActiveSesion implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $consulta = Sesion::where("cod_sesion", $value)->first();
        if (empty($consulta) || ($consulta->estado == "inactiva")) {
            $fail("No puedes inscribirte a esa sesión");
        }
    }
}
