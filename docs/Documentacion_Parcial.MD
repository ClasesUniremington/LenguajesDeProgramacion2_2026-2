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

