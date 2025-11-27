<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Evaluacion extends Model
{
    protected $table = 'Evaluacion';
    public $timestamps = false;
    protected $primaryKey = 'cod_eval';
    protected $fillable = ['puntuacion', 'fechaHora', 'estudiante_uuid', 'cod_tutor', 'cod_sesion'];
    protected function casts() : array {
        return [
            "puntuacion" => "integer",
            "fechaHora" => "datetime",
            "cod_tutor" => "integer",
        ];
    }
    public function estudiante() : BelongsTo {
        return $this->belongsTo(Estudiante::class, 'estudiante_uuid', 'estudiante_uuid');
    }
    public function tutor() : BelongsTo {
        return $this->belongsTo(Tutor::class, 'cod_tutor', 'cod_tutor');
    }
    public function sesion() : BelongsTo {
        return $this->belongsTo(Sesion::class, 'cod_sesion', 'cod_sesion');
    }
}
