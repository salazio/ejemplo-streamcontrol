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
	var gCharActual;

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

			cargarLogo();
			cargarEvento('#nEvento',nEvento);

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
		//Nota: El valor del personaje siempre se busca en minúscula, tener en cuenta esto para las imágenes que se agreguen

		var gNick = scObj['gNick'].toUpperCase();
		var gChar = scObj['gChar'].toLowerCase();

		var nEvento = scObj['nEvento'];

		if(startup){

			gCharActual = gChar;

			//Carga inicial de personajes en base al juego seleccionado

			TweenMax.to('.indexChars',.3,{css:{opacity: 0},delay:0,onComplete:function(){ 
				cargarPersonaje(game,gChar);
			TweenMax.to('.indexChars',2,{css:{opacity: 1},delay:.1});
			}});

			//Carga inicial de textos y validaciones de largo
			cargarNick('#gNick',gNick);

		}
		else{
			//Se asigna valor del juego seleccionado en streamcontrol
			game = scObj['game'];

			/*Se valida si el valor del campo fue modificado en Streamcontrol, de ser el caso se actualiza y se valida
			su largo para ajustar el font en caso de ser necesario*/
			if($('#gNick').text() != gNick){ 
				cargarNick('#gNick',gNick);
			}

			/*Se valida si el valor del campo fue modificado en Streamcontrol, de ser el caso se actualiza y se valida
			su largo para ajustar el font en caso de ser necesario*/
			if($('#nEvento').text() != nEvento){
				cargaEvento('#nEvento',nEvento);
			}

			//Se valida si el personaje seleccionado ha sido modificado en streamconntrol, comportamiento se define por juego
			if(gCharActual != gChar){
				cargarPersonaje(game,gChar);
			}

			if($('#gameHold').text() != game){ //Se revisa si el valor del juego seleccionado ha cambiado
				cargarPersonaje(game,gChar);
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

	/* Función encargada de reemplazar la imagen con la que venga del campo en StreamControl, el .png del personaje 
	se busca en el directorio del juego que esté indicando en el campo "Juego" (BBCF/GGST/etc)*/
	function cargarPersonaje(juego,nombrePersonaje){
		TweenMax.to("#pjWrapper",.3,{css:{opacity: 0},delay:0,onComplete:function(){
			$("#imgPersonaje").attr("src","../imgs/chars/"+juego+"/"+nombrePersonaje+".png").on("error",function(){
				$("#imgPersonaje").attr("src",imgDefaultGanador);
			});

			gCharActual = nombrePersonaje;
			TweenMax.to("#pjWrapper",.3,{css:{opacity: 1},delay:.2});
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
	function cargarEvento(campoCSS,valor){
		TweenMax.to(campoCSS,.3,{css:{opacity: 0},ease:Quad.easeOut,delay:.2,onComplete:function(){
				$(campoCSS).css('font-size',eventSize);
				$(campoCSS).html(valor);					

				validarTextos(campoCSS);
					
				TweenMax.to(campoCSS,.3,{css:{opacity: 1},ease:Quad.easeOut,delay:.3});
		}});
	}

}