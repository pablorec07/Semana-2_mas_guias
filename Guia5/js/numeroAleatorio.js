const numeroAleatorio = Math.floor(Math.random() * 25) + 1;
const numeroIntentos = 3;
let intentos = 1;

function generarNumeroAleatorio() {
  let mensaje;
  const parrafo = document.querySelector("#idParrafo");

  if (intentos <= numeroIntentos) {
    let numero = prompt("¿Que número se ha generado (Intento " + intentos + ")?");

    if (numero == numeroAleatorio) {
      mensaje = `¡Es sorprente, pudiste adivinar el numero oculto (${numeroAleatorio}).
        Refresque la página para volver a jugar.`;
    } else if (intentos == numeroIntentos) {
      mensaje = `Su numero de intentos ha terminado.
          El numero oculto era: ${numeroAleatorio}. Refresque la página para volver a jugar.`;
    } else {
      // prompt() devuelve texto, así que lo convertimos a número para comparar
      const valor = Number(numero);
      const esValido = numero !== null && numero.trim() !== "" && !isNaN(valor);

      let pista;
      if (!esValido) {
        pista = "Debe ingresar un número válido entre 1 y 25.";
      } else if (valor < numeroAleatorio) {
        pista = `El número que busca es MÁS ALTO que ${valor}.`;
      } else {
        pista = `El número que busca es MÁS BAJO que ${valor}.`;
      }

      mensaje = `Vuelve a intentar. ${pista} Quedan ${numeroIntentos - intentos} intentos`;
    }

    intentos++;
  } else {
    mensaje = `Su numero de intentos ha terminado.
      El numero oculto era: ${numeroAleatorio}. Refresque la página para volver a jugar.`;
  }

  parrafo.innerHTML = mensaje;
}