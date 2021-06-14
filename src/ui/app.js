/* Interacciones con el USER INTERFACE: */
const formulario = document.querySelector("#formulario");
const formulario_nombre = document.querySelector("#nombre");
const formulario_descripcion = document.querySelector("#descripcion");


/* llamar una funcion de electron para enviar determinados datos al proceso principal de electron. */
// enviar un evento:
const { ipcRenderer } = require('electron');

/* HELPER FUNCTIONS */
const { helpers_render } = require('./helpers/helpers_render');

/* tener acceso a la variable desde nuestra interfaz: controlando el estado*/
let estadoTareas = [];

let estadoEditar = false;
let idEditar = '';

formulario.addEventListener('submit', evento => {
    evento.preventDefault();

    const datosTarea = {
        nombre: formulario_nombre.value,
        descripcion: formulario_descripcion.value
    }

    if (!estadoEditar) {
        /* usar ipcRenderer para mandar datos al proceso principal de electron en main.js. usando un nombre y dato de evento */
        ipcRenderer.send('nueva_tarea', datosTarea);
        /* REVISAR: parece que da fallo: */
        // formulario.reset();
        formulario_nombre.value = '';
        formulario_descripcion.value = '';
        formulario_nombre.focus();

        // console.log(formulario_nombre.value, formulario_descripcion.value);
    } else {
        /* Si está en estado editable: */
        ipcRenderer.send('editar_tarea', {...datosTarea, idEditar })

    }


});

/* Escuchar los datos que vienen de vuelta desde el proceso principal main.js esto me va a devolver 2 cosas un evento y el argumento, en este caso la tarea que se ha guardado en Mongodb.  */
/* Evento que captura cuando se crea un dato: */
ipcRenderer.on('nueva_tarea_guardada', (evento, args) => {

    const nuevaTareaGuardada = JSON.parse(args);
    estadoTareas.push(nuevaTareaGuardada);
    helpers_render.renderizarTareas(estadoTareas);

    /* si se ha renderizado: */
    // alert("Tarea creada y guardada satisfactoriamente.");
    console.info("Tarea creada y guardada satisfactoriamente");
    console.info(nuevaTareaGuardada);
});


/* Evento para obtener los datos: */
/* En este caso se estaría emitiendo este evento en cuanto app.js se ejecute. ENVIAR */
ipcRenderer.send('obtener_tareas');

/* Escuchar el evento que envia el proceso principal, RECIBIR  */
ipcRenderer.on('enviar_tareas', (evento, args) => {
    console.table(JSON.parse(args));
    const tareasRecibidas = JSON.parse(args);
    estadoTareas = tareasRecibidas;
    helpers_render.renderizarTareas(estadoTareas);

});

/* Cuando ya ha sido eliminada, escuchamos el evento: */
ipcRenderer.on('eliminada', (evento, args) => {
    console.info("eliminada ha sido emitido");
    const tareaEliminada = JSON.parse(args);

    /* filtrar para quitar la tarea eliminada: */
    const tareasModificadas = estadoTareas.filter(tarea => {
        return tarea._id !== tareaEliminada._id;
    });

    /* Actualizar el estado de las tareas, ya que hemos borrado una de ellas. */
    estadoTareas = tareasModificadas;
    /* y renderizar de nuevo las listas ya que han cambiado: */
    helpers_render.renderizarTareas(estadoTareas);
});



/* Cuando ya ha sido editados todos los campos: */
ipcRenderer.on('edicion_finalizada', (evento, args) => {
    const tareaEditada = JSON.parse(args);
    estadoTareas = estadoTareas.map(tarea => {
        if (tarea._id === tareaEditada._id) {
            tarea.nombre = tareaEditada.nombre;
            tarea.descripcion = tareaEditada.descripcion;
        }
        /* retornar las tareas con la tarea modificada dentro. */
        return tarea;

    });
    /* una vez ya actualizado en el front, renderizamos la lista nuevamente. */
    helpers_render.renderizarTareas(estadoTareas);
});