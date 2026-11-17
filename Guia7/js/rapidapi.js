// ==========================================
// COMPLEMENTARIO 2: CONSUMO DE RAPIDAPI
// API seleccionada: Free-To-Play Games Database
// ==========================================

const API_HOST = "free-to-play-games-database.p.rapidapi.com";
const API_BASE = `https://${API_HOST}/api`;

const inputApiKey = document.getElementById("idApiKey");
const buttonCargar = document.getElementById("idBtnCargar");
const estadoApi = document.getElementById("idEstadoApi");
const listaJuegos = document.getElementById("idListaJuegos");
const detalleJuego = document.getElementById("idDetalleJuego");
const detalleVacio = document.getElementById("idDetalleVacio");
const cantidadJuegos = document.getElementById("idCantidadJuegos");

let juegos = [];

// Crear encabezados para las solicitudes a RapidAPI
function obtenerEncabezados() {
    return {
        "x-rapidapi-key": inputApiKey.value.trim(),
        "x-rapidapi-host": API_HOST
    };
}

// Limpiar un contenedor usando metodos DOM
function limpiarContenedor(contenedor) {
    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }
}

// Mostrar mensajes de estado
function mostrarEstado(texto, tipo = "info") {
    limpiarContenedor(estadoApi);
    const alerta = document.createElement("div");
    alerta.className = `alert alert-${tipo} mb-0`;
    alerta.textContent = texto;
    estadoApi.appendChild(alerta);
}

// Crear una tarjeta para cada videojuego
function crearTarjetaJuego(juego) {
    const columna = document.createElement("div");
    columna.className = "col-md-6";

    const tarjeta = document.createElement("div");
    tarjeta.className = "card h-100 shadow-sm";

    const imagen = document.createElement("img");
    imagen.className = "card-img-top";
    imagen.src = juego.thumbnail || "";
    imagen.alt = `Imagen de ${juego.title || "videojuego"}`;
    imagen.loading = "lazy";

    const cuerpo = document.createElement("div");
    cuerpo.className = "card-body d-flex flex-column";

    const titulo = document.createElement("h3");
    titulo.className = "h6 card-title fw-bold";
    titulo.textContent = juego.title || "Videojuego sin título";

    const descripcion = document.createElement("p");
    descripcion.className = "card-text small text-muted flex-grow-1";
    descripcion.textContent = juego.short_description || "Sin descripción disponible.";

    const categoria = document.createElement("p");
    categoria.className = "small mb-3";
    categoria.textContent = `${juego.genre || "Categoría no disponible"} · ${juego.platform || "Plataforma no disponible"}`;

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "btn btn-primary btn-sm mt-auto";
    boton.textContent = "Ver detalles";
    boton.dataset.id = juego.id;
    boton.addEventListener("click", () => consultarDetalle(juego.id));

    if (juego.thumbnail) {
        tarjeta.appendChild(imagen);
    }
    cuerpo.appendChild(titulo);
    cuerpo.appendChild(descripcion);
    cuerpo.appendChild(categoria);
    cuerpo.appendChild(boton);
    tarjeta.appendChild(cuerpo);
    columna.appendChild(tarjeta);

    return columna;
}

// Endpoint 1: obtener el listado de videojuegos
async function cargarJuegos() {
    const apiKey = inputApiKey.value.trim();

    if (apiKey === "") {
        mostrarEstado("Primero ingrese su clave personal de RapidAPI.", "warning");
        inputApiKey.focus();
        return;
    }

    mostrarEstado("Cargando listado de videojuegos...", "info");
    limpiarContenedor(listaJuegos);
    limpiarContenedor(detalleJuego);
    detalleVacio.hidden = false;
    detalleVacio.textContent = "Seleccione un juego del listado para consultar su información.";
    cantidadJuegos.textContent = "Cargando...";

    try {
        const respuesta = await fetch(`${API_BASE}/games?sort-by=popularity`, {
            method: "GET",
            headers: obtenerEncabezados()
        });

        if (!respuesta.ok) {
            throw new Error(`La API respondió con estado ${respuesta.status}. Verifique la clave y la suscripción.`);
        }

        const datos = await respuesta.json();
        if (!Array.isArray(datos)) {
            throw new Error("La respuesta de la API no contiene un listado válido.");
        }

        juegos = datos.slice(0, 20);
        if (juegos.length === 0) {
            mostrarEstado("La API no devolvió videojuegos para mostrar.", "warning");
            cantidadJuegos.textContent = "0 juegos";
            return;
        }

        juegos.forEach((juego) => {
            listaJuegos.appendChild(crearTarjetaJuego(juego));
        });

        cantidadJuegos.textContent = `${juegos.length} juegos`;
        mostrarEstado("Listado cargado correctamente. Seleccione un videojuego para consultar sus detalles.", "success");

    } catch (error) {
        cantidadJuegos.textContent = "Sin datos";
        mostrarEstado(`No fue posible cargar los videojuegos. ${error.message}`, "danger");
        console.error("Error al cargar videojuegos:", error);
    }
}

// Endpoint 2: consultar el detalle de un videojuego seleccionado
async function consultarDetalle(id) {
    mostrarEstado("Cargando los detalles del videojuego...", "info");
    limpiarContenedor(detalleJuego);
    detalleVacio.hidden = true;

    try {
        const respuesta = await fetch(`${API_BASE}/game?id=${encodeURIComponent(id)}`, {
            method: "GET",
            headers: obtenerEncabezados()
        });

        if (!respuesta.ok) {
            throw new Error(`La API respondió con estado ${respuesta.status}.`);
        }

        const juego = await respuesta.json();
        mostrarDetalle(juego);
        mostrarEstado("Detalle cargado correctamente.", "success");

    } catch (error) {
        detalleVacio.hidden = false;
        detalleVacio.textContent = "No se pudo cargar el detalle. Intente nuevamente.";
        mostrarEstado(`Error al consultar el detalle. ${error.message}`, "danger");
        console.error("Error al consultar detalle:", error);
    }
}

// Mostrar la información del videojuego en la interfaz
function mostrarDetalle(juego) {
    limpiarContenedor(detalleJuego);

    const titulo = document.createElement("h3");
    titulo.className = "h5 fw-bold";
    titulo.textContent = juego.title || "Detalle del videojuego";
    detalleJuego.appendChild(titulo);

    if (juego.thumbnail) {
        const imagen = document.createElement("img");
        imagen.src = juego.thumbnail;
        imagen.alt = `Imagen de ${juego.title || "videojuego"}`;
        imagen.className = "img-fluid rounded mb-3";
        detalleJuego.appendChild(imagen);
    }

    const campos = [
        ["Descripción", juego.description || juego.short_description],
        ["Género", juego.genre],
        ["Plataforma", juego.platform],
        ["Desarrollador", juego.developer],
        ["Publicador", juego.publisher],
        ["Fecha de lanzamiento", juego.release_date],
        ["Estado", juego.status]
    ];

    const lista = document.createElement("dl");
    campos.forEach(([etiqueta, valor]) => {
        if (valor) {
            const termino = document.createElement("dt");
            termino.textContent = etiqueta;
            const descripcion = document.createElement("dd");
            descripcion.className = "mb-2";
            descripcion.textContent = valor;
            lista.appendChild(termino);
            lista.appendChild(descripcion);
        }
    });
    detalleJuego.appendChild(lista);

    if (juego.game_url) {
        const enlace = document.createElement("a");
        enlace.href = juego.game_url;
        enlace.target = "_blank";
        enlace.rel = "noopener noreferrer";
        enlace.className = "btn btn-outline-primary btn-sm";
        enlace.textContent = "Abrir sitio del videojuego";
        detalleJuego.appendChild(enlace);
    }
}

buttonCargar.addEventListener("click", cargarJuegos);
