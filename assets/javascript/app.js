$(document).ready(function() {
  random_bg_color();
  $("body, html").on("load", function() {
      random_bg_color();
  });
});

var bgColors = ["46,139,87", "30,144,255", "60,179,113" , "255,0,255", "245,176,203", "220,106,207", 
                "212,77,92", "148, 197, 204", "180, 210, 231", "169, 206, 244", "34, 174, 209", 
                "175, 169, 141", "105, 153, 93", "132, 192, 198", "70, 177, 201", "207, 142, 128", 
                "60, 136, 110", "239, 136, 227", "103, 142, 54", "221, 162, 79", "193, 77, 148",
                "160, 157, 165", "87, 222, 193", "27, 173, 196", "240, 153, 81", "48, 197, 136", 
                "3, 198, 214"];

function random_bg_color() {
  var randomColor = bgColors[Math.floor(Math.random()*bgColors.length)];
  $("body, html").css("background-color", "rgb(" + randomColor + ")");
};

// Initialize Firebase
var config = {
  apiKey: firebaseKey,
  authDomain: "foodflix-9170b.firebaseapp.com",
  databaseURL: "https://foodflix-9170b.firebaseio.com",
  projectId: "foodflix-9170b",
  storageBucket: "foodflix-9170b.appspot.com",
  messagingSenderId: "471943646046"
};

firebase.initializeApp(config);

var database = firebase.database();
var auth = firebase.auth();

// Setup materialize Components. This will call the modals when the buttons are clicked
document.addEventListener("DOMContentLoaded", function () {
  var modals = document.querySelectorAll(".modal");
  M.Modal.init(modals);
});

// Listen fro auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    setupUI(user);
  } else {
    setupUI();
  }
});

var loggedOutLinks = document.querySelectorAll(".logged-out");
var loggedInLinks = document.querySelectorAll(".logged-in");

var setupUI = user => {
  if (user) {
    // toggle UI elements
    loggedInLinks.forEach(item => (item.style.display = "block"));
    loggedOutLinks.forEach(item => (item.style.display = "none"));
  } else {
    // toggle UI elements
    loggedInLinks.forEach(item => (item.style.display = "none"));
    loggedOutLinks.forEach(item => (item.style.display = "block"));
  }
};

// Authentication Signup
var signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", e => {
  e.preventDefault();
  // Get user info
  var email = $("#signup-email")
    .val()
    .trim();
  var password = $("#signup-password")
    .val()
    .trim();

  // Sign Up User In firebase
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    var modal = document.querySelector("#modal-signup");
    M.Modal.getInstance(modal).close();
    signupForm.reset();
  });
});

// Log User Out
var logout = document.querySelector("#logout");
logout.addEventListener("click", e => {
  e.preventDefault();
  auth.signOut();
});

// User Login
var loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  // Get User Info
  var email = $("#login-email")
    .val()
    .trim();
  var password = $("#login-password")
    .val()
    .trim();

  auth.signInWithEmailAndPassword(email, password).then(cred => {
    // close the login modal and reset the form
    var modal = document.querySelector("#modal-login");
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });
});

//Function to search receipe API
function searchRecipes() {
  var itemSearch = $(".uk-search-input")
    .val()
    .trim();
  var queryURL =
    "https://api.edamam.com/search?q=" +
    itemSearch +
    "&app_id=" +
    edamamKey.danielID +
    "&app_key=" +
    edamamKey.danielKey;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response);
    for (var i = 0; i < 5; i++) {
      var label = response.hits[i].recipe.label;
      var recipe = $(".recipes");
      var newRecipe =
      "<ul class='collapsible'>" +
      "<li>" +
      "<div class='collapsible-header' style='background:transparent; font-family: Rajdhani, sans-serif'>" + label + "</div>" +
      `<div class='collapsible-body' style='font-family: Rajdhani, sans-serif;'><span class='span span${i}'></span></div>` +
      "</li>" +
      "</ul>"

      recipe.append(newRecipe);
      M.AutoInit();
    
    
      for (var j = 0; j <= response.hits[i].recipe.ingredientLines.length - 1; j++) {
        var ingredients = response.hits[i].recipe.ingredientLines[j];
        if (i == 0) console.log(ingredients);

        var span = $(`.span${i}`);

        span.append(ingredients);
        // added line break for each ingredient
        span.append(ingredients + "<br>");

      }
    };
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.collapsible');
  M.Collapsible.init(elems);
});

//Click listener to search both APIs at the same time
$(".uk-search-icon-flip").on("click", function (event) {
  event.preventDefault();
  searchRecipes();
  searchMovie();

  //Clears the search field on enter/click
  $(".uk-search-input").val("");
});

function searchMovie() {
  
  if($("input[type='radio'].with-gap").is(':checked')) {
    var genreSearch = $("input[type='radio'].with-gap:checked").val();
  }

  var queryURL =
    "https://api.themoviedb.org/3/discover/movie?api_key=" +
    tmdbKey.danielkey +
    "&language=en-US&with_genres=" +
    genreSearch +
    "&include_adult=false&sort_by=vote_count.desc"

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response);

    var randomIndex = [Math.floor(Math.random() * response.results.length)];
    var randomMovie = response.results[randomIndex].title;
    var moviePoster = "<img src='https://image.tmdb.org/t/p/w500" + response.results[randomIndex].poster_path + "'/>"
    console.log(randomMovie);
    console.log(moviePoster);

    $(".movie").append(randomMovie + "<br>");
    $(".movie").append(moviePoster + "<br> <br>");

  });
}