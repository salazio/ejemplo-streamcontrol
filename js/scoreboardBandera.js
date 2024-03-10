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

	//valor por defecto para banderas en caso de fallo
	var imgDefaultBandera = "../imgs/banderas/world.png";

	//variables de banderas guardadas para comparar al momento de determinar si el campo de bandera ha cambiado
	var p1FlagActual;
	var p2FlagActual;

	/*Proceso donde dependiendo del juego definido en Streamcontrol la posicion del scoreboard cambia para ir acorde a los 
	elementos del juego*/
	function validaXYScore(valorJuego){

		var alto = 0;
		var separado = 0;
			
		switch(valorJuego){
			case 'BBTAG':
			case 'SAMSHO':
			case 'BBCF':
				alto = 0;
				separado = -90;
				break;
			case 'DNF':
				alto = 22;
				separado = 0;
				break;
			case 'UNICLR':
			case 'MBTL':
			case 'SFV':
				alto = 25;
				separado = -90;
				break;
			case 'SF6':
				alto = 0;
				separado = -10;
				break;
			case 'KARNOV':
				alto = 35;
				separado = 0;
				break;
			case 'USF4':
				alto = 50;
				separado = 0;
				break;
			case 'GGST':
				alto = 55;
				separado = -35;
				break;
			case 'GBVSR':
				alto = 15;
				separado = -5;
				break;
			default:
				alto = 0;
				separado = 0;
		}

		return [alto,separado];

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

		var p1Flag = scObj['p1Flag'];
		var p2Flag = scObj['p2Flag'];

		var round = scObj['round'];

		if(startup){

			p1FlagActual = p1Flag;
			p2FlagActual = p2Flag;

			cargarBandera1(p1Flag);
			cargarBandera2(p2Flag);
			cargaScoreboard(game);
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

			/*Se valida si el valor del campo fue modificado en Streamcontrol, de ser el caso se actualiza y se valida
			su largo para ajustar el font en caso de ser necesario*/
			if(p1FlagActual != p1Flag){
				cargarBandera1(p1Flag);
			}


			/*Se valida si el valor del campo fue modificado en Streamcontrol, de ser el caso se actualiza y se valida
			su largo para ajustar el font en caso de ser necesario*/
			if(p2FlagActual != p2Flag){
				cargarBandera2(p2Flag);
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

	var XYScore = validaXYScore(juego);

	//Se agrega visibilidad de elementos
	gsap.to('.barraNombre',.3,{css:{opacity: 1},ease:Quad.easeOut,delay:0});
	gsap.to('.barraScore',.3,{css:{opacity: 1},ease:Quad.easeOut,delay:0});
	//Se agrega visibilidad a cuadro de bandera
	gsap.to('.barraBandera',.3,{css:{opacity: 1},ease:Quad.easeOut,delay:0});
	gsap.to('.nicks',.3,{css:{opacity: 1},ease:Quad.easeOut,delay:0.6});
	gsap.to('.scores',.3,{css:{opacity: 1},ease:Quad.easeOut,delay:0.6});
	gsap.to('#barraRound',.3,{css:{top: 0},ease:Quad.easeOut,delay:0.2});
	//Cambio de alto de score dependiendo del juego activo
	gsap.to('#scoreboardWrapperGeneral',.3,{css:{top: "-60px"},ease:Quad.easeOut,delay:0,onComplete:function(){
		gsap.to('#scoreboardWrapperGeneral',.3,{css:{top: XYScore[0]},ease:Quad.easeOut,delay:0});
		//Cambio de posicion horizontal de score dependiendo del juego activo
		gsap.to('#scoreboardWrapperP1',.3,{css:{right: XYScore[1]},ease:Quad.easeOut,delay:0});
		gsap.to('#scoreboardWrapperP2',.3,{css:{left: XYScore[1]},ease:Quad.easeOut,delay:0});
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
		gsap.to('#logoWrapper',.3,{css:{opacity: 0},delay:0,onComplete:function(){ 
			asignarPosLogos(juego);
			gsap.to('#logoWrapper',1,{css:{opacity: 1},delay:.3});
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

		gsap.to(campoCSS,.3,{css:{opacity: 0},ease:Quad.easeOut,delay:.2,onComplete:function(){ 
				$(campoCSS).css('font-size',nameSize); 
				$(campoCSS).html(valor); 				

				validarTextos(campoCSS);
					
				gsap.to(campoCSS,.3,{css:{opacity: 1},ease:Quad.easeOut,delay:.4}); 
		}});

	}

	/*cambio de valor en texto, se esconde el elemento sacando la opacidad para luego modificar el valor y finalmente
	devolver la opacidad, en paralelo se valida el largo del texto para ajustar el tamaño del font según corresponda*/
	function cargarRound(campoCSS,valor){

		gsap.to(campoCSS,.3,{css:{opacity: 0},ease:Quad.easeOut,delay:.2,onComplete:function(){
				$(campoCSS).css('font-size',rdSize);
				$(campoCSS).html(valor);					

				validarTextos(campoCSS);
					
				gsap.to(campoCSS,.3,{css:{opacity: 1},ease:Quad.easeOut,delay:.3});
		}});

	}

	/*cambio de valor en texto, se esconde el elemento sacando la opacidad para luego modificar el valor y finalmente
	devolver la opacidad*/
	function cargarScore(scoreWrap,valorScore){

		gsap.to(scoreWrap,.3,{css:{opacity: 0},ease:Quad.easeOut,delay:.2,onComplete:function(){
				$(scoreWrap).html(valorScore);					
				gsap.to(scoreWrap,.3,{css:{opacity: 1},ease:Quad.easeOut,delay:.3});
		}});
	}

	//funciones que cargan las imágenes de las banderas(img/banderas) por medio del campo en StreamControl

	function cargarBandera1(bandera){
		gsap.to("#imgBandera1",.3,{css:{opacity: 0},delay:0,onComplete:function(){
			$("#imgBandera1").attr("src","../imgs/banderas/"+bandera+".png").on("error",function(){
				$("#imgBandera1").attr("src",imgDefaultVersus);
			});

			p1FlagActual = bandera;
			gsap.to("#imgBandera1",.3,{css:{opacity: 1},delay:.2});
		}});
	}

	function cargarBandera2(bandera){
		gsap.to("#imgBandera2",.3,{css:{opacity: 0},delay:0,onComplete:function(){
			$("#imgBandera2").attr("src","../imgs/banderas/"+bandera+".png").on("error",function(){
				$("#imgBandera2").attr("src",imgDefaultVersus);
			});

			p2FlagActual = bandera;
			gsap.to("#imgBandera2",.3,{css:{opacity: 1},delay:.2});
		}});
	}

	
}