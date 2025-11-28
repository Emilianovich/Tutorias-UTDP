<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tutor extends Model
{
    protected $table = 'Tutor';
    protected $primaryKey = 'cod_tutor';
    public $timestamps = false;

    protected function casts() : array {
        return [
            "puntaje" => "decimal:2",
        ]
            ;
    }

    public function facultad() : BelongsTo {
        return $this->belongsTo(Facultad::class, 'cod_facultad', 'cod_facultad');
    }
    public function sesionesImpartidas() : HasMany {
        return $this->hasMany(Imparte::class, 'cod_tutor', 'cod_tutor');
    }
    public function evaluaciones() : HasMany {
        return $this->hasMany(Evaluacion::class, 'cod_tutor', 'cod_tutor');
    }

}
