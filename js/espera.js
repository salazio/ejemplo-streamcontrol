window.onload = init;

function init(){
	
	var xhr = new XMLHttpRequest(); //consulta AJAX enviada al json local de streamcontrol
	var streamJSON = '../sc/streamcontrol.json'; //Ruta del JSON generado por streamcontrol
	var scObj; //Variable que mantiene la data del JSON
	var startup = true; //flag que identifica si es el primer ciclo de la ejecución
	var animated = false; //flag que indica si el overlay ya ha realizado su animación inicial
	var cBust = 0; //variable de cache
	var game; //variable que contiene el juego seleccionado en streamcontrol

	//Elementos que tendrán tamaño variable
	var eventoWrap = $('#nEvento');

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
				overlayEspera(); //Inicia ejecución de función overlayVersus
			}
		}
	}
	
	function overlayEspera(){
		
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
	
	setTimeout(overlayEspera,300);
	
	function getData(){
		
		//Se asigna valor de juego actual para cargar información
		var nEvento = scObj['nEvento'];

		/*Se valida si el valor del campo fue modificado en Streamcontrol, de ser el caso se actualiza y se valida
		su largo para ajustar el font en caso de ser necesario*/
		if($('#nEvento').text() != nEvento){
			cargaEvento('#nEvento',nEvento);
		}

	}

	//Función que esconde logos para refrescar y cambiar
	function cargarLogo(){
		TweenMax.to('#logoWrapper',.3,{css:{opacity: 0},delay:0,onComplete:function(){ 
			TweenMax.to('#logoWrapper',1,{css:{opacity: 1},delay:.3});
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
	function cargaEvento(campoCSS,valor){

		TweenMax.to(campoCSS,.3,{css:{opacity: 0},ease:Quad.easeOut,delay:.2,onComplete:function(){
				$(campoCSS).css('font-size',eventSize);
				$(campoCSS).html(valor);					

				validarTextos(campoCSS);
					
				TweenMax.to(campoCSS,.3,{css:{opacity: 1},ease:Quad.easeOut,delay:.3});
		}});

	}



}