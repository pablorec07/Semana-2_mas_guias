
/* ==========================================
   ACCEDIENDO A LOS ELEMENTOS HTML
========================================== */

const inputNombre = document.getElementById("idTxtNombre");
const inputApellido = document.getElementById("idTxtApellido");
const inputFechaNacimiento = document.getElementById("idTxtFechaNacimiento");
const inputRdMasculino = document.getElementById("idRdMasculino");
const inputRdFemenino = document.getElementById("idRdFemenino");
const inputCmbPais = document.getElementById("idCmbPais");
const inputDireccion = document.getElementById("idTxtDireccion");
const inputNombrePais = document.getElementById("idNombrePais");

// Botones
const buttonAgregarPaciente = document.getElementById("idBtnAgregar");
const buttonLimpiarPaciente = document.getElementById("idBtnLimpiar");
const buttonMostrarPaciente = document.getElementById("idBtnMostrar");
const buttonAgregarPais = document.getElementById("idBtnAddPais");

// Notificaciones Bootstrap
const notificacion = document.getElementById("idNotificacion");
const toast = new bootstrap.Toast(notificacion);
const mensaje = document.getElementById("idMensaje");

// Modal y tabla
const idModal = document.getElementById("idModal");
const tablaPacientes = document.getElementById("idTablaPacientes");


/* ==========================================
   VARIABLES Y ARREGLOS GLOBALES
========================================== */

// Arreglo de pacientes
let arrayPaciente = [];

// Índice del paciente que se está editando
let indiceEdicion = -1;

// Contador de opciones de países
let contadorGlobalOpcion = inputCmbPais.options.length;

// Clave para guardar los pacientes
const clavePacientes = "pacientesFormulario";


/* ==========================================
   LOCALSTORAGE: GUARDAR Y CARGAR PACIENTES
========================================== */

// Guardar los pacientes
const guardarPacientes = () => {

    try {

        localStorage.setItem(
            clavePacientes,
            JSON.stringify(arrayPaciente)
        );

    } catch (error) {

        console.error("Error al guardar los pacientes:", error);

        mensaje.innerHTML = "No se pudieron guardar los pacientes";
        toast.show();
    }
};


// Cargar los pacientes guardados
const cargarPacientes = () => {

    let datosGuardados = localStorage.getItem(clavePacientes);

    if (datosGuardados !== null) {

        try {

            let pacientes = JSON.parse(datosGuardados);

            if (Array.isArray(pacientes)) {
                arrayPaciente = pacientes;
            }

        } catch (error) {

            console.error("Error al cargar los pacientes:", error);
            arrayPaciente = [];
        }
    }
};


/* ==========================================
   FUNCIÓN PARA LIMPIAR EL FORMULARIO
========================================== */

const limpiarForm = () => {

    inputNombre.value = "";
    inputApellido.value = "";
    inputFechaNacimiento.value = "";

    inputRdMasculino.checked = false;
    inputRdFemenino.checked = false;

    inputCmbPais.value = 0;
    inputDireccion.value = "";
    inputNombrePais.value = "";

    // Salimos del modo edición
    indiceEdicion = -1;

    inputNombre.focus();
};


/* ==========================================
   FUNCIÓN PARA REGISTRAR O EDITAR PACIENTES
========================================== */

const addPaciente = function () {

    let nombre = inputNombre.value;
    let apellido = inputApellido.value;
    let fechaNacimiento = inputFechaNacimiento.value;

    let sexo = inputRdMasculino.checked == true
        ? "Hombre"
        : inputRdFemenino.checked == true
            ? "Mujer"
            : "";

    let pais = inputCmbPais.value;

    let labelPais = inputCmbPais.options[
        inputCmbPais.selectedIndex
    ].text;

    let direccion = inputDireccion.value;

    // Validar que todos los campos estén completos
    if (
        nombre != "" &&
        apellido != "" &&
        fechaNacimiento != "" &&
        sexo != "" &&
        pais != 0 &&
        direccion != ""
    ) {

        // Crear el registro del paciente
        let paciente = new Array(
            nombre,
            apellido,
            fechaNacimiento,
            sexo,
            labelPais,
            direccion
        );

        if (indiceEdicion === -1) {

            // Registrar un paciente nuevo
            arrayPaciente.push(paciente);

            mensaje.innerHTML = "Se ha registrado un nuevo paciente";

        } else {

            // Actualizar un paciente existente
            arrayPaciente[indiceEdicion] = paciente;

            mensaje.innerHTML = "Paciente actualizado correctamente";
        }

        // Guardar los cambios
        guardarPacientes();

        // Actualizar la tabla
        imprimirPacientes();

        toast.show();

        // Limpiar el formulario
        limpiarForm();

    } else {

        mensaje.innerHTML = "Faltan campos por completar";
        toast.show();
    }
};


/* ==========================================
   FUNCIÓN PARA IMPRIMIR LAS FILAS
========================================== */

function imprimirFichas() {

    let filas = "";
    let contador = 1;

    arrayPaciente.forEach((element, indice) => {

        filas += `
            <tr>

                <td class="text-center fw-bold">
                    ${contador}
                </td>

                <td>${element[0]}</td>
                <td>${element[1]}</td>
                <td>${element[2]}</td>
                <td>${element[3]}</td>
                <td>${element[4]}</td>
                <td>${element[5]}</td>

                <td>

                    <button
                        type="button"
                        class="btn btn-primary btn-sm"
                        data-accion="editar"
                        data-indice="${indice}">
                        <i class="bi bi-pencil-square"></i>
                    </button>

                    <button
                        type="button"
                        class="btn btn-danger btn-sm"
                        data-accion="eliminar"
                        data-indice="${indice}">
                        <i class="bi bi-trash-fill"></i>
                    </button>

                </td>

            </tr>
        `;

        contador++;
    });

    return filas;
}


/* ==========================================
   FUNCIÓN PARA MOSTRAR LOS PACIENTES
========================================== */

const imprimirPacientes = () => {

    let tabla = `
        <div class="table-responsive">

            <table class="table table-striped table-hover table-bordered">

                <thead>
                    <tr>
                        <th class="text-center" style="width:5%">#</th>
                        <th class="text-center" style="width:15%">Nombres</th>
                        <th class="text-center" style="width:15%">Apellidos</th>
                        <th class="text-center" style="width:15%">Fecha nacimiento</th>
                        <th class="text-center" style="width:10%">Sexo</th>
                        <th class="text-center" style="width:15%">País</th>
                        <th class="text-center" style="width:20%">Dirección</th>
                        <th class="text-center" style="width:10%">Opciones</th>
                    </tr>
                </thead>

                <tbody>
                    ${imprimirFichas()}
                </tbody>

            </table>

        </div>
    `;

    tablaPacientes.innerHTML = tabla;
};


/* ==========================================
   FUNCIÓN PARA EDITAR PACIENTES
========================================== */

function editarPaciente(indice) {

    let paciente = arrayPaciente[indice];

    if (paciente) {

        inputNombre.value = paciente[0];
        inputApellido.value = paciente[1];
        inputFechaNacimiento.value = paciente[2];

        inputRdMasculino.checked = paciente[3] === "Hombre";
        inputRdFemenino.checked = paciente[3] === "Mujer";

        // Buscar el país del paciente
        let opcionPais = Array.from(inputCmbPais.options).find(
            opcion => opcion.text === paciente[4]
        );

        // Si el país ya no está en el select, lo agregamos
        if (!opcionPais) {

            opcionPais = document.createElement("option");
            opcionPais.textContent = paciente[4];
            opcionPais.value = contadorGlobalOpcion++;

            inputCmbPais.appendChild(opcionPais);
        }

        inputCmbPais.value = opcionPais.value;

        inputDireccion.value = paciente[5];

        // Guardar el índice que se está editando
        indiceEdicion = indice;

        mensaje.innerHTML = "Modifique los datos y presione Guardar";
        toast.show();

        inputNombre.focus();
    }
}


/* ==========================================
   FUNCIÓN PARA ELIMINAR PACIENTES
========================================== */

function eliminarPaciente(indice) {

    if (confirm("¿Está seguro de eliminar este paciente?")) {

        // Eliminar paciente del arreglo
        arrayPaciente.splice(indice, 1);

        // Guardar los cambios
        guardarPacientes();

        // Si se estaba editando el paciente eliminado
        if (indiceEdicion === indice) {

            limpiarForm();

        } else if (indiceEdicion > indice) {

            indiceEdicion--;
        }

        // Actualizar la tabla
        imprimirPacientes();

        mensaje.innerHTML = "Paciente eliminado correctamente";
        toast.show();
    }
}


/* ==========================================
   FUNCIÓN PARA AGREGAR PAÍSES
========================================== */

const addPais = () => {

    let paisNew = inputNombrePais.value.trim();

    if (paisNew != "") {

        // Crear una nueva opción
        let option = document.createElement("option");

        option.textContent = paisNew;
        option.value = contadorGlobalOpcion;

        // Agregar la opción al select
        inputCmbPais.appendChild(option);

        contadorGlobalOpcion++;

        mensaje.innerHTML = "País agregado correctamente";
        toast.show();

    } else {

        mensaje.innerHTML = "Faltan campos por completar";
        toast.show();
    }
};


/* ==========================================
   EVENTOS DE LOS BOTONES
========================================== */

buttonLimpiarPaciente.onclick = () => {
    limpiarForm();
};

buttonAgregarPaciente.onclick = () => {
    addPaciente();
};

buttonMostrarPaciente.onclick = () => {
    imprimirPacientes();
};

buttonAgregarPais.onclick = () => {
    addPais();
};


/* ==========================================
   EVENTOS PARA EDITAR Y ELIMINAR
========================================== */

tablaPacientes.addEventListener("click", (e) => {

    let boton = e.target.closest("button[data-accion]");

    if (!boton) return;

    let indice = Number(boton.dataset.indice);

    if (boton.dataset.accion === "editar") {

        editarPaciente(indice);

    } else if (boton.dataset.accion === "eliminar") {

        eliminarPaciente(indice);
    }
});


/* ==========================================
   EVENTO DEL MODAL
========================================== */

idModal.addEventListener("shown.bs.modal", () => {

    inputNombrePais.value = "";
    inputNombrePais.focus();

});


/* ==========================================
   EJECUTAR CUANDO CARGA LA PÁGINA
========================================== */

// Recuperar los pacientes guardados
cargarPacientes();

// Mostrar automáticamente los pacientes
if (arrayPaciente.length > 0) {
    imprimirPacientes();
}

// Limpiar el formulario
limpiarForm();
