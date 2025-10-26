<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Thiagoprz\CompositeKey\HasCompositeKey;


class Imparte extends Model
{
    use HasCompositeKey;
    protected $table = 'Imparte';
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = ['cod_tutor', 'cod_materia','cod_sesion'];
    public function tutorAsignado() : BelongsTo {
        return $this->belongsTo(Tutor::class, 'cod_tutor', 'cod_tutor');
    }
    public function materiaAsignada (): BelongsTo {
        return $this->belongsTo(Materia::class, 'cod_materia', 'cod_materia');
    }
    public function sesionAsignada (): BelongsTo {
        return $this->belongsTo(Sesion::class, 'cod_sesion', 'cod_sesion');
    }
}
