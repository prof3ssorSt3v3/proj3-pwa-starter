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
  sw: null,
  init() {
    //register service worker
    if ('serviceWorker' in navigator) {
      //listen for controllerchange events
      //listen for message events
    }
    //open the database

    //run the pageLoaded function

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
  },
  addListeners() {
    //listen for on and off line events

    //listen for Chrome install prompt
    //handle the deferredPrompt

    //listen for sign that app was installed
    window.addEventListener('appinstalled', (evt) => {
      console.log('app was installed');
    });
    //listen for submit of the search form

    //listen for the click of movie div
    //to handle clicks of the suggest a movie buttons
  },
  sendMessage(msg, target) {
    //send a message to the service worker
  },
  onMessage() {
    //message received from service worker
  },
  startSearch(keyword) {
    //check in IDB for movie results
    //if no matches make a fetch call to TMDB API
    //or make the fetch call and intercept it in the SW
  },
  startSuggest({ mid, ref }) {
    //Do the search of IndexedDB for matches
    //if no matches to a fetch call to TMDB API
    //or make the fetch call and intercept it in the SW
  },
  getData: (url, callback) => {
    //shared function for making API fetch calls
  },
  loadSuggestedResults(ref) {
    //after getting fetch/db results
    //display reference movie name in title
    //then call buildList
  },
  loadSearchResults(key) {
    //after getting fetch/db results
    //display search keyword in title
    //then call buildList
  },
  buildList: (movies) => {
    //build the list of cards inside the current page
  },
  openDB() {
    //open the indexedDB
    //upgradeneeded listener
    //success listener
    //error listener
  },
};

document.addEventListener('DOMContentLoaded', APP.init);
