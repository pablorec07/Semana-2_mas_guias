
// ==========================================
// ACCEDIENDO A LOS ELEMENTOS HTML
// ==========================================

const formulario = document.getElementById("formEstudiante");

const inputCarnet = document.getElementById("inputCarnet");
const inputNombre = document.getElementById("inputNombre");
const inputDui = document.getElementById("inputDui");
const inputNit = document.getElementById("inputNit");
const inputFecha = document.getElementById("inputFecha");
const inputCorreo = document.getElementById("inputCorreo");
const inputEdad = document.getElementById("inputEdad");

const resultado = document.getElementById("resultado");


// ==========================================
// EXPRESIONES REGULARES
// ==========================================

// Dos letras y tres números
const regexCarnet = /^[A-Za-z]{2}\d{3}$/;

// Nombre completo, solamente letras y espacios
const regexNombre = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:\s+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)+$/;

// DUI: ocho números, guion y un número
const regexDui = /^\d{8}-\d$/;

// NIT: cuatro, seis, tres y un número
const regexNit = /^\d{4}-\d{6}-\d{3}-\d$/;

// Fecha: día/mes/año
const regexFecha = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

// Correo electrónico
const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Edad: solamente números
const regexEdad = /^\d+$/;


// ==========================================
// FUNCIÓN PARA VALIDAR LA FECHA
// ==========================================

function fechaValida(fecha) {

    if (!regexFecha.test(fecha)) {
        return false;
    }

    let partes = fecha.split("/");

    let dia = Number(partes[0]);
    let mes = Number(partes[1]);
    let anio = Number(partes[2]);

    // Comprobar si el año es bisiesto
    let bisiesto =
        anio % 4 === 0 &&
        (anio % 100 !== 0 || anio % 400 === 0);

    let diasPorMes = [
        31,
        bisiesto ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    ];

    return anio > 0 && dia <= diasPorMes[mes - 1];
}


// ==========================================
// FUNCIÓN GENERAL PARA VALIDAR CAMPOS
// ==========================================

function validarCampo(input, idError, expresion, mensajeError, validacionExtra = true) {

    let valor = input.value.trim();

    let valido = expresion.test(valor) && validacionExtra;

    let error = document.getElementById(idError);

    if (valido) {

        input.classList.remove("is-invalid");
        input.classList.add("is-valid");

        error.textContent = "";

    } else {

        input.classList.remove("is-valid");
        input.classList.add("is-invalid");

        error.textContent = mensajeError;
    }

    return valido;
}


// ==========================================
// EVENTO PARA VALIDAR EL FORMULARIO
// ==========================================

formulario.addEventListener("submit", (e) => {

    e.preventDefault();

    // Validar carnet
    let carnetValido = validarCampo(
        inputCarnet,
        "errorCarnet",
        regexCarnet,
        "El carnet debe tener dos letras y tres números. Ejemplo: AB001"
    );

    // Validar nombre
    let nombreValido = validarCampo(
        inputNombre,
        "errorNombre",
        regexNombre,
        "Ingrese nombre y apellido utilizando solamente letras y espacios."
    );

    // Validar DUI
    let duiValido = validarCampo(
        inputDui,
        "errorDui",
        regexDui,
        "El DUI debe tener el formato ########-#."
    );

    // Validar NIT
    let nitValido = validarCampo(
        inputNit,
        "errorNit",
        regexNit,
        "El NIT debe tener el formato ####-######-###-#."
    );

    // Validar fecha de nacimiento
    let fechaValido = validarCampo(
        inputFecha,
        "errorFecha",
        regexFecha,
        "Ingrese una fecha válida en formato DD/MM/AAAA.",
        fechaValida(inputFecha.value.trim())
    );

    // Validar correo
    let correoValido = validarCampo(
        inputCorreo,
        "errorCorreo",
        regexCorreo,
        "Ingrese un correo electrónico válido."
    );

    // Validar edad
    let edadValido = validarCampo(
        inputEdad,
        "errorEdad",
        regexEdad,
        "La edad debe contener solamente números."
    );

    // Comprobar todos los resultados
    let formularioValido =
        carnetValido &&
        nombreValido &&
        duiValido &&
        nitValido &&
        fechaValido &&
        correoValido &&
        edadValido;

    if (formularioValido) {

        resultado.innerHTML = `
            <div class="alert alert-success">
                <strong>¡Validación correcta!</strong>
                Todos los datos cumplen con los formatos solicitados.
            </div>
        `;

    } else {

        resultado.innerHTML = `
            <div class="alert alert-danger">
                <strong>Atención:</strong>
                Hay campos que necesitan corrección. Revisa los mensajes.
            </div>
        `;
    }

});


// ==========================================
// EVENTO PARA LIMPIAR LAS VALIDACIONES
// ==========================================

formulario.addEventListener("reset", () => {

    setTimeout(() => {

        let campos = [
            inputCarnet,
            inputNombre,
            inputDui,
            inputNit,
            inputFecha,
            inputCorreo,
            inputEdad
        ];

        campos.forEach((campo) => {

            campo.classList.remove("is-valid");
            campo.classList.remove("is-invalid");

        });

        document.querySelectorAll(".invalid-feedback").forEach((error) => {
            error.textContent = "";
        });

        resultado.innerHTML = "";

    }, 0);

});
