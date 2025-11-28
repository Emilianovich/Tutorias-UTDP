<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Thiagoprz\CompositeKey\HasCompositeKey;

class Inscripcion extends Model
{
    use HasCompositeKey;
    protected $table = 'Inscripcion';
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = ['estudiante_uuid', 'cod_sesion'];
    protected $fillable = ['estudiante_uuid', 'cod_sesion', 'fecha_hora'];
    protected function casts() : array {
        return [
            'fecha_hora' => 'datetime',
        ];
    }

    public function estudiante() : BelongsTo {
        return $this->belongsTo(Estudiante::class, 'estudiante_uuid', 'estudiante_uuid');
    }
    public function sesion() : BelongsTo {
        return $this->belongsTo(Sesion::class, 'cod_sesion', 'cod_sesion');
    }
}
