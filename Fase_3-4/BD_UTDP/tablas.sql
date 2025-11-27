/*CREATE DATABASE utdp*/

CREATE TABLE Facultad (
    cod_facultad VARCHAR(4) PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    CONSTRAINT CK_Facultad_cod_facultad CHECK (cod_facultad IN ('FCYT','FIC','FIE','FII','FIM','FISC'))
);

CREATE TABLE Estudiante (
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    cedula VARCHAR(13) PRIMARY KEY,
    correo VARCHAR(75) NOT NULL,
    telefono VARCHAR(9) NOT NULL,
    cod_facultad VARCHAR(4) NOT NULL,
    contraseña VARCHAR(100) NOT NULL,
    estudiante_uuid CHAR(36) NOT NULL,
    CONSTRAINT CK_Estudiante_cedula CHECK (
        cedula REGEXP '^[1-9]-[0-9]{1,4}-[0-9]{1,6}$' OR 
        cedula REGEXP '^20-[0-9]{4}-[0-9]{5}$' OR
        cedula REGEXP '^PE-[0-9]{1,4}-[0-9]{1,6}$' OR
        cedula REGEXP '^E-[0-9]{4}-[0-9]{5}$'
    ),
    CONSTRAINT CK_Estudiante_telefono CHECK (telefono REGEXP '^6[0-9]{3}-[0-9]{4}$'),
    CONSTRAINT UQ_Estudiante_correo UNIQUE (correo),
    CONSTRAINT UQ_Estudiante_uuid UNIQUE (estudiante_uuid),
    CONSTRAINT FK_Estudiante_cod_facultad FOREIGN KEY (cod_facultad) REFERENCES Facultad (cod_facultad)
);

CREATE TABLE Tutor (
    cod_tutor INT AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(13) NOT NULL,
    nombre_completo VARCHAR(50) NOT NULL,
    correo VARCHAR(75) NOT NULL,
    telefono VARCHAR(9) NOT NULL,
    descripcion VARCHAR(150) NOT NULL,
    puntaje DECIMAL(3,2) DEFAULT 0.00,
    cod_facultad VARCHAR(4) NOT NULL,
    CONSTRAINT CK_Tutor_cedula CHECK (
        cedula REGEXP '^[1-9]-[0-9]{1,4}-[0-9]{1,6}$' OR 
        cedula REGEXP '^20-[0-9]{4}-[0-9]{5}$' OR
        cedula REGEXP '^PE-[0-9]{1,4}-[0-9]{1,6}$' OR
        cedula REGEXP '^E-[0-9]{4}-[0-9]{5}$'
    ),
    CONSTRAINT UQ_Tutor_correo UNIQUE (correo),
    CONSTRAINT CK_Tutor_telefono CHECK (telefono REGEXP '^6[0-9]{3}-[0-9]{4}$'),
    CONSTRAINT UQ_Tutor_telefono UNIQUE (telefono),
    CONSTRAINT FK_Tutor_cod_facultad FOREIGN KEY (cod_facultad) REFERENCES Facultad (cod_facultad)
);

CREATE TABLE Materia (
    cod_materia INT AUTO_INCREMENT,
    nombre VARCHAR(75) NOT NULL,
    descripcion VARCHAR(320) NOT NULL,
    CONSTRAINT PK_Materia_cod_materia PRIMARY KEY (cod_materia),
    CONSTRAINT UQ_Materia_nombre UNIQUE (nombre) 
);

CREATE TABLE Sesion (
    cod_sesion CHAR(5),
    salon VARCHAR(5) NOT NULL, 
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    duracion_sesion TIME NOT NULL,
    cant_estudiantes INT NOT NULL,
    cupos_disponibles INT DEFAULT 0,
    estado VARCHAR(8) DEFAULT 'inactiva',
    CONSTRAINT PK_Sesion_cod_sesion PRIMARY KEY (cod_sesion),
    CONSTRAINT CK_Sesion_cod_sesion CHECK (cod_sesion REGEXP '^[A-Z][0-9]{4}$'),
    CONSTRAINT CK_Sesion_salon CHECK (salon REGEXP '^[1-4]-[1-4][0-9]{2}$'),
    CONSTRAINT CK_Sesion_hora CHECK (hora >= '07:30:00' AND hora <= '20:00:00'),
    CONSTRAINT CK_Sesion_duracion_sesion CHECK (duracion_sesion <= '02:30:00'),
    CONSTRAINT CK_Sesion_cantEstudiantes CHECK (cant_estudiantes <= 15),
    CONSTRAINT CK_Sesion_estado CHECK (estado IN ('activa','inactiva'))
);

CREATE TABLE Imparte (
    cod_tutor INT,    
    cod_materia INT,         
    cod_sesion CHAR(5),    
    CONSTRAINT PK_Imparte_codTutor_codMateria_codSesion PRIMARY KEY (cod_tutor,cod_materia,cod_sesion),
    CONSTRAINT UQ_Imparte_codSesion UNIQUE (cod_sesion),
    CONSTRAINT FK_Imparte_cod_tutor FOREIGN KEY (cod_tutor) REFERENCES Tutor (cod_tutor),
    CONSTRAINT FK_Imparte_cod_materia FOREIGN KEY (cod_materia) REFERENCES Materia (cod_materia),
    CONSTRAINT FK_Imparte_cod_sesion FOREIGN KEY (cod_sesion) REFERENCES Sesion (cod_sesion)  
);

CREATE TABLE Inscripcion (
    estudiante_uuid CHAR(36),
    cod_sesion CHAR(5),
    estado_eval VARCHAR(9) DEFAULT 'no hecha',
    fecha_hora DATETIME NOT NULL,
    CONSTRAINT PK_Inscripcion_estudiante_uuid_codSesion PRIMARY KEY (estudiante_uuid,cod_sesion),
    CONSTRAINT FK_Inscripcion_estudiante_uuid FOREIGN KEY (estudiante_uuid) REFERENCES Estudiante (estudiante_uuid),
    CONSTRAINT FK_Inscripcion_cod_sesion FOREIGN KEY (cod_sesion) REFERENCES Sesion (cod_sesion),
    CONSTRAINT CK_Inscripcion_estado_eval CHECK ( estado_eval IN ('no hecha','hecha'))
);

CREATE TABLE Evaluacion (
    cod_eval INT AUTO_INCREMENT,
    puntuacion INT NOT NULL,
    fechaHora DATETIME NOT NULL,
    estudiante_uuid CHAR(36),
    cod_tutor INT NOT NULL,
    cod_sesion CHAR(5) NOT NULL,
    CONSTRAINT PK_Evaluacion_cod_eval PRIMARY KEY (cod_eval),
    CONSTRAINT FK_Evaluacion_estudiante_uuid FOREIGN KEY (estudiante_uuid) REFERENCES Estudiante (estudiante_uuid),
    CONSTRAINT FK_Evaluacion_codTutor FOREIGN KEY (cod_tutor) REFERENCES Tutor (cod_tutor),
    CONSTRAINT FK_Evaluacion_codSesion FOREIGN KEY (cod_sesion) REFERENCES Sesion (cod_sesion),
    CONSTRAINT CK_Evaluacion_puntuacion CHECK (puntuacion BETWEEN 1 AND 5),
    CONSTRAINT UQ_Evaluacion_estudiante_uuid_codSesion UNIQUE (estudiante_uuid,cod_sesion)
);

--Inserts NECESARIOS
INSERT INTO Facultad VALUES
('FCYT', 'Facultad de Ciencias y Tecnología'),
('FIC', 'Facultad de Ingeniería Civil'),
('FIE', 'Facultad de Ingeniería Eléctrica'),
('FII', 'Facultad de Ingeniería Industrial'),
('FIM', 'Facultad de Ingeniería Mecánica'),
('FISC', 'Facultad de Ingeniería de Sistemas Computacionales');

INSERT INTO Materia (nombre, descripcion)
VALUES
('Cálculo I', 'Curso introductorio al análisis matemático. Estudia límites, continuidad y derivadas de funciones reales. Se enfoca en aplicaciones físicas y geométricas, así como en técnicas para resolver problemas de cambio y tasas de variación.'),
('Cálculo II', 'Extensión del cálculo diferencial hacia el cálculo integral. Incluye técnicas de integración, aplicaciones como cálculo de áreas, volúmenes y longitudes, así como una introducción a las sucesiones, series y pruebas de convergencia.'),
('Programación', 'Introducción a la lógica y sintaxis de la programación estructurada. Desarrolla habilidades para resolver problemas mediante algoritmos, estructuras de control, funciones, arreglos y lectura/escritura de archivos en un lenguaje de alto nivel.'),
('Física I', 'Estudia principios fundamentales de la mecánica clásica. Cubre cinemática, dinámica, leyes de Newton, trabajo, energía, momentum y movimiento circular. Enfocado en la modelación y análisis de sistemas físicos en una y dos dimensiones.'),
('Física II', 'Curso centrado en electricidad y magnetismo. Incluye cargas eléctricas, campos, potencial, ley de Gauss, corriente, resistencia, capacitancia, circuitos eléctricos, ley de Faraday e introducción al electromagnetismo y ondas.'),
('Ecuaciones Diferenciales', 'Aborda métodos analíticos para resolver ecuaciones diferenciales ordinarias. Incluye ecuaciones de primer y segundo orden, sistemas de ecuaciones, y aplicaciones en ingeniería, física y otras ciencias aplicadas.');


--Procedimiento Almacenado automatizado para actualizar el estado de las sesiones cuando pase la fecha
DELIMITER //
CREATE PROCEDURE sp_actualizar_estadoSesion()
BEGIN
    UPDATE Sesion 
    SET estado = 'inactiva' 
    WHERE estado = 'activa' 
        AND fecha < NOW();
END;
//
DELIMITER ;

