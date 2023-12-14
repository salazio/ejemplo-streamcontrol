window.onload = init;

function init(){
	
	var xhr = new XMLHttpRequest(); //consulta AJAX enviada al json local de streamcontrol
	var streamJSON = '../sc/streamcontrol.json'; //Ruta del JSON generado por streamcontrol
	var scObj; //Variable que mantiene la data del JSON
	var startup = true; //flag que identifica si es el primer ciclo de la ejecución
	var animated = false; //flag que indica si el overlay ya ha realizado su animación inicial
	var cBust = 0; //variable de cache
	var game; //variable que contiene el juego seleccionado en streamcontrol

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
			var nEvento = scObj['nEvento'];

			cargarLogo();
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
	
	setTimeout(overlayVersus,300);
	
	function getData(){
		
		//Se asigna valor de juego actual para cargar información en div para mantener, valor por defecto en caso de campo en blanco
		game = scObj['game'];


		var c1Nick = scObj['c1Nick'];
		var c2Nick = scObj['c2Nick'];

		var nEvento = scObj['nEvento'];

		if(startup){

			//Carga inicial de textos y validaciones de largo

			cargarCaster('#c1Nick',c1Nick);
			cargarCaster('#c2Nick',c2Nick);

		}
		else{
			//Se asigna valor del juego seleccionado en streamcontrol
			game = scObj['game'];


			/*Se valida si el valor del campo fue modificado en Streamcontrol, de ser el caso se actualiza y se valida
			su largo para ajustar el font en caso de ser necesario*/
			if($('#c1Nick').text() != c1Nick){ 
				cargarCaster('#c1Nick',c1Nick);
			}
			
			/*Se valida si el valor del campo fue modificado en Streamcontrol, de ser el caso se actualiza y se valida
			su largo para ajustar el font en caso de ser necesario*/
			if($('#c2Nick').text() != c2Nick){
				cargarCaster('#c2Nick',c2Nick);
			}


			/*Se valida si el valor del campo fue modificado en Streamcontrol, de ser el caso se actualiza y se valida
			su largo para ajustar el font en caso de ser necesario*/
			if($('#nEvento').text() != nEvento){
				cargaEvento('#nEvento',nEvento);
			}

			
			//Se revisa si el valor del juego seleccionado ha cambiado
			if($('#gameHold').text() != game){ 

				$('#gameHold').html(game); 
				cargarLogo();
			}

		}
	}

	//Función que esconde logos para refrescar y cambiar
	function cargarLogo(){
		gsap.to('#logoWrapper',.3,{css:{opacity: 0},delay:0,onComplete:function(){ 
			gsap.to('#logoWrapper',1,{css:{opacity: 1},delay:.3});
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
	function cargarCaster(campoCSS,valor){

		gsap.to(campoCSS,.3,{css:{opacity: 0},ease:Quad.easeOut,delay:.2,onComplete:function(){ 
				$(campoCSS).css('font-size',casterSize); 
				$(campoCSS).html(valor); 				

				validarTextos(campoCSS);
					
				gsap.to(campoCSS,.3,{css:{opacity: 1},ease:Quad.easeOut,delay:.4}); 
		}});

	}

	/*cambio de valor en texto, se esconde el elemento sacando la opacidad para luego modificar el valor y finalmente
	devolver la opacidad, en paralelo se valida el largo del texto para ajustar el tamaño del font según corresponda*/
	function cargaEvento(campoCSS,valor){

		gsap.to(campoCSS,.3,{css:{opacity: 0},ease:Quad.easeOut,delay:.2,onComplete:function(){
				$(campoCSS).css('font-size',eventoSize);
				$(campoCSS).html(valor);					

				validarTextos(campoCSS);
					
				gsap.to(campoCSS,.3,{css:{opacity: 1},ease:Quad.easeOut,delay:.3});
		}});

	}


}