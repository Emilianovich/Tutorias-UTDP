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
/*Rutas para Materias*/
Route::get('/materia/{cod_materia}/{estudiante_uuid}', [InscripcionController::class, 'index']);
Route::get('/inscripcion/{cod_materia}/{cod_sesion}', [InscripcionController::class, 'show']);
Route::post('/inscripcion', [InscripcionController::class, 'store']);

/*Rutas para Evaluar y Evaluar_Sesion*/
// Lista de sesiones pendientes por evaluar para un estudiante
Route::get('/sesiones-por-evaluar/{estudiante_uuid}', [EvaluacionController::class, 'index']);

// Crear una evaluación para una sesión
Route::post('/evaluaciones', [EvaluacionController::class, 'store']);
