function getMovies(searchText){
    let query='http://www.omdbapi.com/?apikey=7408dc63&s='+searchText;
    fetch(query).then(function(response){
    sessionStorage.setItem("query", searchText);
    return response.json()
}).then(function(json){
   sessionStorage.setItem("result",JSON.stringify(json));
   renderresults(json);
  });
}

window.onload = function() {
  if (window.location.href.indexOf("#") > -1) {
      renderresults(JSON.parse(sessionStorage.getItem("result")));
      document.getElementById('searchText').value = sessionStorage.getItem("query") || ""
  }
}


function movieSelected(id) {                                                                 //to get the IMDB ID for selected movie
  sessionStorage.setItem('movieId', id);
  window.location = 'movie.html';
  return false;
}

var input = document.getElementById("searchText");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    let searchText = document.getElementById("searchText").value;
    getMovies(searchText);
  }
});

function getMovie(){                                                                                  //detailed view of each movie
  let movieId = sessionStorage.getItem('movieId');   
    fetch('http://www.omdbapi.com?apikey=7408dc63&i='+movieId).then(function(response){
    return response.json()
  }).then(function(json){
      let output =`
        <div class="row">
          <div class="col-md-4">
            <img src="${json.Poster}" class="thumbnail">
          </div>
          <div class="col-md-8">
            <h2>${json.Title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre:</strong> ${json.Genre}</li>
              <li class="list-group-item"><strong>Released:</strong> ${json.Released}</li>
              <li class="list-group-item"><strong>Rated:</strong> ${json.Rated}</li>
              <li class="list-group-item"><strong>IMDB Rating:</strong> ${json.imdbRating}</li>
              <li class="list-group-item"><strong>Director:</strong> ${json.Director}</li>
              <li class="list-group-item"><strong>Writer:</strong> ${json.Writer}</li>
              <li class="list-group-item"><strong>Actors:</strong> ${json.Actors}</li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="well">
            <h3>Plot</h3>
            ${json.Plot}
            <hr>
            <a href="http://imdb.com/title/${json.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
            <a href="index.html#">go back to search</button>
          </div>
        </div>
      `;
      document.getElementById('movie').innerHTML=output;
    })
}

function renderresults(json)                                                                //to display all the movies which are related to the search text
{
  let output = '';
  if(json.Search==null)alert("No Movie found");
  json.Search.forEach(function(item){   
       output += `
          <div class="col-md-3">
            <div class="well text-center">
              <img src="${item.Poster}">
              <h5 style="color:white">${item.Title}</h5>
              <a onclick="movieSelected('${item.imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
            </div>
          </div>
        `;
    });
    setTimeout(function(){
    document.getElementById('movies').innerHTML=output;},1000);
}