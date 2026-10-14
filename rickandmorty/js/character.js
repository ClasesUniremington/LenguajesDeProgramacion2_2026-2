const API = "https://rickandmortyapi.com/api/character";
const APIEpisodes = "https://rickandmortyapi.com/api/episode";
const error = document.querySelector("#mostrarError");
const cardContent = document.querySelector("#content");
const message = document.querySelector("#message");
const link = window.location.search;


function createCard(character, episodes) {
  return `
    <article class="card">
      <img src="${character.image}" alt="${character.name}">

      <div class="info">
        <h2>${character.name}</h2>
        <dl>
          <dt>Estado</dt>    <dd>${character.status}</dd>
          <dt>Especie</dt>   <dd>${character.species}</dd>
          <dt>Género</dt>    <dd>${character.gender}</dd>
          <dt>Origen</dt>    <dd>${character.origin.name}</dd>
          <dt>Ubicación</dt> <dd>${character.location.name}</dd>
          <dt>Episodios</dt> <dd>${episodes.length}</dd>
        </dl>
      </div>

      <section class="episodes">
        <h3>Episodios (${episodes.length})</h3>
        <ul>
          ${episodes
            .map((ep) => `<li><strong>${ep.episode} · ${ep.name}</strong></li>`)
            .join("")}
        </ul>
      </section>
    </article>
  `;
}


function showContent(character, episodes) {
  cardContent.innerHTML = createCard(character, episodes);
}

function errorR(descripcionError) {
  error.innerHTML = descripcionError;
}

function loading(descripcion) {
  message.innerHTML = descripcion;
}


async function loadEpisodes(url, id) {
  const episodiosDelPersonaje = [];

  try {
    let siguiente = url;

  
    while (siguiente) {
      const response = await fetch(siguiente);

      if (!response.ok) {
        errorR(
          `No se pudo completar la solicitud, por el error ${response.status}`,
        );
        return [];
      }

      const data = await response.json();

      data.results.forEach((ep) => {
        
        const apareceEnEpisodio = ep.characters.some(
          (urlPersonaje) => urlPersonaje.split("/").pop() === String(id),
        );

        if (apareceEnEpisodio) {
          episodiosDelPersonaje.push({
            episode: ep.episode,
            name: ep.name,
          });
        }
      });

      siguiente = data.info.next; 
    }

    return episodiosDelPersonaje;
  } catch (e) {
    errorR(`No se pudieron cargar los episodios por error de red o ${e}`);
    return [];
  }
}

async function loadCharacter(url) {
  const parametros = Number(new URLSearchParams(link).get("id"));

  if (!parametros) {
    errorR("No se indicó un personaje válido en la URL (falta ?id=)");
    return;
  }

  try {
    loading("Cargando Personaje");

    
    const response = await fetch(`${url}/${parametros}`);

    if (!response.ok) {
      errorR(
        `No se pudo completar la solicitud, por el error ${response.status}`,
      );
      loading("");
      return;
    }

    const personajeEncontrado = await response.json();

    
    const episodes = await loadEpisodes(APIEpisodes, parametros);

    showContent(personajeEncontrado, episodes);
    loading("");
  } catch (r) {
    loading("");
    errorR(`No pudo compilar el programa correctamente por error de red o ${r}`);
  }
}


loadCharacter(API);

