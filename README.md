
# ejemplo-streamcontrol

Proyecto de ejemplo para StreamControl con plantillas para overlays que pueden usarse como base, se adjuntan PSD de las escenas para poder editarlas.

![StreamControl_3v3](https://i.imgur.com/vStuQSb.png)

## Referencias

- Directorio de Google Drive con los archivos PSD de los overlays creadas - [URL Google Drive](https://drive.google.com/drive/folders/1zCaCSO4HQP1T-pTdoRBYa790vfsSNNEw?usp=sharing)
- [StreamControl](https://farpnut.net/streamcontrol/) - Programa utilizado para configuración de campos en los overlays
- StreamControl.exe utilizado se descargó del proyecto [Shieldbreakers-StreamControl-setup](https://github.com/MiggL/Shieldbreakers-StreamControl-setup/), este incluye información sobre como agregar módulos de StartGG y Challonge a StreamControl
- [GSAP](https://gsap.com/docs/v3/) - Librería usada para animaciones en JavaScript
- [Tutorial detallado de StreamControl](https://www.youtube.com/watch?v=qqyFknxaVWo) - [@bgcallisto](https://twitter.com/BGCallisto)

## Contenido

Este ejemplo contiene la base para lo siguiente:

- Scoreboard para puntajes y logo con lógica para moverlo hacia la derecha en caso de ser necesario
- Pantalla de espera con espacios para el nombre del evento, la captura del juego y el chat
- Pantalla para mostrar a los casters con campos para agregar los nombres
- Pantalla de previa para una partida donde se muestra el nombre de ambos participantes y sus personajes correspondientes
- Pantalla para mostrar al ganador del evento junto con su personaje
- Imágenes de referencia para múltiples juegos de pelea (en imgs/demo)

## Pasos para utilizar en OBS

- Dentro de una escena en OBS Studio agrega una fuente de tipo "Navegador/Browser Source"
- En las propiedas selecciona "Archivo local" asigna el archivo html relacionado al elemento que se desea agregar
	- Nota: Los archivos html se encuentran en el directorio "overlays"
- Para el ancho y alto asignar 1920 y 1080
- Habilita las siguientes opciones
	- Apagar fuente cuando no sea visible
	- Actualizar el navegador cuando la escena se active
- Con el elemento ya agregado a OBS abre StreamControl.exe encontrado en el direcotio "sc" y modifica los campos para validar que responda correctamente
	- Nota: Luego de modificar un campo en StreamControl se debe confirmar el cambio con el botón de guardado encontrado arriba a la izquierda

## Imagenes de ejemplos

![Scoreboard1](https://i.imgur.com/NGQU6i6.png)
![Scoreboard2](https://i.imgur.com/X04jlRa.png)
![Scoreboard3](https://i.imgur.com/keyQIVq.png)
![Espera](https://i.imgur.com/4iJ0EAd.png)
![Casters](https://i.imgur.com/KizTP6e.png)
![Versus](https://i.imgur.com/RV1OrwD.png)
![Versus3v3](https://i.imgur.com/ZGnEwTv.png)
![Ganador](https://i.imgur.com/omOq0VS.png)

## Tips para editar contenido

### Agregar campos a StreamControl

- StreamControl permite personalizar los campos que tiene para luego usarlos en los overlays, para agregar más campos hay que editar el archivo layout.xml encontrado en el directorio "sc", para detalles sobre como agregar un campo nuevo revisa la [Documentación de layouts para StreamControl](https://farpnut.net/streamcontrol/layout-documentation/)

### Eliminar campos para personajes 2/3 de StreamControl y reducir tamaño de la app

- En caso de no requerir campos para más de un solo personaje se puede cambiar el archivo layout.xml, dentro del directorio "sc" hay un archivo "layout_sin3v3.xml", simplemente se debe cambiar el nombre de "layout.xml" y dejar el archivo "layout_sin3v3.xml" con ese nombre, al hacer eso cuando se abra StreamControl ya no aparecerán los campos adicionales.

**Nota:** Luego del cambio de layout es posible que la primera vez que guarden en StreamControl este dejé de responder y se cierre, cuando lo abran denuevo esto debería quedar resuelto.

![StreamControl_1v1](https://i.imgur.com/N5gwq6v.png)

### Agregar personajes de otros juegos

- Para agregar otros juegos al ejemplo lo único que se necesita es crear un nuevo directorio con el nombre del juego que se quiera agregar en "imgs/chars"(el nombre de esta carpeta es el que deberán usar en el campo "Juego" en StreamControl), dentro de este se deben agregar las imágenes de los personajes del juego en formato PNG, en resolución 960x1080 y con los nombres en minúscula

### Cambiar el fondo gris que tienen las escenas

- El fondo de todos los overlays viene de la imagen fondo.png, simplemente se debe cambiar esa imagen por otra que tenga resolución 1920x1080 dejándole de nombre fondo.png

### Editar diseño de overlays del ejemplo

- Dentro del directorio "imgs" se encuentran todas las imágenes utilizadas por los html para armar los overlays, debido a esto en caso de que se quiera tener los campos de texto y/o personajes en las mismas posiciones del ejemplo solo se debe reemplazar las imágenes con las que uno genere, para el caso donde no se quiera tener los campos en esas posiciones se deberá editar el css de los overlays que se encuentra dentro de los html en el directorio "overlays"

### Cambiar font utilizado por los overlays

- El font utilizado por este ejemplo está ubicado en el directorio "fonts", para utilizar uno diferente se debe agregar el archivo del font y luego referenciarlo en los html (Usar de referencia el font-face de Steagisler que se encuentra en los html)
	- Nota: Al cambiar el font puede que se requiera ajustar los tamaños de los textos para que aparezcan correctamente en los overlays