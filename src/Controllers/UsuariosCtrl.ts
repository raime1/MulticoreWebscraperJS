import { getRepository, EntityManager } from 'typeorm';
import { sendResponse } from '../Utilities/sendResponse';
import { Usuarios } from '../Entities/Usuarios';

const express = require('express');
const app = express();
const HttpStatus = require('http-status-codes');

app.get('/login', async function (req, res) {
    return getRepository(Usuarios).findOneOrFail({
        where: {email : req.body.email}
    })
    .then((u:Usuarios) => {
        if(u.contrasena === req.body.contrasena)
            return sendResponse(u, "Sesión Iniciada", true, HttpStatus.OK, res);
        else
            return sendResponse(null, "Contraseña incorrecta", false, HttpStatus.UNAUTHORIZED, res);
    })
    .catch(err => {
        return sendResponse(err, "No se ha encontrado el usuario", false, HttpStatus.UNAUTHORIZED, res)
    });
});

app.post('/register', async function (req, res) {
    let usuario = new Usuarios(
        req.body.email,
        req.body.contrasena
    );
    return getRepository(Usuarios).save(usuario)
    .then((u:Usuarios) => {
        return sendResponse(u, "Usuario registrado con exito", true, HttpStatus.OK, res);
    })
    .catch(err => {
        return sendResponse(err, "Error al registrar el usuario", false, HttpStatus.INTERNAL_SERVER_ERROR, res);
    });
});

module.exports = app;