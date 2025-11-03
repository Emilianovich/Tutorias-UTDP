<?php

namespace App\Rules;

use Carbon\Carbon;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use App\Models\Sesion;
use function PHPUnit\Framework\isEmpty;

class ValidDate implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $datosSesion = Sesion::where("cod_sesion", $value)->first();
        if (empty($datosSesion)) {
            $fail("Esta sesión ya no está disponible");
            return;
        }
            $fechaSesion = Carbon::parse($datosSesion->fecha);

        if ($fechaSesion->lessThanOrEqualTo(Carbon::now())) {
            $fail("Esta sesión ya no está disponible");
        }
    }
}
