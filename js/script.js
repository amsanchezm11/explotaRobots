// Creamos la clase Carta
class Carta {
    constructor() {
        this.tipo = "";
        this.puntos = 0;
        this.img = "";
    }
}   // CLASE CARTA

// Creamos la clase jugador
class Jugador {
    constructor(nombre, turno) {
        this.nombre = nombre;
        this.cartasJugador = [];
        this.eliminado = false;
        this.turno = turno;
        this.puntosTotales = 0;
        //this.puntosTotales=0;
    }

    // Contar cartas

    contarCartas() {
        return this.cartasJugador.length;
    }

    addCarta(carta) {
        this.cartasJugador.push(carta);
    }

    // Eliminar carta
    eliminarCarta(carta) {
        this.cartasJugador.splice(this.cartasJugador.indexOf(carta), 1);
    }

    // Numero de Salta Turno
    contarSaltaTurno() {

        let cartasSalto = this.cartasJugador.filter(saltarTurno);

        function saltarTurno(carta) {
            return carta.tipo == "Saltar";
        }

        return cartasSalto.length;
    }

    contarDesactivacion() {

        let cartasDesactivacion = this.cartasJugador.filter(desactivacion);

        function desactivacion(carta) {
            return carta.tipo == "Desactivacion";
        }

        return cartasDesactivacion.length;
    }

}   // CLASE JUGADOR


class Baraja {
    constructor() {
        this.cartas = [];
    }

    iniciar() {

        if (this.cartas.length < 61) {

            //  Creación cartas explosivas
            for (let i = 0; i <= 5; i++) {
                let carta = new Object();
                carta.tipo = "Explosiva";
                carta.puntos = 0;
                carta.img = `./img/bomba/bomba.png`;

                this.cartas.push(carta);
            }

            // Creación cartas desactivación
            for (let i = 0; i <= 5; i++) {
                let carta = new Object();
                carta.tipo = "Desactivacion";
                carta.puntos = 0;
                carta.img = `./img/herramienta/herramienta.png`;
                this.cartas.push(carta);
            }

            // Creación cartas de salto turno
            for (let i = 0; i <= 9; i++) {
                let carta = new Object();
                carta.tipo = "Saltar";
                carta.puntos = 0;
                carta.img = `./img/pasarTurno/pasarTurno.png`;
                this.cartas.push(carta);
            }

            // Creación cartas de puntos
            for (let i = 0; i <= 37; i++) {
                let carta = new Object();
                // Creamos numero aleatorio
                let aleatorio = Math.random();
                let numero = Math.floor(aleatorio * (11));

                if (numero == 0) { numero = 1; }

                carta.tipo = "Puntos";
                carta.puntos = numero;
                carta.img = getRandomPathImg();
                this.cartas.push(carta);
            }

        }
    }

    // Método barajar cartas
    barajar() {
        for (let i = this.cartas.length - 1; i > 0; i--) {
            let numero = Math.floor(Math.random() * (i + 1));

            [this.cartas[i], this.cartas[numero]] = [this.cartas[numero], this.cartas[i]]
        }
    }
    // Método eliminar carta
    eliminarCarta(carta) {
        this.cartas.splice(this.cartas.indexOf(carta), 1);
    }
}   // CLASE BARAJA

// Instanciamos Baraja
let barajaNueva = new Baraja();

// Iniciamos la baraja 
barajaNueva.iniciar();

// Barajamos el mazo de cartas
barajaNueva.barajar();

// Instanciamos jugador1, jugador2 y jugador3
let jugador1 = new Jugador("Pepe", true);
let jugador2 = new Jugador("Juan", false);
let jugador3 = new Jugador("Borja", false);

// Los añadimos a un array
let jugadores = [jugador1, jugador2, jugador3];

// Seleccionamos los nombres de los jugadores
let turnoPlayer1 = document.getElementById("h2-jugador1");
let turnoPlayer2 = document.getElementById("h2-jugador2");
let turnoPlayer3 = document.getElementById("h2-jugador3");

turnoPlayer1.innerHTML = jugador1.nombre;
turnoPlayer2.innerHTML = jugador2.nombre;
turnoPlayer3.innerHTML = jugador3.nombre;

// Turnos de la partida
let turno = 0;

// Lista de cartas descartadas
let pilaDescartes = [];

//  Funcion Generar Imagen Aleatoria
//  Funcion que devuelve el path de una imagen de robot de manera aleatoria
function getRandomPathImg() {
    let random = Math.floor(Math.random() * 20) + 1;
    if (random < 10) {
        return `./img/card/robot_0${random}.png`;
    }
    return `./img/card/robot_${random}.png`;

}// Fin Funcion Generar Imagen Aleatoria

// Boton Robar
let boton = document.getElementById("btnRobar");
boton.addEventListener("click", robarCarta);

// Boton Pasar Turno
let botonPasar = document.getElementById("btnPasar");
botonPasar.addEventListener("click", pasarTurnoBoton);
botonPasar.setAttribute("class", "oculto");

// Funcion Pasar Turno con Boton
function pasarTurnoBoton() {
    let jugador = null;

    for (let i = 0; i < jugadores.length; i++) {
        if (jugadores[i].turno == true && jugadores[i].eliminado==false) {
            jugador = jugadores[i];
        }
    }

    let cartaJuga = jugador.cartasJugador.find(
        (carta) => carta.tipo === "Saltar");
    let indiceCarta = jugador.cartasJugador.indexOf(cartaJuga); // Indice para eliminar carta
    let cartaDescarte = jugador.cartasJugador[indiceCarta];     // Copia para llevar al descarte
 
    pilaDescartes.push(cartaDescarte);              // Añadimos la carta a la pila de descartes
    jugador.eliminarCarta(cartaDescarte);           // Eliminamos la carta del jugador
    pintarDescartes();
    estadisticas(jugador);                          // Actualizamos los valores
    pasarTurno();                                   // Pasamos el turno
    pintarJugador();                                // Pintamos al jugador siguiente

    // Busco al siguiente jugador con el turno activo y que no esté eliminado
    let jugadorSiguiente = null;

    for (let i = 0; i < jugadores.length; i++) {
        if (jugadores[i].turno == true && jugadores[i].eliminado==false) {
            jugadorSiguiente = jugadores[i];
        }
    }

    // Mostramos o no el boton al siguiente jugador activo no eliminado
    mostrarBotonSaltar(jugadorSiguiente);

}   // Fin Funcion Pasar Turno con Boton

// Funcion Robar Carta
function robarCarta() {

    // 1 - Seleccionamos el jugador con el turno activo
    let jugador;
    for (let i = 0; i < jugadores.length; i++) {

        if (jugadores[i].turno == true) {
            jugador = jugadores[i];
        }
    }

    // 2 - Robamos la carta de la baraja

    let cartaRobada = barajaNueva.cartas[barajaNueva.cartas.length - 1];

    // 3 - Añadimos la carta al jugador

    jugador.addCarta(cartaRobada);

    // 3.1 - Borramos la carta de la baraja principal

    barajaNueva.eliminarCarta(cartaRobada);

    // 4 - Pintamos la carta

    let imagenCarta = document.getElementById("imgCartaRobada");
    imagenCarta.setAttribute("src", `${cartaRobada.img}`);

    // 5 - Avaluamos si la carta es una bomba

    if (cartaRobada.tipo === "Explosiva") {

        if (jugador.contarDesactivacion() > 0) {

            let cartaDesactivar = jugador.cartasJugador.find(carta => carta.tipo === "Desactivacion");

            jugador.eliminarCarta(cartaRobada);     // 1.1 Eliminamos la carta bomba del jugador
            jugador.eliminarCarta(cartaDesactivar); // 1.2 Eliminamos la carta desactivar del jugador
            pilaDescartes.push(cartaRobada);        // 2.1 Carta bomba añadida a descartes
            pilaDescartes.push(cartaDesactivar);    // 2.2 Carta desactivar añadida a descartes
            estadisticas(jugador);                  // 3.1 Actualizamos los valores del jugador
        } else {
            jugador.eliminado = true;   // Jugador eliminado - Actualizamos sus valores                
            jugador.puntosTotales = 0;  // Pasariamos el turno al jugador siguiente                
            pilaDescartes = pilaDescartes.concat(jugador.cartasJugador);  // Añadimos todas sus cartas a la pila de descartes
            jugador.cartasJugador = [];   // Vaciamos la baraja del jugador               
            estadisticas(jugador);  // Actualizamos los valores del jugador          
        }

    } else {
        jugador.puntosTotales += cartaRobada.puntos;
        estadisticas(jugador);  // Actualizamos los valores del jugador
    }

    // 6 - ¿Hay algun ganador?

    let eliminados = 0;         // Contador de jugadores eliminados
    let jugadorGanador = null;  // Unico jugador con eliminado = false

    // Recorro la lista de jugadores para comprobar cuantos jugadores eliminados hay
    for (let i = 0; i < jugadores.length; i++) {
        let jugador = jugadores[i];
        if (jugador.eliminado == true) {
            eliminados++;
        } else {
            jugadorGanador = jugador;
        }

    }

    // Compruebo si hay un ganador
    // Condicion 1 --> Si hay 2 jugadores eliminados el jugador no eliminado es el vencedor
    // Condicion 2 --> Si la baraja del juego está a 0, el jugador con más puntos es el vencedor
    if (eliminados == 2) {
        //alert("Se acabó la partida! El ganador es " + jugadorGanador.nombre + "!!");

        mensajeGanadorEliminado(jugadorGanador);
        cambiarBotones();
    } else if (barajaNueva.cartas.length == 0) {

        alert("Se acabó la partida! El ganador es " + jugadorMaxPuntos.nombre + " con " + jugadorMaxPuntos.puntosTotales + " puntos!!");
        //mensajeGanadorPuntos(jugadores); // Descartado porque no me toma los valores bien
        cambiarBotones();
    } else {
        pasarTurno();       // Pasar turno
        pintarJugador();    // Pintamos al Jugador siguiente

        // Recorro la lista de jugadores para obtener el siguiente jugador
        // que esté activo y no eliminado para mostrar el botón de saltar turno
        let jugadorSiguiente = null;

        for (let i = 0; i < jugadores.length; i++) {
            if (jugadores[i].turno == true && jugadores[i].eliminado==false) {
                jugadorSiguiente = jugadores[i];
            }
        }

         // Mostramos o no el boton al siguiente jugador en caso de que tenga o no carta
         // de saltar turno
          mostrarBotonSaltar(jugadorSiguiente);

    }   

    pintarDescartes();  // Finalmente pintamos los descartes en caso de que haya

}   // Fin Funcion Robar Carta


// Funcion Pasar Turno
function pasarTurno() {

    let jugadorActivoIndice = jugadores.findIndex(jugador => jugador.turno == true);

    if (jugadorActivoIndice == 0) {   // Si jugador1 es el jugador actual
        if (jugadores[1].eliminado == true) {
            jugadores[0].turno = false;
            jugadores[2].turno = true;
        } else {
            jugadores[0].turno = false;
            jugadores[1].turno = true;
        }

    } else if (jugadorActivoIndice == 1) {   // Si jugador2 es el jugador actual

        if (jugadores[2].eliminado == true) {
            jugadores[1].turno = false;
            jugadores[0].turno = true;
        } else {
            jugadores[1].turno = false;
            jugadores[2].turno = true;
        }

    } else if (jugadorActivoIndice == 2) {   // Si jugador3 es el jugador actual
        if (jugadores[0].eliminado == true) {
            jugadores[2].turno = false;
            jugadores[1].turno = true;
        } else {
            jugadores[2].turno = false;
            jugadores[0].turno = true;
        }

    }

}   // Fin Funcion Pasar Turno

// Funcion Estadisticas
function estadisticas(jugador) {

    let posicion = jugadores.indexOf(jugador) + 1;

    let numCartas = document.getElementById(`J${posicion}NumCartas`);
    let puntosJugador = document.getElementById(`J${posicion}Puntos`);
    let saltoTurno = document.getElementById(`J${posicion}saltoTurno`);
    let desactivacion = document.getElementById(`J${posicion}Desactivacion`);

    numCartas.textContent = `⚪️ Numero de cartas: ${jugador.contarCartas()}`;
    puntosJugador.textContent = `⚪️ Puntos totales: ${jugador.puntosTotales}`;
    saltoTurno.textContent = `⚪️ Cartas salto turno: ${jugador.contarSaltaTurno()}`;
    desactivacion.textContent = `⚪️ Cartas desactivación: ${jugador.contarDesactivacion()}`;

}   // Fin Funcion Estadisticas

// Funcion Pintar Descartes
function pintarDescartes() {
    let contenedorDescartes = document.getElementById("listaDescarte");

    for (let i = 0; i < pilaDescartes.length; i++) {
        let cartaPintada = document.createElement("li");
        let cartaDescartada = pilaDescartes[i];
        cartaPintada.innerHTML = cartaDescartada.tipo;
        contenedorDescartes.appendChild(cartaPintada);
    }
    // Vaciamos los descartes para que no vuelva a imprimir los valores ya escritos en el html
    pilaDescartes = [];

}   // Fin Funcion Pintar Descartes

// Funcion Pintar Jugadores
function pintarJugador() {

    // JUGADOR 1
    if (jugadores[0].turno == true && jugadores[0].eliminado == false) {
        turnoPlayer1.removeAttribute("class");
        turnoPlayer1.setAttribute("class", "amarillo");
    } else if(jugadores[0].turno == false && jugadores[0].eliminado == true){
        turnoPlayer1.removeAttribute("class");
        turnoPlayer1.setAttribute("class", "blanco");
    }else{
        turnoPlayer1.removeAttribute("class");
        turnoPlayer1.setAttribute("class", "blanco");
    }

    // JUGADOR 2
    if (jugadores[1].turno == true && jugadores[1].eliminado == false) {
        turnoPlayer2.removeAttribute("class");
        turnoPlayer2.setAttribute("class", "amarillo");
    } else if(jugadores[1].turno == false && jugadores[1].eliminado == true){
        turnoPlayer2.removeAttribute("class");
        turnoPlayer2.setAttribute("class", "blanco");
    }else{
        turnoPlayer2.removeAttribute("class");
        turnoPlayer2.setAttribute("class", "blanco");
    }

    // JUGADOR 3
    if (jugadores[2].turno == true && jugadores[2].eliminado == false) {
        turnoPlayer3.removeAttribute("class");
        turnoPlayer3.setAttribute("class", "amarillo");
    } else if(jugadores[2].turno == false && jugadores[2].eliminado == true){
        turnoPlayer3.removeAttribute("class");
        turnoPlayer3.setAttribute("class", "blanco");
    }else{
        turnoPlayer3.removeAttribute("class");
        turnoPlayer3.setAttribute("class", "blanco");
    }

}   // Fin Funcion Pintar Jugadores

// Funcion Mostrar Boton Saltar
function mostrarBotonSaltar(jugador) {

    let botonSaltar = document.getElementById("btnPasar");
    if (jugador.contarSaltaTurno() > 0) {

        botonPasar.removeAttribute("class");
        botonPasar.setAttribute("class", "btnAccion");
        botonSaltar.disabled = false;
    } else {
        
        botonPasar.removeAttribute("class");
        botonPasar.setAttribute("class", "oculto");
        botonSaltar.disabled = true;
    }
}   // Fin Funcion Mostrar Boton Saltar

// Funcion Mensaje Ganador por Eliminación
function mensajeGanadorEliminado(jugador) {    
    let mensaje = document.getElementById("mensajeGanador");
    mensaje.innerHTML = "Se acabó la partida. El ganador es " + jugador.nombre + "!!!";
}

// Funcion Mensaje Ganador por Puntos [NO FUNCIONA]
function mensajeGanadorPuntos(jugadores) {

    let jugadorMaxPuntos = jugadores[0]; // Seleccionamos el primer jugador para comparar

    for (let i = 1; i < jugadores.length; i++) {
        if (jugadores[i].puntos > jugadorMaxPuntos.puntos) {
            jugadorMaxPuntos = jugadores[i]; // Obtenemos el jugador con mayor puntuacion
        }
    }

    let mensaje = document.getElementById("mensajeGanador");
    mensaje.innerHTML = "Se acabó la partida. El ganador es " + jugadorMaxPuntos.nombre + " con " + jugadorMaxPuntos.puntosTotales + " puntos!!!";
}

// Funcion Cambiar Botones
function cambiarBotones() {
    let boton = document.getElementById("btnRobar");
    let botonPasar = document.getElementById("btnPasar");
    let botonReiniciar = document.createElement("button");

    let contenedorBotones = document.getElementById("contenedorAcciones");

    botonReiniciar.innerHTML = "Reiniciar";
    botonReiniciar.setAttribute("onclick", "location.reload()");
    botonReiniciar.setAttribute("class", "btnAccion");

    contenedorBotones.removeChild(boton);
    contenedorBotones.removeChild(botonPasar);
    contenedorBotones.appendChild(botonReiniciar);
      
}   // Fin Funcion Cambiar Botones