window.onload = init;

function init(){
	
	var xhr = new XMLHttpRequest(); //consulta AJAX enviada al json local de streamcontrol
	var streamJSON = '../sc/streamcontrol.json'; //Ruta del JSON generado por streamcontrol
	var scObj; //Variable que mantiene la data del JSON
	var startup = true; //flag que identifica si es el primer ciclo de la ejecución
	var animated = false; //flag que indica si el overlay ya ha realizado su animación inicial
	var cBust = 0; //variable de cache
	var game; //variable que contiene el juego seleccionado en streamcontrol

	//Ruta de imagen que se asigna en caso de no encontrar la imagen del personaje asignado
	var imgDefaultGanador = "";

	//variables de personajes guardados para comparar
	var p1CharActual;
	var p2CharActual;

	xhr.overrideMimeType('application/json');
	
	function pollJSON() {
		xhr.open('GET',streamJSON+'?v='+cBust,true); //Permite consultar por una versión nueva del JSON
		xhr.send();
		cBust++;		
	}
	
	pollJSON();
	setInterval(function(){pollJSON();},400); //Se consulta el JSON cada X tiempo para mantener variables actualizadas
	xhr.onreadystatechange = parseJSON;
	
	function parseJSON() {
		if(xhr.readyState === 4){ //Se cargan datos del JSON en variable scObj
			scObj = JSON.parse(xhr.responseText);
			if(animated){
				overlayGanador(); //Inicia ejecución de función overlayGanador
			}
		}
	}
	
	function overlayGanador(){
		
		if(startup){

			//Se asigna valor de juego actual para cargar información
			game = scObj['game'];
			$('#gameHold').html(game);
			var nEvento = scObj['nEvento'];

			cargaLogo(game);
			cargaEvento('#nEvento',nEvento);

			//Se ejecuta función que carga las variables en los elementos
			getData();
			
			//Se asignan flags para determinar que ya se ha realizado el ciclo inicial de animación
			startup = false;
			animated = true;
		}
		else{
			getData();
		}
	}
	
	setTimeout(overlayGanador,300);
	
	function getData(){
		
		//Se asigna valor de juego actual para cargar información
		game = scObj['game'];

		//Se busca en JSON generado por StreamControl los valores necesarios para la escena

		var p1Nick = scObj['ganador1Nick'].toUpperCase();
		var p1Char = scObj['ganador1Char'].toLowerCase();

		var nEvento = scObj['nEvento'];

		if(startup){

			p1CharActual = p1Char;

			//Carga inicial de personajes en base al juego seleccionado

			TweenMax.to('.indexChars',.3,{css:{opacity: 0},delay:0,onComplete:function(){ 
				cargarPersonaje1(game,p1Char);
			TweenMax.to('.indexChars',2,{css:{opacity: 1},delay:.1});
			}});

			//Carga inicial de textos y validaciones de largo
			cargarNick('#p1Nick',p1Nick);

		}
		else{
			//Se asigna valor del juego seleccionado en streamcontrol
			game = scObj['game'];

			/*Se valida si el valor del campo fue modificado en Streamcontrol, de ser el caso se actualiza y se valida
			su largo para ajustar el font en caso de ser necesario*/
			if($('#p1Nick').text() != p1Nick){ 
				cargarNick('#p1Nick',p1Nick);
			}

			/*Se valida si el valor del campo fue modificado en Streamcontrol, de ser el caso se actualiza y se valida
			su largo para ajustar el font en caso de ser necesario*/
			if($('#nEvento').text() != nEvento){
				cargaEvento('#nEvento',nEvento);
			}

			//Se valida si el personaje seleccionado ha sido modificado en streamconntrol, comportamiento se define por juego
			if(p1CharActual != p1Char){
				cargarPersonaje1(game,p1Char);
			}



			if($('#gameHold').text() != game){ //Se revisa si el valor del juego seleccionado ha cambiado

				cargarPersonaje1(game,p1Char);
				$('#gameHold').html(game); 
				cargaLogo(game);
			}

		}
	}

	
	function cargaLogo(juego){
		//Esconder logos para refrescar y cambiar
		TweenMax.to('#logoWrapper',.3,{css:{opacity: 0},delay:0,onComplete:function(){ 
			TweenMax.to('#logoWrapper',1,{css:{opacity: 1},delay:.3});
		}});
	}

	
	function cargarPersonaje1(juego,nombrePersonaje){

		TweenMax.to("#pj1Wrapper",.3,{css:{opacity: 0},delay:0,onComplete:function(){
			$("#imgPersonaje1").attr("src","../imgs/chars/"+juego+"/"+nombrePersonaje+".png").on("error",function(){
				$("#imgPersonaje1").attr("src",imgDefaultGanador);
			});

			p1CharActual = nombrePersonaje;
			TweenMax.to("#pj1Wrapper",.3,{css:{opacity: 1},delay:.2});
		}});
				

	}



	//función que valida si el largo del texto entra en el espacio asignado, en caso contrario se ajusta el tamaño del texto
	function validarTextos(texto) {
		$(texto).each(function(i, texto) {
			while (texto.scrollWidth > texto.offsetWidth || texto.scrollHeight > texto.offsetHeight) {
				var newFontSize = (parseFloat($(texto).css('font-size').slice(0,-2)) * .95) + 'px';
				$(texto).css('font-size', newFontSize);
			};
		});
	}

	function cargarNick(campoCSS,valor){

		TweenMax.to(campoCSS,.3,{css:{opacity: 0},ease:Quad.easeOut,delay:.2,onComplete:function(){ 
				$(campoCSS).css('font-size',nameSize); 
				$(campoCSS).html(valor); 				

				validarTextos(campoCSS);
					
				TweenMax.to(campoCSS,.3,{css:{opacity: 1},ease:Quad.easeOut,delay:.4}); 
		}});

	}

	function cargaEvento(campoCSS,valor){

		TweenMax.to(campoCSS,.3,{css:{opacity: 0},ease:Quad.easeOut,delay:.2,onComplete:function(){
				$(campoCSS).css('font-size',eventSize);
				$(campoCSS).html(valor);					

				validarTextos(campoCSS);
					
				TweenMax.to(campoCSS,.3,{css:{opacity: 1},ease:Quad.easeOut,delay:.3});
		}});

	}



}