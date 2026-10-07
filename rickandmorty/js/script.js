const API = "https://rickandmortyapi.com/api/character";
const cardContainer = document.querySelector("#content");
const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");
const pageNumber = document.querySelector("#page-number");


let prevPage = null;
let nextPage = null;


function createCard(character) {
  return `
        <article class="card">
            <img src="${character.image}" alt="${character.name}">
            <div class="container">
                <h2>${character.name}</h2>
                <p >Estado: ${character.status}</p>
                <p >Especie: ${character.species}</p>
            </div>
        </article>
    `;
}

function showCharacters(characters) {
  cardContainer.innerHTML = characters.map(createCard).join("");
}

/**
 * Funcion para cargar todos los personajes de la API de Rick and Morty
 */
async function loadCharacters(url) {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  showCharacters(data.results);


  prevPage = data.info.prev;
  nextPage = data.info.next;

  prevButton.disabled = !prevPage;
  nextButton.disabled = !nextPage;

  const currentPage = Number(new URL(url).searchParams.get("page")) || 1;
  pageNumber.textContent = `Página ${currentPage} de ${data.info.pages}`;   ;
}


prevButton.addEventListener("click", () => {
  if (prevPage) {
    loadCharacters(prevPage);
  }});

nextButton.addEventListener("click", () => {
  if (nextPage) {
    loadCharacters(nextPage);
  }
});

loadCharacters(API);
