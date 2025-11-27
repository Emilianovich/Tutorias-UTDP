<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Estudiante extends Model
{
    protected $table = 'Estudiante';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $primaryKey = 'cedula';

    protected $fillable = ['nombre', 'apellido', 'cedula', 'correo', 'telefono', 'cod_facultad', 'contraseña', 'estudiante_uuid'];
    public $timestamps = false;

    protected static function booted()
    {
        static::creating(function ($model) {

            if (empty($model->estudiante_uuid)) {
                $model->estudiante_uuid = (string) Str::uuid();
            }
        });
    }
    protected function casts() : array {
        return [
            "contraseña" => "hashed",
        ]
            ;
    }
    public function facultad() : BelongsTo {
        return $this->belongsTo(Facultad::class, 'cod_facultad', 'cod_facultad');
    }
    public function inscripciones() : HasMany {
        return $this->hasMany(Inscripcion::class, 'estudiante_uuid', 'estudiante_uuid');
    }
    public function evaluaciones() : HasMany {
        return $this->hasMany(Evaluacion::class, 'estudiante_uuid', 'estudiante_uuid');
    }
}
