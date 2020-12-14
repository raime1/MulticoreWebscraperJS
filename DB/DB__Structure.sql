CREATE TABLE Usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(40),
    contrasena VARCHAR(20)
);

CREATE TABLE Tiendas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(20)
);

CREATE TABLE CPUs (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(40),
    gs1080 VARCHAR(40),
    arquitectura VARCHAR(40),
    cores VARCHAR(40),
    base_boost VARCHAR(40),
    tdp VARCHAR(40),
    url_cpu VARCHAR
);

CREATE TABLE ArticulosCPUs (
    id SERIAL PRIMARY KEY,
    id_cpu INT,
    id_tienda INT,
    nombre VARCHAR(60),
    url_cpu VARCHAR,
    url_img VARCHAR,

    CONSTRAINT cpu_articulo_fk FOREIGN KEY (id_cpu) REFERENCES CPUs(id),
    CONSTRAINT tienda_cpu_articulo_fk FOREIGN KEY (id_tienda) REFERENCES Tiendas(id)
);

CREATE TABLE HistorialCPUs (
    id SERIAL PRIMARY KEY,
    id_articulo INT,
    precio NUMERIC,
    fecha TIMESTAMP,
    in_stock BIT,

    CONSTRAINT articulo_cpu_historial FOREIGN KEY (id_articulo) REFERENCES ArticulosCPUs (id)
);

CREATE TABLE GPUs (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(40),
    puntuacion VARCHAR(40),
    arquitectura VARCHAR(40),
    memoria VARCHAR(40),
    base_boost VARCHAR(40),
    tdp VARCHAR(40),
    url_gpu VARCHAR
);

CREATE TABLE ArticulosGPUs (
    id SERIAL PRIMARY KEY,
    id_gpu INT,
    id_tienda INT,
    nombre VARCHAR(60),
    url_gpu VARCHAR,
    url_img VARCHAR,

    CONSTRAINT gpu_articulo_fk FOREIGN KEY (id_gpu) REFERENCES GPUs(id),
    CONSTRAINT tienda_gpu_articulo_fk FOREIGN KEY (id_tienda) REFERENCES Tiendas(id)
);

CREATE TABLE HistorialGPUs (
    id SERIAL PRIMARY KEY,
    id_articulo INT,
    precio NUMERIC,
    fecha TIMESTAMP,
    in_stock BIT,

    CONSTRAINT articulo_gpu_historial FOREIGN KEY (id_articulo) REFERENCES ArticulosGPUs (id)
);


