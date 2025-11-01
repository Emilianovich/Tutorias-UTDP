<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EstudianteController;
use App\Http\Controllers\SesionController;
use App\Http\Controllers\ImparteController;
use App\Http\Controllers\InscripcionController;
use App\Http\Controllers\EvaluacionController;


Route::get('/bienvenida', function () {
    return ["mensaje" => "Bienvenidos a Tutorías UTDP"];
});
