/* Código de Electron. */
const { BrowserWindow, ipcMain, app } = require('electron');
/* ipcMain escucha/recibe todos los eventos que vienen desde las ventanas. como el que le envio desde ipcRenderer en app.js */

/* requerir el modelo de tarea para poder guardar, crear, actualizar, borrar datos */
const Tarea = require('./modelos/Tareas.modelos');

/* Crear una instancia de BrowserWindow para crear una ventana nueva. */
function crearVentana() {
    const ventana = new BrowserWindow({
            width: 1200,
            height: 800,
            webPreferences: {
                nodeIntegration: true
            }
        })
        /* Cargar el HTML en la ventana que he creado: */
    ventana.loadFile('src/index.html');
    cargarIpc();
}

function cargarIpc() {

    /* cuando escuche el evento nueva_tarea y cuando escuches puede recibir la informacion del evento y el argumento que envia la ventana - datos/ args*/
    ipcMain.on('nueva_tarea', async(evento, args) => {
        // console.log(args);
        try {
            /* Crear nueva tarea: */
            const nuevaTarea = new Tarea(args);
            /* guardar la tarea en MongoDB: */
            const tareaGuardada = await nuevaTarea.save();
            console.log("=> MONGODB Tarea guardada: ", tareaGuardada);

            /* electron responde desde el proceso principal a través del evento hacia el proceso de la ventana, asi que es posible usar el metodo reply() */
            // podemos enviar a la ventana el nombre de evento y mensaje o objeto que se ha guardado:
            // evento.reply('nueva_tarea_guardada', tareaGuardada);

            //evento.reply('nueva_tarea_guardada', 'la tarea ha sido guardada.');
            /* Enviar el objeto, hay que usar JSON.stringify, ya que da error si se envia el objeto tal cual. */
            evento.reply('nueva_tarea_guardada', JSON.stringify(tareaGuardada));
        } catch (error) {
            console.log(error);
        }

    })

    /* Escuchar el evento de la ventana app.js 'obtener_tareas' */
    ipcMain.on('obtener_tareas', async(evento, args) => {
        /* Hacer consulta a MongoDB con Model.find() */
        const consultaTareas = await Tarea.find();
        /* Imprimir por cmd console todas las tareas: */
        //console.log(consultaTareas);
        /* Enviar tareas al frontend / app.js */
        evento.reply('enviar_tareas', JSON.stringify(consultaTareas));

    })


    /* Escuchar el evento de editar tarea: */
    ipcMain.on('editar_tarea', async(evento, args) => {
        /* usamos {new: true} para que devuelva la Tarea con los nuevos campos ya editados, sin esto devuelve la tarea anterior sin editar. */
        const tareaEditada = await Tarea.findByIdAndUpdate(args.idEditar, { nombre: args.nombre, descripcion: args.descripcion }, { new: true });
        /* Ahora que ya tengo los datos actualizados los enviamos al front: */
        evento.reply('edicion_finalizada', JSON.stringify(tareaEditada));

    })


    /* Escuchar el evento de eliminar tarea: */
    ipcMain.on('eliminar_tarea', async(evento, args) => {
        console.log("eliminar_tarea emitido");
        const tareaEliminada = await Tarea.findByIdAndDelete(args);
        console.log("Se ha eliminado la tarea", tareaEliminada);

        evento.reply('eliminada', JSON.stringify(tareaEliminada));
    })
}

module.exports = { crearVentana, app }