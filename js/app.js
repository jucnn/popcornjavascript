// Attendre chargement du DOM

document.addEventListener('DOMContentLoaded', () => {

    // Déclarations

    const searchForm = document.querySelector('header form');
    const searchLabel = document.querySelector('header form span')
    const searchData = document.querySelector('[name="searchData"]');
    const themoviedbURL = 'https://api.themoviedb.org/3/search/movie?api_key=464a7d69bc5f4b413e3ad6556a134bc2&query=';
    const movieList = document.querySelector('#movieList');
    const moviePopin = document.querySelector('#moviePopin article')


    // Fonctions

    const getSearchSubmit = () => {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();

            searchData.value.length > 0 ? fetchFunction(searchData.value) : displayError(searchData, 'Minimum 1 caractère couillon');
        });
    };

    const displayError = (tag, msg) => {
        searchLabel.textContent = msg;
        tag.addEventListener('focus', () => searchLabel.textContent = '');
    };

    const fetchFunction = (keywords, index = 1) => {
        let fetchURL = null;

        typeof keywords === 'number'
        ? fetchURL = `https://api.themoviedb.org/3/movie/${keywords}?api_key=464a7d69bc5f4b413e3ad6556a134bc2`
        : fetchURL = themoviedbURL + keywords + '&page=' + index;

        fetch( fetchURL )
            .then(response => {
                return response.ok 
                ? response.json() 
                : 'Response not OK';
            })
            .then(jsonData => {
                typeof keywords === 'number' 
                ? displayMoviePopin(jsonData)
                : displayMovieList(jsonData.results)
            })
            .catch(err => console.error(err));
    }

    //fetchFunction replace getMovieList and getMovieDetails

    // const getMovieList = (keywords, index = 1) => {
    //     fetch(themoviedbURL + keywords + '&page=' + index)
    //         .then(response => {
    //             return response.ok ? response.json() : 'Response not OK';
    //         })
    //         .then(jsonData => {
    //             displayMovieList(jsonData.results);
    //         })
    //         .catch(err => console.error(err));
    // };

    // const getMovieDetails = (id) => {
    //     // https: //api.themoviedb.org/3/movie/<ID>?api_key=<KEY>
    //     fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=464a7d69bc5f4b413e3ad6556a134bc2`)
    //         .then(response => {
    //             return response.ok ? response.json() : 'Response not OK';
    //         })
    //         .then(jsonData => {
    //             displayMoviePopin(jsonData);
    //         })
    //         .catch(err => console.error(err));
    // }

    const displayMovieList = collection => {

        // for( let item of collection ) {

        // }

        // collection.map ( item => {

        // })
        searchData.value = '';
        movieList.innerHTML = '';

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
            `
        };

        getPopinLink(document.querySelectorAll('figcaption'));

    };

    const getPopinLink = (linkCollection) => {
        for (let link of linkCollection) {
            link.addEventListener('click', () => {
                fetchFunction(+link.getAttribute('movie-id'));
            });
        };
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
        `

        moviePopin.parentElement.classList.add('open');
        closePopin(document.querySelector('#closeButton'))
    }

    const closePopin = button => {
        button.addEventListener('click', () => {
            button.parentElement.parentElement.parentElement.classList.add('close');
            setTimeout(() => {
                button.parentElement.parentElement.parentElement.classList.remove('open');
                button.parentElement.parentElement.parentElement.classList.remove('close');
            }, 300)
        })
    }


    getSearchSubmit();

})