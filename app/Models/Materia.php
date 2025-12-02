<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Materia extends Model
{
    protected $table = 'Materia';
    protected $primaryKey = 'cod_materia';
    public $timestamps = false;

    public function sesionesImpartidas(): HasMany {
        return $this->hasMany(Imparte::class, 'cod_materia', 'cod_materia');
    }
}
