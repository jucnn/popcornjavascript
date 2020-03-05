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

  const mainNav = document.querySelector("header nav");

  ////Favorite

  // Fonctions

  const checkUserToken = token => {
    return new Promise((resolve, reject) => {
      fetch(`${apiURL}/api/me/${token}`)
        .then(response => {
          return response.ok ? response.json() : "Response not OK";
        })
        .then(jsonData => resolve(jsonData))
        .catch(err => reject(err));
    });
  };

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

  const getFavorite = () => {
    const favoriteButton = document.querySelector("#favoriteButton");

    favoriteButton.addEventListener("click", event => {
      event.preventDefault();
      let movieId = favoriteButton.getAttribute("favorite-id");
      let movieName = favoriteButton.getAttribute("favorite-name");

      const dataFavorite = {
        author: localStorage.getItem("author"),
        id: movieId,
        name: movieName
      };

      console.log(dataFavorite);
      fetchForm("favorite", dataFavorite);
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
        if (endpoint != "favorite") {
          let author = jsonData.data.identity._id;
          localStorage.setItem("author", author);
          console.log(jsonData);
        } else {
          console.log(jsonData);
        }
      })
      .catch(err => console.error(err));
  };

  const getSearchSubmit = () => {
    searchForm.addEventListener("submit", event => {
      event.preventDefault();

      searchData.value.length > 0
        ? fetchMovie(searchData.value)
        : displayError(searchData, "Minimum 1 caractère couillon");
    });
  };

  const displayError = (tag, msg) => {
    searchLabel.textContent = msg;
    tag.addEventListener("focus", () => (searchLabel.textContent = ""));
  };

  const fetchMovie = (keywords, index = 1) => {
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
        fetchMovie(+link.getAttribute("movie-id"));
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
            <button id="favoriteButton" favorite-name="${data.original_title}" favorite-id="${data.id}">Favoris</button>
            <button id="closeButton"> Close </button>

        </div>
        `;

    moviePopin.parentElement.classList.add("open");
    closePopin(document.querySelector("#closeButton"));
    getFavorite();
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

  const displayNav = pseudo => {
    mainNav.innerHTML = `
            <h1>Hello ${pseudo}</h1>
            <button>Home</button>
            <button>Favorite</button>
            <button id="buttonLogout">Logout</button>
        `;

    mainNav.classList.remove("hidden");

    document.querySelector("#buttonLogout").addEventListener("click", () => {
      localStorage.clear();
      document.querySelector("header nav").innerHTML = "";
      registerForm.classList.remove("hidden");
      loginForm.classList.remove("hidden");
    });
  };

  getSearchSubmit();

  getFormRegister();

  getFormLogin();

  if (localStorage.getItem("author") !== null) {
    checkUserToken(localStorage.getItem("author"))
      .then(response => {
        console.log(response);
        registerForm.classList.add("hidden");
        loginForm.classList.add("hidden");
        displayNav(response.data.user.pseudo);
      })
      .catch(err => console.log(err));
  }
});
