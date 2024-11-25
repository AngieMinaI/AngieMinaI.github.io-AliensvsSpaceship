var juego = new Phaser.Game(400, 540, Phaser.CANVAS, 'bloque_juego');

// Agregando los estados del juego
juego.state.add('PantallaInicio', PantallaInicio);
juego.state.add('Juego', Juego);


// Inicializamos el juego en el estado 'Juego'
juego.state.start('PantallaInicio');
