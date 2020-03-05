// Attendre chargement du DOM

document.addEventListener("DOMContentLoaded", () => {
  // Déclarations

  const searchForm = document.querySelector("#searchForm");
  const searchLabel = document.querySelector("header form span");
  const searchData = document.querySelector('[name="searchData"]');
  const themoviedbURL =
    "https://api.themoviedb.org/3/search/movie?api_key=464a7d69bc5f4b413e3ad6556a134bc2&query=";
  const apiURL = "https://api.dwsapp.io/";

  const movieList = document.querySelector("#movieList");
  const moviePopin = document.querySelector("#moviePopin article");

  ////Register Form
  const registerForm = document.querySelector("#registerForm");
  const userEmail = document.querySelector("#userEmail");
  const userPassword = document.querySelector("#userPassword");
  const userName = document.querySelector("#userName");

  ////Login Form
  const loginForm = document.querySelector("#loginForm");
  const userEmailLogin = document.querySelector("#userEmailLogin");
  const userPasswordLogin = document.querySelector("#userPasswordLogin");


  // Fonctions

  const getFormRegister = () => {
    registerForm.addEventListener("submit", event => {
      event.preventDefault();

      let formError = 0;

      if (userEmail.value.length < 5) {
        formError++;
      }
      if (userPassword.value.length < 5) {
        formError++;
      }
      if (userName.value.length < 2) {
        formError++;
      }

      formError != 0
        ? console.log("Error")
        : fetchForm("register", {
            email: userEmail.value,
            password: userPassword.value,
            pseudo: userName.value
          });
    });
  };

  const getFormLogin = () => {
    loginForm.addEventListener("submit", event => {
      event.preventDefault();

      fetchForm("login", {
        email: userEmailLogin.value,
        password: userPasswordLogin.value
      });
    });
  };

  const fetchForm = (endpoint, data) => {
    let url = `${apiURL}/api/${endpoint}`;

    let requestHeader = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    fetch(url, requestHeader)
      .then(response => {
        return response.ok ? response.json() : "Response not OK";
      })
      .then(jsonData => {
        console.log(jsonData);
      })
      .catch(err => console.error(err));
  };

  const getSearchSubmit = () => {
    searchForm.addEventListener("submit", event => {
      event.preventDefault();

      searchData.value.length > 0
        ? fetchFunction(searchData.value)
        : displayError(searchData, "Minimum 1 caractère couillon");
    });
  };

  const displayError = (tag, msg) => {
    searchLabel.textContent = msg;
    tag.addEventListener("focus", () => (searchLabel.textContent = ""));
  };

  const fetchFunction = (keywords, index = 1) => {
    let fetchURL = null;

    typeof keywords === "number"
      ? (fetchURL = `https://api.themoviedb.org/3/movie/${keywords}?api_key=464a7d69bc5f4b413e3ad6556a134bc2`)
      : (fetchURL = themoviedbURL + keywords + "&page=" + index);

    fetch(fetchURL)
      .then(response => {
        return response.ok ? response.json() : "Response not OK";
      })
      .then(jsonData => {
        typeof keywords === "number"
          ? displayMoviePopin(jsonData)
          : displayMovieList(jsonData.results);
      })
      .catch(err => console.error(err));
  };

  const displayMovieList = collection => {
    // for( let item of collection ) {

    // }

    // collection.map ( item => {

    // })
    searchData.value = "";
    movieList.innerHTML = "";

    for (let i = 0; i < collection.length; i++) {
      movieList.innerHTML += `
                <article>
                    <figure>
                    <img src="https://image.tmdb.org/t/p/w300/${collection[i].poster_path}"
                    alt="${collection[i].original_title}">
                        <figcaption movie-id="${collection[i].id}">${collection[i].original_title} (voir plus >) </figcaption> 
                    </figure>
                    <div class="overview">
                        <div>
                            <p>${collection[i].overview}</p>
                            <button>Voir le film</button>
                        </div>
                    </div>
                </article>
            `;
    }

    getPopinLink(document.querySelectorAll("figcaption"));
  };

  const getPopinLink = linkCollection => {
    for (let link of linkCollection) {
      link.addEventListener("click", () => {
        // + equal to Parse Int or Parse Float
        fetchFunction(+link.getAttribute("movie-id"));
      });
    }
  };

  const displayMoviePopin = data => {
    console.log(data);
    moviePopin.innerHTML = `
        <div>
            <img src="https://image.tmdb.org/t/p/w500/${data.poster_path}" alt="${data.original_title}" >
        </div>
        <div>
            <h2> ${data.original_title} </h2>
            <p>${data.overview}</p>
            <button>Voir en streaming</button>
            <button id="closeButton"> Close </button>

        </div>
        `;

    moviePopin.parentElement.classList.add("open");
    closePopin(document.querySelector("#closeButton"));
  };

  const closePopin = button => {
    button.addEventListener("click", () => {
      button.parentElement.parentElement.parentElement.classList.add("close");
      setTimeout(() => {
        button.parentElement.parentElement.parentElement.classList.remove(
          "open"
        );
        button.parentElement.parentElement.parentElement.classList.remove(
          "close"
        );
      }, 300);
    });
  };

  getSearchSubmit();

  getFormRegister();

  getFormLogin();
});
