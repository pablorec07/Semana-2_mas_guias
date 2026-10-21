/* =========================================================
   GESTIÓN DE PEDIDOS DE UNA CAFETERÍA
   Estructura del archivo:
   1. Datos (estado)
   2. Lógica (funciones que procesan datos, NO tocan el HTML)
   3. Vista (funciones que actualizan el HTML)
   4. Eventos (addEventListener)
   ========================================================= */

/* ---------- 1. DATOS ---------- */
// Arreglo de objetos: { producto, precio, cantidad }
const pedidos = [];

// null = sin filtro; un número = solo se muestran precios <= ese valor
let precioMaximo = null;

/* ---------- 2. LÓGICA (sin DOM) ---------- */

// Subtotal de un pedido
const calcularSubtotal = (pedido) => pedido.precio * pedido.cantidad;

// Devuelve un objeto con los errores encontrados (vacío = todo correcto)
function validarPedido({ producto, precio, cantidad }) {
  const errores = {};

  if (producto.trim() === "") {
    errores.producto = "El nombre del producto no puede estar vacío.";
  }
  if (Number.isNaN(precio) || precio <= 0) {
    errores.precio = "El precio debe ser un número mayor que cero.";
  }
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    errores.cantidad = "La cantidad debe ser un número entero positivo.";
  }

  return errores;
}

// filter() devuelve un arreglo NUEVO: el arreglo original no se modifica
const filtrarPorPrecio = (lista, maximo) =>
  lista.filter((pedido) => pedido.precio <= maximo);

// reduce() acumula unidades y monto total
function calcularTotales(lista) {
  const unidades = lista.reduce((acc, pedido) => acc + pedido.cantidad, 0);
  const monto = lista.reduce((acc, pedido) => acc + calcularSubtotal(pedido), 0);
  return { unidades, monto };
}

// Lista que se debe mostrar según el filtro activo
const obtenerPedidosVisibles = () =>
  precioMaximo === null ? pedidos : filtrarPorPrecio(pedidos, precioMaximo);

/* ---------- 3. VISTA (solo DOM) ---------- */
const formPedido = document.querySelector("#formPedido");
const inputProducto = document.querySelector("#inputProducto");
const inputPrecio = document.querySelector("#inputPrecio");
const inputCantidad = document.querySelector("#inputCantidad");
const inputPrecioMax = document.querySelector("#inputPrecioMax");
const tbodyPedidos = document.querySelector("#tbodyPedidos");
const totalUnidades = document.querySelector("#totalUnidades");
const montoTotal = document.querySelector("#montoTotal");
const estadoFiltro = document.querySelector("#estadoFiltro");

const formatearDinero = (valor) => `$${valor.toFixed(2)}`;

// Evita que el texto escrito por el usuario se interprete como HTML
const escaparHTML = (texto) =>
  texto
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

// map() transforma cada pedido en una fila de la tabla
function renderTabla(lista) {
  if (lista.length === 0) {
    tbodyPedidos.innerHTML = `
      <tr><td colspan="4" class="text-center text-muted">No hay pedidos para mostrar.</td></tr>`;
    return;
  }

  tbodyPedidos.innerHTML = lista
    .map(
      (pedido) => `
      <tr>
        <td>${escaparHTML(pedido.producto)}</td>
        <td class="text-end">${formatearDinero(pedido.precio)}</td>
        <td class="text-end">${pedido.cantidad}</td>
        <td class="text-end">${formatearDinero(calcularSubtotal(pedido))}</td>
      </tr>`
    )
    .join("");
}

function renderTotales(lista) {
  const { unidades, monto } = calcularTotales(lista);
  totalUnidades.textContent = unidades;
  montoTotal.textContent = formatearDinero(monto);
}

function renderEstadoFiltro() {
  estadoFiltro.textContent =
    precioMaximo === null
      ? "Mostrando todos los pedidos."
      : `Filtro activo: precio unitario menor o igual a ${formatearDinero(precioMaximo)}.`;
}

// Redibuja todo a partir de los datos (sin recargar la página)
function actualizarVista() {
  const visibles = obtenerPedidosVisibles();
  renderTabla(visibles);
  renderTotales(visibles);
  renderEstadoFiltro();
}

// Muestra u oculta el mensaje de error de un campo (clases de Bootstrap)
function marcarCampo(input, idError, mensaje) {
  const divError = document.querySelector(idError);
  input.classList.toggle("is-invalid", Boolean(mensaje));
  divError.textContent = mensaje || "";
}

function mostrarErrores(errores) {
  marcarCampo(inputProducto, "#errorProducto", errores.producto);
  marcarCampo(inputPrecio, "#errorPrecio", errores.precio);
  marcarCampo(inputCantidad, "#errorCantidad", errores.cantidad);
}

/* ---------- 4. EVENTOS ---------- */

// Agregar pedido (se dispara al presionar el botón "Agregar pedido")
formPedido.addEventListener("submit", (evento) => {
  evento.preventDefault(); // evita recargar la página

  const nuevoPedido = {
    producto: inputProducto.value.trim(),
    precio: Number(inputPrecio.value),
    cantidad: Number(inputCantidad.value),
  };

  const errores = validarPedido(nuevoPedido);
  mostrarErrores(errores);
  if (Object.keys(errores).length > 0) return; // hay errores: no se registra

  pedidos.push(nuevoPedido);
  formPedido.reset();
  inputProducto.focus();
  actualizarVista();
});

// Filtrar productos por precio máximo
document.querySelector("#btnFiltrar").addEventListener("click", () => {
  const valor = Number(inputPrecioMax.value);

  if (inputPrecioMax.value.trim() === "" || Number.isNaN(valor) || valor <= 0) {
    marcarCampo(inputPrecioMax, "#errorPrecioMax", "Ingrese un precio máximo mayor que cero.");
    return;
  }

  marcarCampo(inputPrecioMax, "#errorPrecioMax", "");
  precioMaximo = valor;
  actualizarVista();
});

// Mostrar todos los pedidos otra vez
document.querySelector("#btnMostrarTodos").addEventListener("click", () => {
  precioMaximo = null;
  inputPrecioMax.value = "";
  marcarCampo(inputPrecioMax, "#errorPrecioMax", "");
  actualizarVista();
});

// Vaciar el arreglo y actualizar tabla e indicadores
document.querySelector("#btnLimpiar").addEventListener("click", () => {
  pedidos.length = 0; // vacía el arreglo original
  precioMaximo = null;
  inputPrecioMax.value = "";
  marcarCampo(inputPrecioMax, "#errorPrecioMax", "");
  actualizarVista();
});

// Primera pintada (tabla vacía y totales en cero)
actualizarVista();