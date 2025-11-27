-- TRIGGER: Activar sesión al insertar en Imparte
DELIMITER //
CREATE TRIGGER t_registrarSesion_Activa
AFTER INSERT ON Imparte
FOR EACH ROW
BEGIN
    UPDATE Sesion SET estado = 'activa'
    WHERE cod_sesion = NEW.cod_sesion;
END;
//
DELIMITER ;

-- TRIGGER: Validar inscripción de estudiante
DELIMITER //
CREATE TRIGGER t_validarInscripcion
BEFORE INSERT ON Inscripcion
FOR EACH ROW
BEGIN
    DECLARE v_estado VARCHAR(8);
    DECLARE v_cupos INT;
    DECLARE v_fecha DATE;
    SELECT estado, cupos_disponibles, fecha
    INTO v_estado, v_cupos, v_fecha
    FROM Sesion
    WHERE cod_sesion = NEW.cod_sesion;

    IF EXISTS (
        SELECT 1 FROM Inscripcion
        WHERE estudiante_uuid = NEW.estudiante_uuid AND cod_sesion = NEW.cod_sesion
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ya se ha inscrito en esta sesión!';
    ELSEIF (v_estado = 'activa' AND v_cupos > 0 AND NOW() < v_fecha) THEN
        SET NEW.fecha_hora = NOW();
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No puedes inscribirte a esa sesión';
    END IF;
END;
//
DELIMITER ;

-- TRIGGER: Calcular puntaje del tutor
DELIMITER //
CREATE TRIGGER t_calcularPuntajeTutor
AFTER INSERT ON Evaluacion
FOR EACH ROW
BEGIN
    DECLARE v_promedio DECIMAL(3,2);
    SELECT AVG(puntuacion) INTO v_promedio
    FROM Evaluacion
    WHERE cod_tutor = NEW.cod_tutor;

    UPDATE Tutor
    SET puntaje = v_promedio
    WHERE cod_tutor = NEW.cod_tutor;
END;
//
DELIMITER ;

-- TRIGGER: Actualizar cupos luego de inscripción
DELIMITER //
CREATE TRIGGER t_calcularCupos_Sesion
AFTER INSERT ON Inscripcion
FOR EACH ROW
BEGIN
    DECLARE v_total INT;
    DECLARE v_max INT;

    SELECT COUNT(*) INTO v_total
    FROM Inscripcion
    WHERE cod_sesion = NEW.cod_sesion;

    SELECT cant_estudiantes INTO v_max
    FROM Sesion
    WHERE cod_sesion = NEW.cod_sesion;

    UPDATE Sesion
    SET cupos_disponibles = v_max - v_total
    WHERE cod_sesion = NEW.cod_sesion;
END;
//
DELIMITER ;

-- TRIGGER: Actualizar cupos luego de desinscripción
DELIMITER //
CREATE TRIGGER t_calcularCupos_Sesion_desinscripcion
AFTER DELETE ON Inscripcion
FOR EACH ROW
BEGIN
    UPDATE Sesion
    SET cupos_disponibles = cupos_disponibles + 1 
    WHERE cod_sesion = OLD.cod_sesion;
END;
//
DELIMITER ;

-- TRIGGER: Inicializar cupos disponibles al crear sesión
DELIMITER //
CREATE TRIGGER t_cupos_por_defecto
BEFORE INSERT ON Sesion
FOR EACH ROW
BEGIN
    SET NEW.cupos_disponibles = NEW.cant_estudiantes;
END;
//
DELIMITER ;

DELIMITER $$

--Trigger para validar la evaluación
CREATE TRIGGER t_validarEvaluacion
BEFORE INSERT ON Evaluacion
FOR EACH ROW
BEGIN
    DECLARE fecha_actual DATE DEFAULT CURDATE();
    DECLARE fecha_sesion DATE;
    DECLARE inscripcion_existe INT DEFAULT 0;
    
    -- Obtener la fecha de la sesión
    SELECT fecha INTO fecha_sesion
    FROM Sesion
    WHERE cod_sesion = NEW.cod_sesion;
    
    -- Verificar si existe la inscripción
    SELECT COUNT(*) INTO inscripcion_existe
    FROM Inscripcion
    WHERE estudiante_uuid = NEW.estudiante_uuid
        AND cod_sesion = NEW.cod_sesion;
    
    -- Validaciones
    IF inscripcion_existe = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No puede evaluar una sesión en la que no ha participado';
    END IF;
    
    -- Validar que la sesión ya haya pasado (fecha_sesion debe ser menor que hoy)
    IF fecha_sesion >= fecha_actual THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No puede evaluar una sesión que aún no se ha dado';
    END IF;
    
    -- Establecer la fecha y hora actual para el INSERT
    SET NEW.fechaHora = NOW();
END$$

-- Trigger adicional para actualizar el estado después del INSERT
CREATE TRIGGER t_actualizarInscripcion
    AFTER INSERT ON Evaluacion
    FOR EACH ROW
BEGIN
    UPDATE Inscripcion
    SET estado_eval = 'hecha' 
    WHERE estudiante_uuid = NEW.estudiante_uuid
        AND cod_sesion = NEW.cod_sesion;
END$$

DELIMITER ;
