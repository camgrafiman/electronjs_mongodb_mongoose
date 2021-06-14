/* Encargado de conectarse a la base de datos e iniciar la app. */
/* Módulo principal de electron app */
const { app } = require('electron');
/* Traer funcion que crea la ventana */
const { crearVentana } = require('./main');


/* Requerir el archivo que conecta a la base de datos: */
require("./database");

app.whenReady().then(crearVentana);
// app.on('ready', crearVentana);


// app.on('ready', () => {
//     console.log("Listo!");
// })


//app.allowRendererProcessReuse = false;