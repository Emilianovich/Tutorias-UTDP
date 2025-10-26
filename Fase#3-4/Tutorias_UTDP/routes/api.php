<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/bienvenida', function () {
    return ["mensaje" => "Bienvenidos a Tutorías UTDP"];
});
