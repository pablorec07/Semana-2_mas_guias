// ==========================================
// EJEMPLO 3: RECORRIENDO UN FORMULARIO CON DOM
// COMPLEMENTARIO 1: VALIDACION Y TABLA EN MODAL
// ==========================================

// Obteniendo la referencia de los elementos por medio de arreglos asociativos
const formulario = document.forms["frmRegistro"];
const button = document.forms["frmRegistro"].elements["btnRegistro"];

// Creando modal con Bootstrap
const modal = new bootstrap.Modal(document.getElementById("idModal"), {});

// Obteniendo la referencia del cuerpo del modal
const bodyModal = document.getElementById("idBodyModal");
const resultadoValidacion = document.getElementById("idResultadoValidacion");

// ==========================================
// FUNCION AUXILIAR PARA LIMPIAR NODOS
// ==========================================
function limpiarNodos(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}

// ==========================================
// VALIDACIONES DEL FORMULARIO
// ==========================================
function validarFormulario() {
    let errores = [];

    const nombre = document.getElementById("idNombre").value.trim();
    const apellidos = document.getElementById("idApellidos").value.trim();
    const fechaNacimiento = document.getElementById("idFechaNac").value;
    const correo = document.getElementById("idCorreo").value.trim();
    const password = document.getElementById("idPassword").value;
    const repetirPassword = document.getElementById("idPasswordRepetir").value;
    const archivo = document.getElementById("idArchivo");
    const pais = document.getElementById("idCmPais");

    // a. Validar que los campos no esten vacios
    if (nombre === "") errores.push("Debe ingresar los nombres.");
    if (apellidos === "") errores.push("Debe ingresar los apellidos.");
    if (fechaNacimiento === "") errores.push("Debe ingresar la fecha de nacimiento.");
    if (correo === "") errores.push("Debe ingresar el correo electronico.");
    if (password === "") errores.push("Debe ingresar una contraseña.");
    if (repetirPassword === "") errores.push("Debe repetir la contraseña.");
    if (archivo.files.length === 0) errores.push("Debe seleccionar una imagen de avatar.");

    // b. Validar que la fecha de nacimiento no supere la fecha actual
    if (fechaNacimiento !== "") {
        const fechaIngresada = new Date(`${fechaNacimiento}T00:00:00`);
        const fechaActual = new Date();
        fechaActual.setHours(0, 0, 0, 0);

        if (Number.isNaN(fechaIngresada.getTime()) || fechaIngresada > fechaActual) {
            errores.push("La fecha de nacimiento no puede ser posterior a la fecha actual.");
        }
    }

    // c. Validar el correo electronico mediante expresion regular
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (correo !== "" && !regexCorreo.test(correo)) {
        errores.push("El correo electronico no tiene un formato valido.");
    }

    // d. Validar que las contraseñas sean iguales
    if (password !== "" && repetirPassword !== "" && password !== repetirPassword) {
        errores.push("Las contraseñas no coinciden.");
    }

    // e. Verificar que se seleccione al menos un interes
    const intereses = [
        document.getElementById("idCkProgramacion"),
        document.getElementById("idCkBD"),
        document.getElementById("idCkRedes"),
        document.getElementById("idCkSeguridad")
    ];
    const interesesSeleccionados = intereses.filter((interes) => interes.checked);

    if (interesesSeleccionados.length === 0) {
        errores.push("Debe seleccionar al menos un interes.");
    }

    // f. Verificar que se seleccione una carrera
    const carreraSeleccionada = document.querySelector('input[name="idRdCarrera"]:checked');
    if (!carreraSeleccionada) {
        errores.push("Debe seleccionar una carrera.");
    }

    // g. Verificar que se seleccione un pais de origen
    if (pais.value === "" || pais.selectedIndex === 0) {
        errores.push("Debe seleccionar un pais de origen.");
    }

    return {
        valido: errores.length === 0,
        errores: errores,
        interesesSeleccionados: interesesSeleccionados,
        carreraSeleccionada: carreraSeleccionada
    };
}

// ==========================================
// EJEMPLO 3: RECORRER Y CONTAR ELEMENTOS
// ==========================================
const recorrerFormulario = function () {
    let totText = 0;
    let totRadio = 0;
    let totCheck = 0;
    let totDate = 0;
    let totSelect = 0;
    let totFile = 0;
    let totPass = 0;
    let totEmail = 0;

    // Recorriendo elementos del formulario
    let elementos = formulario.elements;
    let totalElementos = elementos.length;

    for (let index = 0; index < totalElementos; index++) {
        // Accediendo a cada hijo del formulario
        let elemento = elementos[index];
        let tipoElemento = elemento.type;
        let tipoNode = elemento.nodeName;

        // Contabilizando el total de INPUT TYPE = TEXT
        if (tipoElemento === "text" && tipoNode === "INPUT") {
            console.log(elemento);
            totText++;
        }
        // Contabilizando el total de INPUT TYPE = PASSWORD
        else if (tipoElemento === "password" && tipoNode === "INPUT") {
            console.log(elemento);
            totPass++;
        }
        // Contabilizando el total de INPUT TYPE = EMAIL
        else if (tipoElemento === "email" && tipoNode === "INPUT") {
            console.log(elemento);
            totEmail++;
        }
        // Contabilizando el total de INPUT TYPE = RADIO
        else if (tipoElemento === "radio" && tipoNode === "INPUT") {
            console.log(elemento);
            totRadio++;
        }
        // Contabilizando el total de INPUT TYPE = CHECKBOX
        else if (tipoElemento === "checkbox" && tipoNode === "INPUT") {
            console.log(elemento);
            totCheck++;
        }
        // Contabilizando el total de INPUT TYPE = FILE
        else if (tipoElemento === "file" && tipoNode === "INPUT") {
            console.log(elemento);
            totFile++;
        }
        // Contabilizando el total de INPUT TYPE = DATE
        else if (tipoElemento === "date" && tipoNode === "INPUT") {
            console.log(elemento);
            totDate++;
        }
        // Contabilizando el total de SELECT
        else if (tipoNode === "SELECT") {
            console.log(elemento);
            totSelect++;
        }
    }

    return {
        totText,
        totPass,
        totRadio,
        totCheck,
        totDate,
        totEmail,
        totSelect,
        totFile
    };
};

// ==========================================
// FUNCIONES DOM PARA CREAR LA TABLA
// NO SE UTILIZA innerHTML
// ==========================================
function agregarCelda(fila, etiqueta, texto, esEncabezado = false) {
    const celda = document.createElement(esEncabezado ? "th" : "td");
    celda.textContent = texto;
    fila.appendChild(celda);
}

function agregarFilaTabla(cuerpo, etiqueta, valor) {
    const fila = document.createElement("tr");
    agregarCelda(fila, "th", etiqueta, true);
    agregarCelda(fila, "td", valor, false);
    cuerpo.appendChild(fila);
}

function crearTablaDatos(datos) {
    const tabla = document.createElement("table");
    tabla.setAttribute("class", "table table-bordered table-striped align-middle");

    const cuerpo = document.createElement("tbody");

    agregarFilaTabla(cuerpo, "Nombres", datos.nombre);
    agregarFilaTabla(cuerpo, "Apellidos", datos.apellidos);
    agregarFilaTabla(cuerpo, "Fecha de nacimiento", datos.fechaNacimiento);
    agregarFilaTabla(cuerpo, "Correo electronico", datos.correo);
    agregarFilaTabla(cuerpo, "Contraseña", "Oculta por seguridad");
    agregarFilaTabla(cuerpo, "Intereses", datos.intereses);
    agregarFilaTabla(cuerpo, "Carrera", datos.carrera);
    agregarFilaTabla(cuerpo, "Pais de origen", datos.pais);
    agregarFilaTabla(cuerpo, "Imagen de avatar", datos.avatar);

    tabla.appendChild(cuerpo);
    return tabla;
}

function crearResumenControles(conteo) {
    const contenedor = document.createElement("div");
    const titulo = document.createElement("h6");
    titulo.setAttribute("class", "mt-4 mb-2 fw-bold");
    titulo.textContent = "Resumen de controles del formulario";
    contenedor.appendChild(titulo);

    const lista = document.createElement("ul");
    lista.setAttribute("class", "mb-0");

    const resumen = [
        [`Total de input[type="text"]`, conteo.totText],
        [`Total de input[type="password"]`, conteo.totPass],
        [`Total de input[type="radio"]`, conteo.totRadio],
        [`Total de input[type="checkbox"]`, conteo.totCheck],
        [`Total de input[type="date"]`, conteo.totDate],
        [`Total de input[type="email"]`, conteo.totEmail],
        [`Total de select`, conteo.totSelect],
        [`Total de input[type="file"]`, conteo.totFile]
    ];

    resumen.forEach(([etiqueta, cantidad]) => {
        const item = document.createElement("li");
        item.textContent = `${etiqueta}: ${cantidad}`;
        lista.appendChild(item);
    });

    contenedor.appendChild(lista);
    return contenedor;
}

// ==========================================
// MOSTRAR ERRORES MEDIANTE FUNCIONES DOM
// ==========================================
function mostrarErrores(errores) {
    limpiarNodos(resultadoValidacion);

    const alerta = document.createElement("div");
    alerta.setAttribute("class", "alert alert-danger");

    const titulo = document.createElement("strong");
    titulo.textContent = "Revise la siguiente informacion:";
    alerta.appendChild(titulo);

    const lista = document.createElement("ul");
    lista.setAttribute("class", "mb-0 mt-2");

    errores.forEach((texto) => {
        const item = document.createElement("li");
        item.textContent = texto;
        lista.appendChild(item);
    });

    alerta.appendChild(lista);
    resultadoValidacion.appendChild(alerta);
}

// ==========================================
// MOSTRAR LA INFORMACION VALIDADA EN EL MODAL
// ==========================================
function mostrarInformacion() {
    limpiarNodos(bodyModal);

    const nombre = document.getElementById("idNombre").value.trim();
    const apellidos = document.getElementById("idApellidos").value.trim();
    const fechaNacimiento = document.getElementById("idFechaNac").value;
    const correo = document.getElementById("idCorreo").value.trim();
    const password = document.getElementById("idPassword").value;
    const repetirPassword = document.getElementById("idPasswordRepetir").value;
    const archivo = document.getElementById("idArchivo");
    const pais = document.getElementById("idCmPais");

    const interesesSeleccionados = [
        ["idCkProgramacion", "Programacion"],
        ["idCkBD", "Base de Datos"],
        ["idCkRedes", "Inteligencia artificial"],
        ["idCkSeguridad", "Seguridad informatica"]
    ].filter(([id]) => document.getElementById(id).checked)
     .map(([, nombre]) => nombre)
     .join(", ");

    const carrera = document.querySelector('input[name="idRdCarrera"]:checked');
    const etiquetaCarrera = document.querySelector(`label[for="${carrera.id}"]`);
    const nombreCarrera = etiquetaCarrera ? etiquetaCarrera.textContent.trim() : "";

    const datos = {
        nombre,
        apellidos,
        fechaNacimiento,
        correo,
        intereses: interesesSeleccionados,
        carrera: nombreCarrera,
        pais: pais.options[pais.selectedIndex].text,
        avatar: archivo.files[0].name,
        password,
        repetirPassword
    };

    const titulo = document.createElement("h6");
    titulo.setAttribute("class", "fw-bold mb-3");
    titulo.textContent = "Datos del estudiante";
    bodyModal.appendChild(titulo);

    bodyModal.appendChild(crearTablaDatos(datos));

    const estadoPassword = document.createElement("p");
    estadoPassword.setAttribute("class", "small text-success mb-0");
    estadoPassword.textContent = "Confirmacion de contraseña: correcta";
    bodyModal.appendChild(estadoPassword);

    bodyModal.appendChild(crearResumenControles(recorrerFormulario()));

    modal.show();
}

// ==========================================
// EVENTO DEL BOTON DE REGISTRO
// ==========================================
button.onclick = () => {
    const validacion = validarFormulario();

    if (validacion.valido) {
        limpiarNodos(resultadoValidacion);
        mostrarInformacion();
    } else {
        mostrarErrores(validacion.errores);
    }
};
