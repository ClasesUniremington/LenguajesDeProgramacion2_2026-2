# DOCUMENTACIÓN PARCIAL

Usé inteligencia artificial como apoyo, investigué y documenté las partes de mi propio código que más o menos logré entender, teniendo en cuenta que apenas somos estudiantes y estamos en proceso de aprendizaje.

# Linea 20 - 23 archivo js/character.js

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

Lo que hace esta va a buscar los datos del personaje; si lo encuentra, muestra la información y, si no lo encuentra, me muestra un error diciendo que no encontró el personaje.

# Linea 27 - 33 archivo js/character.js

function getCharacterId() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (id === null || !/^\d+$/.test(id) || Number(id) < 1) {
    return null;
  }
  return Number(id);
}

Entonces, mire, sencillamente le está diciendo que vaya a esa URL, busque el personaje y extraiga sus datos mediante el método GET. Si no encuentra el personaje, muestra un error; pero, si lo encuentra, devuelve los datos con return.

# Linea 35 - 52 archivo js/character.js

function renderCharacter(character) {
  document.title = character.name;
  characterBox.innerHTML = `
    <img src="${character.image}" alt="${character.name}">
    <div class="info">
      <h2>${character.name}</h2>
      <dl>
        <dt>Estado</dt><dd>${STATUS_TEXT[character.status] ?? character.status}</dd>
        <dt>Especie</dt><dd>${character.species}</dd>
        <dt>Género</dt><dd>${GENDER_TEXT[character.gender] ?? character.gender}</dd>
        <dt>Origen</dt><dd>${character.origin.name}</dd>
        <dt>Ubicación</dt><dd>${character.location.name}</dd>
        <dt>Episodios</dt><dd>${character.episode.length}</dd>
      </dl>
    </div>
  `;
  characterBox.hidden = false;
}

Entonces, lo que entendí es que simplemente muestra la información que trae de la API en cada etiqueta del personaje y facilita hacer cambios en el CSS para modificar su apariencia.

# Linea 54 - 61 archivo js/character.js


function createEpisodeItem(episode) {
  return `
    <li>
      <strong>${episode.episode} · ${episode.name}</strong>
      <span>${episode.air_date}</span>
    </li>
  `;
}

Entonces, mediante esa función, me trae cada episodio en el que aparece el personaje y me muestra el número del episodio, el nombre y la fecha de lanzamiento, utilizando etiquetas strong para resaltar la información.

# Linea 63 - 67 archivo js/character.js

async function loadEpisodes(episodeUrls) 
  episodesTitle.textContent = `Episodios (${episodeUrls.length})`;
  episodesSection.hidden = false;
  episodesList.innerHTML = "";
  episodesMessage.classList.remove("error");
  
Esta función prepara la sección para mostrar todos los episodios, indica cuántos son, limpia la información anterior y deja lista la lista para cargar los nuevos datos.

# Linea 71 - 76 js/character.js

if (episodeUrls.length === 0) {
    episodesMessage.textContent = "Este personaje no aparece en episodios.";
    return;
  }

  episodesMessage.textContent = "Cargando episodios...";

Si la lista de episodios está vacía, entonces retorna un mensaje; si tiene episodios, simplemente los carga.

# Linea 79 - 85 js/character.js

try {
    const ids = episodeUrls.map((url) => url.split("/").pop());
    const response = await fetch(`${EPISODE_API}${ids.join(",")}`);

    if (!response.ok) {
      throw new Error(`Status ${response.status}`);
    }
}

Hace un mapeo de los episodios y extrae sus enlaces. En lugar de hacer una petición por cada uno, hace una sola petición y los muestra en formato JSON. Si la API no responde, muestra un mensaje de error.

# Linea 87 - 97 js/character.js

const data = await response.json();
Convierte a JSON: Traduce la respuesta de la API a un formato legible.

const episodes = Array.isArray(data) ? data : [data];
Valida la lista: Asegura que sea una lista (incluso si es un solo episodio) para que no falle.

episodesList.innerHTML = episodes.map(createEpisodeItem).join("");
episodesMessage.textContent = "";

Pinta los episodios: Los transforma en HTML y los dibuja todos juntos en la pantalla, borrando el mensaje de carga.

 catch (error) {
  episodesMessage.textContent = "No se pudieron cargar los episodios, pero la ficha sigue disponible.";
  episodesMessage.classList.add("error");
}

Plan B (catch): Si algo falla, muestra un aviso de error en rojo pero deja intacta la información del personaje.

# Linea 99 - 108 js/character.js

async function loadCharacter() {
  const id = getCharacterId();

  if (id === null) {
    showMessage("Falta el número del personaje, o no es válido.", true);
    return;
  }
  
Va y busca el número del ID en el enlace de la página y, si no lo encuentra, muestra un mensaje de error y pues si carga simplemente me lo muestra el personaje.

  spinner.hidden = false;
  showMessage("Cargando personaje...");
   }

  let character = null;
  Entonces, el spinner carga la pantalla y, si todo sale bien, muestra la información. El let character crea una variable que guarda temporalmente la información del personaje hasta que la API responda o dé un error.

  # Linea 112 - 126 js/character.js

  const response = await fetch(`${CHARACTER_API}${id}`);
  "Aquí le digo que vaya a la API, me traiga los datos del personaje usando el número de ID que le pasé y me guarde la respuesta."

  if (response.status === 404) {
  showMessage("No se encontró el personaje.", true);
  return;
}
"Si me da un error 404, significa que el personaje no existe;

if (!response.ok) {
  showMessage(
    `El servidor respondió ${response.status}. No se pudo cargar el personaje.`,
    true,
  );
  return;
}
Si el servidor falla por otra cosa, muestro el código del error y detengo todo.

# Linea 128 - 145 js/character.js

character = await response.json();
    renderCharacter(character);
    showMessage("");
    Convierto la respuesta en formato JSON, pinto la tarjeta del personaje en pantalla y borro el mensaje de carga.

catch (error) {
  showMessage("No hay conexión con el servidor. Revise su internet e intente de nuevo.", true);
}

Si la conexión falla por completo, muestro un mensaje de error en rojo.

finally {
  spinner.hidden = true;
}

Pase lo que pase, oculto el círculo de carga para que no se quede girando para siempre.

if (character) {
  loadEpisodes(character.episode);
}

loadCharacter();

"Si el personaje cargó bien, busco sus episodios. Al final, ejecuto la función principal para que todo comience a funcionar.