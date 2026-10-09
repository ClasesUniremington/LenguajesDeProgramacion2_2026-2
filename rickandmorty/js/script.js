const API = "https://rickandmortyapi.com/api/character";
const cardContainer = document.querySelector("#content");
const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");
const pageNumber = document.querySelector("#page-number");
const message = document.querySelector("#message");
const spinner = document.querySelector("#spinner");

let prevPage = null;
let nextPage = null;

function createCard(character) {
  return `
      <a class="card-link" href="character.html?id=${character.id}">
        <article class="card">
            <img src="${character.image}" alt="${character.name}">
            <div class="container">
                <h2>${character.name}</h2>
                <p >Estado: ${character.status}</p>
                <p >Especie: ${character.species}</p>
            </div>
        </article>
      </a>
    `;
}

function showCharacters(characters) {
  cardContainer.innerHTML = characters.map(createCard).join("");
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function updateButtons() {
  prevButton.disabled = !prevPage;
  nextButton.disabled = !nextPage;
}

/**
 * Funcion para cargar todos los personajes de la API de Rick and Morty
 */
async function loadCharacters(url) {
  cardContainer.innerHTML = "";
  spinner.hidden = false;
  showMessage("Cargando personajes...");
  prevButton.disabled = true;
  nextButton.disabled = true;

  timeoutId = setTimeout(() => {
    showMessage(
      "La solicitud esta tardando demasiado. Revise su internet e intente de nuevo.",
      true,
    );
  }, 1000000);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      showMessage(
        `El servidor respondio ${response.status}. No se pudo cargar los personajes.`,
        true,
      );
      return;
    }

    const data = await response.json();
    showCharacters(data.results);
    showMessage("");

    prevPage = data.info.prev;
    nextPage = data.info.next;

    const currentPage = Number(new URL(url).searchParams.get("page")) || 1;
    pageNumber.textContent = `Página ${currentPage} de ${data.info.pages}`;
  } catch (error) {
    showMessage(
      "No hay conexion con el servidor. Revise su internet e intente de nuevo.",
      true,
    );
  } finally {
    spinner.hidden = true;
    updateButtons();
  }
}

prevButton.addEventListener("click", () => {
  if (prevPage) {
    loadCharacters(prevPage);
  }
});

nextButton.addEventListener("click", () => {
  if (nextPage) {
    loadCharacters(nextPage);
  }
});

loadCharacters(API);
