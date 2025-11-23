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
/*Rutas para perfil*/
Route::get('/estudiante/{estudiante_uuid}', [EstudianteController::class,'show']);
Route::get('/sesion/anterior/{estudiante_uuid}', [SesionController::class,'sesionAnterior']);
Route::get('/sesion/pendiente/{estudiante_uuid}', [SesionController::class,'sesionPendiente']);
Route::delete('/desinscripcion/{estudiante_uuid}/{cod_sesion}', [InscripcionController::class, 'desinscribirse']);
Route::patch('/cambiarContrasena/{estudiante_uuid}', [EstudianteController::class, 'cambiarContrasena']);

