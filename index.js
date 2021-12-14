class Pelicula {
  constructor(imdbID, Title, Year, Released, Genre, Poster, Type, Plot) {
    this.imdbID = imdbID;
    this.Title = Title;
    this.Year = Year;
    this.Released = Released;
    this.Genre = Genre;
    this.Poster = Poster;
    this.Type = Type;
    this.Plot = Plot;
  }
}

const KEY = "d01a6bb8";
const URL = "http://www.omdbapi.com/";

const getPelicula = async (data, type, page = 1) => {
  switch (type) {
    case "":
      resp = await axios(`${URL}?apikey=d01a6bb8&s=${data}&page=${page}`);
      return [resp.data.Search, resp.data.totalResults];

    case "series":
      resp = await axios(
        `${URL}?apikey=d01a6bb8&s=${data}&type=${type}&page=${page}`
      );
      return [resp.data.Search, resp.data.totalResults];

    case "movie":
      resp = await axios(
        `${URL}?apikey=d01a6bb8&s=${data}&type=${type}&page=${page}`
      );
      return [resp.data.Search, resp.data.totalResults];
  }
};

const mensaje = (msj) => {
  const mensaje = document.createElement("div");
  const clase = document.createAttribute("class");
  clase.value = "mensaje";

  mensaje.setAttributeNode(clase);
  mensaje.innerHTML = `
        <h1>
        ${msj}
        </h1>
    `;

  return mensaje;
};

const card = (movie) => {
  const sinFoto =
    "https://www.pequenomundo.cl/wp-content/themes/childcare/images/default.png";
  const card = document.createElement("div");
  const clase = document.createAttribute("class");
  clase.value = "card";
  card.setAttributeNode(clase);

  card.innerHTML = `
    <img src='${movie.Poster === "N/A" ? sinFoto : movie.Poster}' alt="" />
        <div class="card-footer">
            <div class="title">
                <p>${movie.Title}</p>
            </div>
            <span class="year">${movie.Year}</span>
            <span class="type">${movie.Type}</p>
        </div>`;

  return card;
};

const paginacion = (inicio, fin) => {
  const div = document.createElement("div");

  div.innerHTML = `
        <ul>
            <li class="menos" id="menos">&laquo;</li>
            <li class="mas" id="mas">&raquo;</li>
          </ul>

        <div class="cantidad">
          <span id="inicio">${inicio}</span> / <span id="final"> ${fin}</span>
        </div>
    `;

  return div;
};

const todo = (input, type, page = 1) => {
  getPelicula(input, type, page)
    .then((movies) => {
      console.log(movies[1] / 10);
      movies[0].map((movie) => {
        resultados.appendChild(card(movie));
      });

      navegacion.appendChild(paginacion(page, Math.round(movies[1] / 10)));

      if (page >= 1) {
        document.getElementById("menos").addEventListener("click", () => {
          resultados.innerHTML = "";
          navegacion.innerHTML = "";

          todo(input, type, page - 1);
        });
      }
      if (page <= Math.round(movies[1] / 10)) {
        document.getElementById("mas").addEventListener("click", () => {
          resultados.innerHTML = "";
          navegacion.innerHTML = "";
          todo(input, type, page + 1);
        });
      }
    })
    .catch((err) => {
      resultados.removeAttribute("class");
      resultados.appendChild(
        mensaje(`No se encontraron resultados para su busqueda "${input}"`)
      );
    });
};

document.getElementById("buscar").addEventListener("click", (e) => {
  e.preventDefault();

  const resultados = document.getElementById("resultados");
  const navegacion = document.getElementById("navegacion");
  const form = document.getElementById("form");
  const input = form["input"].value.trim();
  const type = form["type"].value.trim();

  resultados.innerHTML = "";
  navegacion.innerHTML = "";

  if (input.length < 3) {
    resultados.removeAttribute("class");
    resultados.appendChild(
      mensaje("Realiza tu busqueda Ingresa mas de 3 letras")
    );
  } else {
    const clase1 = document.createAttribute("class");
    clase1.value = "resultados";
    resultados.setAttributeNode(clase1);

    todo(input, type);
  }
});
