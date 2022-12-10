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
	var imgDefaultVersus = "";

	//variables de personajes guardados para comparar al momento de determinar si el campo de personaje ha cambiado
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
				overlayVersus(); //Inicia ejecución de función overlayVersus
			}
		}
	}
	
	function overlayVersus(){
		
		if(startup){

			//Se asigna valor de juego actual para cargar información
			game = scObj['game'];
			$('#gameHold').html(game);
			var round = scObj['round'];

			cargarLogo();
			cargarRound('#round',round);

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
	
	setTimeout(overlayVersus,300);
	
	function getData(){
		
		//Se asigna valor de juego actual para cargar información
		
		game = scObj['game'];

		//Se busca en JSON generado por StreamControl los valores necesarios para la escena
		//Nota: El valor del personaje siempre se busca en minúscula, tener en cuenta esto para las imágenes que se agreguen	
		var p1Nick = scObj['p1Nick'];
		var p2Nick = scObj['p2Nick'];

		var p1Char = scObj['p1Char'].toLowerCase();
		var p2Char = scObj['p2Char'].toLowerCase();

		var round = scObj['round'];

		if(startup){

			p1CharActual = p1Char;
			p2CharActual = p2Char;

			//Carga inicial de personajes en base al juego seleccionado
			TweenMax.to('.indexChars',.3,{css:{opacity: 0},delay:0,onComplete:function(){ 
				cargarPersonaje1(game,p1Char);
				cargarPersonaje2(game,p2Char);
			TweenMax.to('.indexChars',2,{css:{opacity: 1},delay:.1});
			}});

			//Carga inicial de textos y validaciones de largo
			cargarNick('#p1Nick',p1Nick);
			cargarNick('#p2Nick',p2Nick);

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
			if($('#p2Nick').text() != p2Nick){
				cargarNick('#p2Nick',p2Nick);
			}

			/*Se valida si el valor del campo fue modificado en Streamcontrol, de ser el caso se actualiza y se valida
			su largo para ajustar el font en caso de ser necesario*/
			if($('#round').text() != round){
				cargarRound('#round',round);
			}

			//Se valida si el personaje seleccionado ha sido modificado en streamconntrol			
			if(p1CharActual != p1Char){
				cargarPersonaje1(game,p1Char);
			}

			if(p2CharActual != p2Char){
				cargarPersonaje2(game,p2Char);
			}

			//Se revisa si el valor del juego seleccionado ha cambiado
			if($('#gameHold').text() != game){ 

				cargarPersonaje1(game,p1Char);
				cargarPersonaje2(game,p2Char);
				$('#gameHold').html(game); 
				cargarLogo();
			}
		}
	}

	//Función que esconde logos para refrescar y cambiar
	function cargarLogo(){
		TweenMax.to('#logoWrapper',.3,{css:{opacity: 0},delay:0,onComplete:function(){ 
			TweenMax.to('#logoWrapper',1,{css:{opacity: 1},delay:.3});
		}});
	}

	/* Funciones encargadas de reemplazar la imagen con la que venga del campo en StreamControl, el .png del personaje 
	se busca en el directorio del juego que esté indicando en el campo "Juego" (BBCF/GGST/etc)*/
	function cargarPersonaje1(juego,nombrePersonaje){
		TweenMax.to("#pj1Wrapper",.3,{css:{opacity: 0},delay:0,onComplete:function(){
			$("#imgPersonaje1").attr("src","../imgs/chars/"+juego+"/"+nombrePersonaje+".png").on("error",function(){
				$("#imgPersonaje1").attr("src",imgDefaultVersus);
			});

			p1CharActual = nombrePersonaje;
			TweenMax.to("#pj1Wrapper",.3,{css:{opacity: 1},delay:.2});
		}});
	}

	function cargarPersonaje2(juego,nombrePersonaje){
		TweenMax.to("#pj2Wrapper",.3,{css:{opacity: 0},delay:0,onComplete:function(){
			$("#imgPersonaje2").attr("src","../imgs/chars/"+juego+"/"+nombrePersonaje+".png").on("error",function(){
				$("#imgPersonaje2").attr("src",imgDefaultVersus);
			});

			p2CharActual = nombrePersonaje;
			TweenMax.to("#pj2Wrapper",.3,{css:{opacity: 1},delay:.2});
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

}