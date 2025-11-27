--Consulta para la página de evaluar 
CREATE OR REPLACE VIEW  vw_sesiones_por_evaluar AS 
SELECT
    t.nombre_completo,
    m.nombre,
    t.puntaje,
    s.estado,
    ins.estado_eval,
    e.cedula
    FROM Estudiante e
    INNER JOIN Inscripcion ins ON e.estudiante_uuid = ins.estudiante_uuid
    INNER JOIN Sesion s ON ins.cod_sesion = s.cod_sesion
    INNER JOIN Imparte im ON s.cod_sesion = im.cod_sesion
    INNER JOIN Tutor t ON im.cod_tutor = t.cod_tutor
    INNER JOIN Materia m ON im.cod_materia = m.cod_materia
    WHERE s.estado = 'inactiva' AND ins.estado_eval = 'no hecha'

--Consulta para las sesiones activas
CREATE OR REPLACE VIEW vw_datos_sesionesActivas_Estudiante AS
SELECT
    e.estudiante_uuid,
    m.nombre AS materia,
    t.nombre_completo AS tutor,
    s.salon,
    s.fecha, --para que funcione el order by asc
    CONCAT(DATE_FORMAT(s.hora, '%H:%i'), ' - ', DATE_FORMAT(ADDTIME(s.hora, s.duracion_sesion), '%H:%i')) AS horario_sesion
FROM Estudiante e
INNER JOIN Inscripcion i ON e.estudiante_uuid = i.estudiante_uuid
INNER JOIN Sesion s ON i.cod_sesion = s.cod_sesion
INNER JOIN Imparte im ON i.cod_sesion = im.cod_sesion
INNER JOIN Tutor t ON im.cod_tutor = t.cod_tutor
INNER JOIN Materia m ON im.cod_materia = m.cod_materia
WHERE s.estado = 'activa';

--Consulta para las sesiones inactivas
CREATE OR REPLACE VIEW vw_datos_sesionesInactivas_Estudiante AS 
SELECT
    e.estudiante_uuid,
    m.nombre AS materia,
    t.nombre_completo AS tutor,
    s.salon,
    s.fecha, --para que funcione el order by asc
    CONCAT(DATE_FORMAT(s.hora, '%H:%i'), ' - ', DATE_FORMAT(ADDTIME(s.hora, s.duracion_sesion), '%H:%i')) AS horario_sesion
FROM Estudiante e
INNER JOIN Inscripcion i ON e.estudiante_uuid = i.estudiante_uuid
INNER JOIN Sesion s ON i.cod_sesion = s.cod_sesion
INNER JOIN Imparte im ON i.cod_sesion = im.cod_sesion
INNER JOIN Tutor t ON im.cod_tutor = t.cod_tutor
INNER JOIN Materia m ON im.cod_materia = m.cod_materia
WHERE s.estado = 'inactiva';

--Consulta para los datos personales
CREATE OR REPLACE VIEW vw_infoEstudiante AS
SELECT
    e.nombre,
    e.apellido,
    e.cedula,
    e.telefono,
    f.nombre AS facultad, --el alias es facultad
    e.correo,
    e.contraseña
FROM Estudiante e
INNER JOIN Facultad f ON e.cod_facultad = f.cod_facultad;