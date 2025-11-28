<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Facultad extends Model
{
    protected $table = 'Facultad';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $primaryKey = 'cod_facultad';
    public $timestamps = false;

    public function estudiantes(): HasMany {
        return $this->hasMany(Estudiante::class, 'cod_facultad', 'cod_facultad');
    }
    public function tutores(): HasMany {
        return $this->hasMany(Tutor::class, 'cod_facultad', 'cod_facultad');
    }

}
