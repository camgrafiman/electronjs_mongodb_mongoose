const { ipcRenderer } = require("electron");

const helpers_render = {
    renderizarTareas: (arrTareas) => {
        const tareasContenedor = document.getElementById('tareasContainer');
        tareasContenedor.innerHTML = '';
        /* iterar sobre el arreglo de tareas */
        arrTareas.map(tarea => {
            tareasContenedor.innerHTML += `
            <li>
                <h5>ID: ${tarea._id}</h5>
                <h4>Nombre tarea: ${tarea.nombre}</h4>
                <p>Descripción: ${tarea.descripcion}</p> 
                <span>
                    <button onclick="helpers_render.editarTarea('${tarea._id}')" class="editar">Editar</button>
                    <button onclick="helpers_render.eliminarTarea('${tarea._id}')" class="eliminar">Eliminar</button>
                </span>    
            </li>
            `;
        })
    },
    editarTarea: (id) => {
        estadoEditar = true;
        idEditar = id;
        // console.log("Editar: ", e.target.value);
        console.log("editar!", id);

        /* Datos para actualizar: */
        const datosTareaSeleccionada = estadoTareas.find(tarea => {
            return tarea._id === id;
        })
        formulario_nombre.value = datosTareaSeleccionada.nombre;
        formulario_descripcion.value = datosTareaSeleccionada.descripcion;

    },
    eliminarTarea: (id) => {
        const quiereEliminar = confirm("Quiere eliminar esta tarea?");
        if (quiereEliminar) {
            console.log("Eliminar : ", id);

            /* emitir evento de eliminar y enviar id como argumento. */
            ipcRenderer.send('eliminar_tarea', id);
        }
        return;
    }
}



module.exports = { helpers_render };