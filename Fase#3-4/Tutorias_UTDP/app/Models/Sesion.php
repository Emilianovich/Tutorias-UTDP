<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Sesion extends Model
{
    protected $table = 'Sesion';
    public $incrementing = false;
    public $timestamps = false;
    protected $primaryKey = 'cod_sesion';
    protected $keyType = 'string';
    protected function casts() : array {
        return [
            "fecha" => "date:d-m-Y",
            "cant_estudiantes" => "integer",
            "cupos_disponibles" => "integer",
        ];
    }
    public function evaluaciones(): HasMany {
        return $this->hasMany(Evaluacion::class, 'cod_sesion', 'cod_sesion');
    }
    public function imparte(): HasOne {
        return $this->hasOne(Imparte::class, 'cod_sesion', 'cod_sesion');
    }
    public function inscripciones(): HasMany {
        return $this->hasMany(Inscripcion::class, 'cod_sesion', 'cod_sesion');
    }
}
