<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidStudentID implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $formatoNacional = '/^([1-9]|PE)-\d{1,4}-\d{1,6}$/';
        $formatoExtranjero = '/^E-[0-9]{4}-[0-9]{5}$/';
        $formatoExtranjeroUTDP = '/^20-[0-9]{4}-[0-9]{5}$/';

        if (!preg_match($formatoNacional, $value)
            &&!preg_match($formatoExtranjero , $value)
            &&!preg_match($formatoExtranjeroUTDP, $value)) {
            $fail("Por favor, ingrese una cédula panameña válida");
        }

    }
}
