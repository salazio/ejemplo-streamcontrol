window.onload = init;

function init(){
	
	var xhr = new XMLHttpRequest(); //consulta AJAX enviada al json local de streamcontrol
	var streamJSON = '../sc/streamcontrol.json'; //Ruta del JSON generado por streamcontrol
	var scObj; //Variable que mantiene la data del JSON
	var startup = true; //flag que identifica si es el primer ciclo de la ejecución
	var animated = false; //flag que indica si el scoreboard ya ha realizado su animación inicial
	var cBust = 0; //variable de cache
	var game; //variable que contiene el juego seleccionado en streamcontrol

	//Lista de juegos que requieren posiciones especiales de logos
	const arrayLogoDer = ["UNICLR", "BBTAG", "EFZ", "ROA", "SOKU", "FOOTSIES", "LLB"];

	/*Proceso donde dependiendo del juego definido en Streamcontrol el alto del scoreboard cambia para ir acorde a los 
	elementos del juego*/
	function validaAltoScore(valorJuego){

		var alto = 0;
			
		switch(valorJuego){
			case 'BBTAG':
			case 'SAMSHO':
				alto = 20;
				break;
			case 'DNF':
				alto = 22;
				break;
			case 'UNICLR':
			case 'MBTL':
			case 'SFV':
				alto = 25;
				break;
			case 'USF4':
				alto = 50;
				break;
			case 'GGST':
				alto = 50;
				break;
			default:
				alto = 0;
		}

		return alto;

	}

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
				scoreboard(); //Inicia ejecución de función scoreboard
			}
		}
	}
	
	function scoreboard(){
		
		if(startup){

			//Se asigna valor de juego actual para cargar información en div para mantener
			game = scObj['game']; 
			$('#gameHold').html(game);

			cargarLogo(game);
			cargaScoreboard(game);

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
	
	setTimeout(scoreboard,2000);
	
	function getData(){

		game = scObj['game'];
	
		var p1Nick = scObj['p1Nick'].toUpperCase();
		var p2Nick = scObj['p2Nick'].toUpperCase();

		var p1Score = scObj['p1Score'];
		var p2Score = scObj['p2Score'];

		var round = scObj['round'];

		if(startup){

			cargarRound('#round',round);
			cargarNick('#p1Nick',p1Nick);
			cargarNick('#p2Nick',p2Nick);

		}
		else{
			//Se asigna valor del juego seleccionado en streamcontrol
			game = scObj['game'];

			if($('#p1Nick').text() != p1Nick){ 
				cargarNick('#p1Nick',p1Nick);
			}
				
			/*Se valida si el valor del campo fue modificado en Streamcontrol, de ser el caso se actualiza y se valida
			su largo para ajustar el font en caso de ser necesario*/
			if($('#p2Nick').text() != p2Nick){
				cargarNick('#p2Nick',p2Nick);
			}

			/*Se valida si el valor del campo fue modificado en Streamcontrol, de ser el caso se actualiza y se valida
			su largo para ajustar el font en caso de ser necesario*/
			if($('#p1Score').text() != p1Score){
				cargarScore('#p1Score',p1Score);
			}

			/*Se valida si el valor del campo fue modificado en Streamcontrol, de ser el caso se actualiza y se valida
			su largo para ajustar el font en caso de ser necesario*/
			if($('#p2Score').text() != p2Score){
				cargarScore('#p2Score',p2Score);
			}

			/*Se valida si el valor del campo fue modificado en Streamcontrol, de ser el caso se actualiza y se valida
			su largo para ajustar el font en caso de ser necesario*/
			if($('#round').text() != round){
				cargarRound('#round',round);
			}

			//Se revisa si el valor del juego seleccionado ha cambiado
			if($('#gameHold').text() != game){ 

					$('#gameHold').html(game);

					cargarLogo(game);
					cargaScoreboard(game);
			}
		}
	}
	
	function cargaScoreboard(juego){

	var altoScore = validaAltoScore(juego);

	//Se agrega visibilidad de elementos
	TweenMax.to('.barraNombre',.3,{css:{opacity: 1},ease:Quad.easeOut,delay:0});
	TweenMax.to('.barraScore',.3,{css:{opacity: 1},ease:Quad.easeOut,delay:0});
	TweenMax.to('.nicks',.3,{css:{opacity: 1},ease:Quad.easeOut,delay:0.6});
	TweenMax.to('.scores',.3,{css:{opacity: 1},ease:Quad.easeOut,delay:0.6});
	TweenMax.to('#barraRound',.3,{css:{top: 0},ease:Quad.easeOut,delay:0.2});
	//Cambio de alto de score dependiendo del juego activo
	TweenMax.to('#scoreboardWrapper',.3,{css:{top: "-60px"},ease:Quad.easeOut,delay:0,onComplete:function(){
		TweenMax.to('#scoreboardWrapper',.3,{css:{top: altoScore},ease:Quad.easeOut,delay:0});
	}});

	}

	function asignarPosLogos(juego){

		//Si el juego existe en la lista se realiza ajuste en posición de logos
		if(arrayLogoDer.includes(juego)){
			TweenMax.set('.logos',{css:{x: adjustLg[0], y: adjustLg[1], width: adjustLg[2], height: adjustLg[3]}});
		}else{
		//En caso de no ser un juego en la lista el juego seleccionado se asignan los logos a su posición original
			TweenMax.set('.logos',{css:{x: '0', y: '0', width: adjustLg[2], height: adjustLg[3]}});
		}
				
	}

	/*Función que esconde logos para refrescar y cambiar, en este caso dependiendo del juego ingresado se decide si el
	logo se mantiene al centro o se mueve a la derecha debido a que topa con las barras del juego*/
	function cargarLogo(juego){
		TweenMax.to('#logoWrapper',.3,{css:{opacity: 0},delay:0,onComplete:function(){ 
			asignarPosLogos(juego);
			TweenMax.to('#logoWrapper',1,{css:{opacity: 1},delay:.3});
		}});

	}

	//función js que valida si el largo del texto entra en el espacio asignado, en caso contrario se ajusta el tamaño del texto
	function validarTextos(texto) {
		$(texto).each(function(i, texto) {
			while (texto.scrollWidth > texto.offsetWidth || texto.scrollHeight > texto.offsetHeight) {
				var newFontSize = (parseFloat($(texto).css('font-size').slice(0,-2)) * .95) + 'px';
				$(texto).css('font-size', newFontSize);
			};
		});
	}

	/*cambio de valor en texto, se esconde el elemento sacando la opacidad para luego modificar el valor y finalmente
	devolver la opacidad, en paralelo se valida el largo del texto para ajustar el tamaño del font según corresponda*/
	function cargarNick(campoCSS,valor){

		TweenMax.to(campoCSS,.3,{css:{opacity: 0},ease:Quad.easeOut,delay:.2,onComplete:function(){ 
				$(campoCSS).css('font-size',nameSize); 
				$(campoCSS).html(valor); 				

				validarTextos(campoCSS);
					
				TweenMax.to(campoCSS,.3,{css:{opacity: 1},ease:Quad.easeOut,delay:.4}); 
		}});

	}

	/*cambio de valor en texto, se esconde el elemento sacando la opacidad para luego modificar el valor y finalmente
	devolver la opacidad, en paralelo se valida el largo del texto para ajustar el tamaño del font según corresponda*/
	function cargarRound(campoCSS,valor){

		TweenMax.to(campoCSS,.3,{css:{opacity: 0},ease:Quad.easeOut,delay:.2,onComplete:function(){
				$(campoCSS).css('font-size',rdSize);
				$(campoCSS).html(valor);					

				validarTextos(campoCSS);
					
				TweenMax.to(campoCSS,.3,{css:{opacity: 1},ease:Quad.easeOut,delay:.3});
		}});

	}

	/*cambio de valor en texto, se esconde el elemento sacando la opacidad para luego modificar el valor y finalmente
	devolver la opacidad*/
	function cargarScore(scoreWrap,valorScore){

		TweenMax.to(scoreWrap,.3,{css:{opacity: 0},ease:Quad.easeOut,delay:.2,onComplete:function(){
				$(scoreWrap).html(valorScore);					
				TweenMax.to(scoreWrap,.3,{css:{opacity: 1},ease:Quad.easeOut,delay:.3});
		}});
	}

	
}