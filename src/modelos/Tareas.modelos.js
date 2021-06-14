/* Este archivo de modelo mongoose se encargará de saber que es lo que estoy guardando en MONGODB. */

/* SCHEMA */

const { model, Schema } = require('mongoose');

const nuevaTareaSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    }
});
/* Crear modelo dandole un nombre y a partir del schema*/
module.exports = model("Tarea", nuevaTareaSchema);