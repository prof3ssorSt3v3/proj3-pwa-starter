const APP = {
  BASE_URL: 'https://api.themoviedb.org/3/',
  IMG_URL: 'https://image.tmdb.org/t/p/',
  backdrop_sizes: ['w300', 'w780', 'w1280', 'original'],
  logo_sizes: ['w45', 'w92', 'w154', 'w185', 'w300', 'w500', 'original'],
  poster_sizes: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
  profile_sizes: ['w45', 'w185', 'h632', 'original'],
  still_sizes: ['w92', 'w185', 'w300', 'original'],
  API_KEY: 'your-api-key-goes-here',
  isOnline: 'onLine' in navigator && navigator.onLine,
  isStandalone: false,
  sw: null, //your service worker
  db: null, //your database
  dbVersion: 1,
  init() {
    //register service worker
    if ('serviceWorker' in navigator) {
      //listen for controllerchange events
      //listen for message events
    }
    //open the database
    APP.openDB();

    //run the pageLoaded function
    APP.pageLoaded();

    //add UI listeners
    APP.addListeners();

    //check if the app was launched from installed version
    if (navigator.standalone) {
      // console.log('Launched: Installed (iOS)');
      APP.isStandalone = true;
    } else if (matchMedia('(display-mode: standalone)').matches) {
      // console.log('Launched: Installed');
      APP.isStandalone = true;
    } else {
      // console.log('Launched: Browser Tab');
      APP.isStandalone = false;
    }
  },
  pageLoaded() {
    //page has just loaded and we need to check the queryString
    //based on the querystring value(s) run the page specific tasks
    // console.log('page loaded and checking', location.search);
    let params = new URL(document.location).searchParams;
    let keyword = params.get('keyword');
    if (keyword) {
      //means we are on results.html
      console.log(`on results.html - startSearch(${keyword})`);
      APP.startSearch(keyword);
    }
    let mid = parseInt(params.get('movie_id'));
    let ref = params.get('ref');
    if (mid && ref) {
      //we are on suggest.html
      console.log(`look in db for movie_id ${mid} or do fetch`);
      APP.startSuggest({ mid, ref });
    }
  },
  addListeners() {
    //TODO:
    //listen for on and off line events

    //TODO:
    //listen for Chrome install prompt
    //handle the deferredPrompt

    //listen for sign that app was installed
    window.addEventListener('appinstalled', (evt) => {
      console.log('app was installed');
    });

    //listen for submit of the search form
    let searchForm = document.searchForm;
    if (searchForm) {
      document.searchForm.addEventListener('submit', (ev) => {
        ev.preventDefault();
        //build the queryString and go to the results page
        let searchInput = document.getElementById('search');
        let keyword = searchInput.value.trim();
        if (keyword) {
          let base = location.origin;
          let url = new URL('./results.html', base);
          url.search = '?keyword=' + encodeURIComponent(keyword);
          location.href = url;
        }
      });
    }

    //listen for the click of movie div
    //to handle clicks of the suggest a movie buttons
    let movies = document.querySelector('.movies');
    if (movies) {
      //navigate to the suggested page
      //build the queryString with movie id and ref title
      movies.addEventListener('click', (ev) => {
        ev.preventDefault();
        let anchor = ev.target;
        if (anchor.tagName === 'A') {
          let card = anchor.closest('.card');
          let title = card.querySelector('.card-title span').textContent;
          let mid = card.getAttribute('data-id');
          let base = location.origin;
          let url = new URL('./suggest.html', base);
          url.search = `?movie_id=${mid}&ref=${encodeURIComponent(title)}`;
          location.href = url;
        }
      });
    }
  },
  sendMessage(msg, target) {
    //TODO:
    //send a message to the service worker
  },
  onMessage({ data }) {
    //TODO:
    //message received from service worker
  },
  startSearch(keyword) {
    //TODO: check in IDB for movie results
    if (keyword) {
      //check the db
      //if no matches make a fetch call to TMDB API
      //or make the fetch call and intercept it in the SW
      let url = `${APP.BASE_URL}search/movie?api_key=${APP.API_KEY}&query=${keyword}`;

      APP.getData(url, (data) => {
        //this is the CALLBACK to run after the fetch
        APP.results = data.results;
        APP.useSearchResults(keyword);
      });
    }
  },
  useSearchResults(keyword) {
    //after getting fetch or db results
    //display search keyword in title
    //then call buildList
    let movies = APP.results;
    let keywordSpan = document.querySelector('.ref-keyword');
    if (keyword && keywordSpan) {
      keywordSpan.textContent = keyword;
    }
    APP.buildList(movies);
  },
  startSuggest({ mid, ref }) {
    //TODO: Do the search of IndexedDB for matches
    //if no matches to a fetch call to TMDB API
    //or make the fetch call and intercept it in the SW

    let url = `${APP.BASE_URL}movie/${mid}/similar?api_key=${APP.API_KEY}&ref=${ref}`;
    //TODO: choose between /similar and /suggested endpoints from API

    APP.getData(url, (data) => {
      //this is the callback that will be used after fetch
      APP.suggestedResults = data.results;
      APP.useSuggestedResults(ref);
    });
  },
  useSuggestedResults(ref) {
    //after getting fetch/db results
    //display reference movie name in title
    //then call buildList
    let movies = APP.suggestedResults;
    let titleSpan = document.querySelector('#suggested .ref-movie');
    console.log('ref title', ref);
    if (ref && titleSpan) {
      titleSpan.textContent = ref;
    }
    APP.buildList(movies);
  },
  getData: async (url, cb) => {
    fetch(url)
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        } else {
          let msg = resp.statusText;
          throw new Error(`Could not fetch movies. ${msg}.`);
        }
      })
      .then((data) => {
        //callback
        cb(data);
      })
      .catch((err) => {
        console.warn(err);
        cb({ code: err.code, message: err.message, results: [] });
      });
  },
  buildList: (movies) => {
    //build the list of cards inside the current page
    console.log(`show ${movies.length} cards`);
    let container = document.querySelector(`.movies`);
    //TODO: customize this HTML to make it your own
    if (container) {
      if (movies.length > 0) {
        container.innerHTML = movies
          .map((obj) => {
            let img = './img/icon-512x512.png';
            if (obj.poster_path != null) {
              img = APP.IMG_URL + 'w500/' + obj.poster_path;
            }
            return `<div class="card hoverable large" data-id="${obj.id}">
          <div class="card-image">
            <img src="${img}" alt="movie poster" class="notmaterialboxed"/>
            </div>
          <div class="card-content activator">
            <h3 class="card-title"><span>${obj.title}</span><i class="material-icons right">more_vert</i></h3>
          </div>
          <div class="card-reveal">
            <span class="card-title grey-text text-darken-4">${obj.title}<i class="material-icons right">close</i></span>
            <h6>${obj.release_date}</h6>
            <p>${obj.overview}</p>
          </div>
          <div class="card-action">
            <a href="#" class="find-suggested light-blue-text text-darken-3">Show Similar<i class="material-icons right">search</i></a>
          </div>
        </div>`;
          })
          .join('\n');
      } else {
        //no cards
        container.innerHTML = `<div class="card hoverable">
          <div class="card-content">
            <h3 class="card-title activator"><span>No Content Available.</span></h3>
          </div>
        </div>`;
      }
    }
  },
  openDB() {
    //TODO:
    //open the indexedDB
    //upgradeneeded listener
    //success listener
    //save db reference as APP.db
    //error listener
  },
};

document.addEventListener('DOMContentLoaded', APP.init);
