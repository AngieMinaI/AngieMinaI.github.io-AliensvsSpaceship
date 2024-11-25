var nave;
var balas;
var tiempoEntreBalas = 400;
var tiempo = 0;
var malos;
var timer;
var puntos;
var txtPuntos;
var vidas = 3;
var txtVidas;
var reconocimientoDeVoz;
var juegoTerminado = false; 
var musicaFondo;

var PantallaInicio = {
    preload: function() {
        juego.load.image('bg1', 'img/fondo.png');
           juego.load.audio('musicaFondo1', 'audio/audio1.ogg'); 
    },
    create: function() {
        musicaFondo1 = juego.add.audio('musicaFondo1');
        musicaFondo1.loop = true; 
        musicaFondo1.play();   

        juego.add.sprite(0, 0, 'bg1');

        var titulo = juego.add.text(juego.world.centerX, 150, 'Aliens vs Spaceship', {
            font: 'bold 40px Arial',
            fill: '#ff0000'
        });
        titulo.anchor.setTo(0.5);

        var subtitulo = juego.add.text(120, 200, 'Tienes 3 vidas', {
            font: '25px Arial',
            fill: '#3bddf0'
        });
        var subtitulo1 = juego.add.text(90, 230, 'Con 5 puntos ganas', {
            font: '25px Arial',
            fill: '#3bddf0'
        });
        var subtitulo2 = juego.add.text(20, 260, 'Comandos de la nave: Derecha,', {
            font: '25px Arial',
            fill: '#3bddf0'
        });
        var subtitulo3 = juego.add.text(50, 290, ' Izquierda, Fuego o Dispara', {
            font: '25px Arial',
            fill: '#3bddf0'
        });
        var subtitulo4 = juego.add.text(60, 320, 'Autor: Angie Mina Ishuiza', {
            font: '25px Arial',
            fill: '#3bddf0'
        });

        
        var mensajeVoz = juego.add.text(200, 400, 'Di "Jugar" para comenzar', {
            font: 'bold 25px Arial',
            fill: '#ff0000',
            
        });
        
        juego.time.events.loop(500, function() {
         
            mensajeVoz.visible = !mensajeVoz.visible;
        }, this);
        mensajeVoz.anchor.setTo(0.5);

        
        inicializarReconocimientoVozPantallaInicio();
    }
};


function inicializarReconocimientoVozPantallaInicio() {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        reconocimientoDeVoz = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        reconocimientoDeVoz.lang = 'es-ES';
        reconocimientoDeVoz.continuous = true;
        reconocimientoDeVoz.interimResults = false;

        reconocimientoDeVoz.onresult = function(event) {
            for (var i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    var comando = event.results[i][0].transcript.trim().toLowerCase();
                    console.log("Comando reconocido:", comando);
                    if (comando.includes("jugar")) {
                        iniciarJuegoDesdeVoz();
                    }
                }
            }
        };

        reconocimientoDeVoz.onerror = function(event) {
            console.error("Error en el reconocimiento de voz:", event.error);
        };

        reconocimientoDeVoz.onend = function() {
            reconocimientoDeVoz.start(); 
        };

        reconocimientoDeVoz.start();
    } else {
        alert("Tu navegador no soporta reconocimiento de voz.");
    }
}


function iniciarJuegoDesdeVoz() {
    reconocimientoDeVoz.stop(); 
    juego.state.start('Juego'); 
}


var Juego = {
    preload: function () {
      
        juego.load.image('nave', 'img/nave.png');
        juego.load.image('laser', 'img/laser.png');
        juego.load.image('malo', 'img/ali.png');
        juego.load.image('bg', 'img/fondo2.png');
        juego.load.audio('sonidoColision', 'audio/explosion.mp3');
        juego.load.audio('sonidoDisparo', 'audio/disparo.ogg');
        juego.load.audio('musicaFondo', 'audio/fondo.mp3'); 
        juego.load.image('puntosIcono', 'img/puntos.png');
    juego.load.image('vidasIcono', 'img/corazon.png');

    },

    create: function () {
        fondo = juego.add.tileSprite(0, 0, 400, 540, 'bg');
        juego.physics.startSystem(Phaser.Physics.ARCADE);
        nave = juego.add.sprite(juego.width / 2, 485, 'nave');
        nave.anchor.setTo(0.5);
        juego.physics.arcade.enable(nave, true);

        balas = juego.add.group();
        balas.enableBody = true;
        balas.setBodyType = Phaser.Physics.ARCADE;
        balas.createMultiple(50, 'laser');
        balas.setAll('anchor.x', 0.5);
        balas.setAll('anchor.y', 0.5);
        balas.setAll('checkWorldBounds', true);
        balas.setAll('outOfBoundsKill', true);

        malos = juego.add.group();
        malos.enableBody = true;
        malos.setBodyType = Phaser.Physics.ARCADE;
        malos.createMultiple(30, 'malo');
        malos.setAll('anchor.x', 0.5);
        malos.setAll('anchor.y', 0.5);
        malos.setAll('checkWorldBounds', true);
        malos.setAll('outOfBoundsKill', true);

        timer = juego.time.events.loop(2000, this.crearEnemigo, this);

        puntos = 0;
        juego.add.text(25, 20, "Puntos:", { font: "14px Arial", fill: "#FFF" });
        txtPuntos = juego.add.text(80, 20, "0", { font: "14px Arial", fill: "#FFF" });
        let puntosIcon = juego.add.sprite(0, 15, 'puntosIcono');
        puntosIcon.scale.setTo(0.5, 0.5);

        juego.add.text(310, 20, "Vidas:", { font: "14px Arial", fill: "#FFF" });
        txtVidas = juego.add.text(360, 20, "3", { font: "14px Arial", fill: "#FFF" });
        let vidasIcon = juego.add.sprite(285, 15, 'vidasIcono');
        vidasIcon.scale.setTo(0.5, 0.5);

        sonidoColision = juego.add.audio('sonidoColision');
        sonidoDisparo = juego.add.audio('sonidoDisparo');

        musicaFondo1.stop();
        musicaFondo = juego.add.audio('musicaFondo');
        musicaFondo.loop = true; 
        musicaFondo.play();   
        musicaFondo.volume = 0.5;   

     
        inicializarReconocimientoVoz();

    },

    update: function () {
       if (!juegoTerminado) {
            fondo.tilePosition.y += 3;

            // Colisiones
            juego.physics.arcade.overlap(balas, malos, this.colision, null, this);
            juego.physics.arcade.overlap(malos, nave, this.perderVida, null, this);
        }

    },

    disparar: function () {
         if (!juegoTerminado && juego.time.now > tiempo && balas.countDead() > 0) {
            tiempo = juego.time.now + tiempoEntreBalas;
            var bala = balas.getFirstDead();
            bala.anchor.setTo(0.5);
            bala.reset(nave.x, nave.y);
            juego.physics.arcade.moveToXY(bala, bala.x, -50, 200); 
            sonidoDisparo.play();
        }

    },

    moverIzquierda: function () {
        if (!juegoTerminado && nave.x > 20) {
            nave.x -= 30;
            console.log("Nave movida a la izquierda");
        }
    },

    moverDerecha: function () {
        if (!juegoTerminado && nave.x < juego.width - 20) {
            nave.x += 30;
            console.log("Nave movida a la derecha");
        }
    },

    crearEnemigo: function () {
        if (!juegoTerminado) {
            var enem = malos.getFirstDead();
            var num = Math.floor(Math.random() * 10 + 1);
            enem.reset(num * 38, 0);
            enem.anchor.setTo(0.5);
            enem.body.velocity.y = 100;
            enem.checkWorldBounds = true;
            enem.outOfBoundsKill = true;
        }
    },

    colision: function (b, m) {
        b.kill();
        m.kill();
        puntos++;
        txtPuntos.text = puntos;
        sonidoColision.play();

        if (puntos >= 5) {
            this.win();
        }

    },

    perderVida: function (nave, malo) {
         malo.kill();
        vidas -= 1;
        txtVidas.text = vidas;
        if (vidas <= 0) {
            this.gameOver();
        }
    },

    gameOver: function () {
         juegoTerminado = true; 
        juego.time.events.remove(timer);

       
        malos.forEachAlive(function (enemigo) {
            enemigo.body.velocity.y = 0;
        });

        var gameOverText = juego.add.text(
            juego.world.centerX,
            juego.world.centerY - 50,
            "GAME OVER",
            { font: "bold 40px Arial", fill: "#fa0113", align: "center" }
        );
        gameOverText.anchor.setTo(0.5);

        var reiniciarText = juego.add.text(
            juego.world.centerX,
            juego.world.centerY + 20,
            "Di 'Reiniciar' para volver a jugar",
            { font: "20px Arial", fill: "#FFF", align: "center" }
        );
        reiniciarText.anchor.setTo(0.5);
    },

    win: function () {
         juegoTerminado = true; 
        juego.time.events.remove(timer);

      
        malos.forEachAlive(function (enemigo) {
            enemigo.body.velocity.y = 0;
        });

        var winText = juego.add.text(
            juego.world.centerX,
            juego.world.centerY - 50,
            "WIN",
            { font: "bold 40px Arial", fill: "#fbff00", align: "center" }
        );
        winText.anchor.setTo(0.5);

        var reiniciarText = juego.add.text(
            juego.world.centerX,
            juego.world.centerY + 20,
            "Di 'Reiniciar' para volver a jugar",
            { font: "20px Arial", fill: "#FFF", align: "center" }
        );
        reiniciarText.anchor.setTo(0.5);

    }
};
function inicializarReconocimientoVoz() {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        reconocimientoDeVoz = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        reconocimientoDeVoz.lang = 'es-ES';
        reconocimientoDeVoz.continuous = true;
        reconocimientoDeVoz.interimResults = false;

        reconocimientoDeVoz.onresult = function (event) {
            for (var i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    var comando = event.results[i][0].transcript.trim().toLowerCase();
                    console.log("Comando reconocido:", comando);
                    procesarComando(comando);
                }
            }
        };

        reconocimientoDeVoz.onerror = function (event) {
            console.error("Error en el reconocimiento de voz:", event.error);
        };

        reconocimientoDeVoz.onend = function () {
            reconocimientoDeVoz.start(); 
        };

        reconocimientoDeVoz.start();
    } else {
        alert("Tu navegador no soporta reconocimiento de voz.");
    }
}

function procesarComando(comando) {
    if (juegoTerminado && comando.includes("reiniciar")) {
        location.reload(); 
    } else if (!juegoTerminado) {
        if (comando.includes("izquierda")) {
            Juego.moverIzquierda();
        } else if (comando.includes("derecha")) {
            Juego.moverDerecha();
        } else if (comando.includes("dispara") || comando.includes("fuego")) {
            Juego.disparar();
        }
    }
}


