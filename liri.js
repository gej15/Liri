require("dotenv").config();
const axios = require('axios')
const keys = require("./keys.js")
const moment = require('moment')
let Spotify = require('node-spotify-api')
let fs = require("fs");

var spotify = new Spotify(keys.spotify);

// const spotify = new Spotify({
//     id: 'a0f34bc7ed214e0a965d72fabba75ea5',
//   secret: 'de182aa45aaa4f9ba3e895a8e9168976',
// })


let database = process.argv[2]
let search = process.argv.slice(3).join('+')

switch (database){
  case 'spotify-this-song':
    song()
    break

  case'concert-this':
    concert()
    break

   case 'movie-this': 
    movie()
    break

  case 'do-what-it-says':
    textFile()
    break 
}

// console.log(database)
// console.log(search)

function song(){
  // console.log('go')
  if (search === "") {
    search = 'the sign ace of base'
  }

  
  spotify.search({ type: 'track', query: search }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    // console.log(data.tracks.items[0]);
    console.log('-------------------------------')
    console.log('Artist: ' + data.tracks.items[0].artists[0].name + '\n')
    console.log('Song: ' + data.tracks.items[0].name + '\n')
    console.log('Link: ' + data.tracks.items[0].preview_url + '\n')
    console.log('Album: ' + data.tracks.items[0].album.name + '\n')
    console.log('-------------------------------')
  })
}

function concert() {
        let bandUrl = 'https://rest.bandsintown.com/artists/' + search + '/events?app_id=1e140eabdce95250b1ad6075934a113d'
        axios({
            method: 'get',
            url: bandUrl,
          })
            .then(function(response) {
              
              
              for (let i = 0; i < response.data.length; i++) {
                
                console.log(response.data[i].venue.name) 
                console.log(response.data[i].venue.city)
                console.log(moment(response.data[i].datetime).format('MM/DD/YYYY'))
                console.log('-----------------')
              }
            });
                   
}


function movie(){
  if (search === ""){
    console.log('If you haven\'t watched "Mr. Nobody," then you should: <http://www.imdb.com/title/tt0485947/>\nIt\'s on Netflix' )
  } else {
    let movieUrl = 'http://www.omdbapi.com/?apikey=trilogy&t=' +search
          axios({ 
              method: 'get',
              url: movieUrl,
            })
            .then(function (response) {
              console.log('Movie Title: ' + response.data.Title)
              console.log('Year: ' + response.data.Year)
              console.log('ImdbRating: ' + response.data.imdbRating)
              console.log('Metascore: ' + response.data.Metascore)
              console.log('Rotten Tomatoes: ' + response.data.Ratings[1].Value)
              console.log('Country: ' + response.data.Country)
              console.log('Language: ' + response.data.Language)
              console.log('Plot: ' + response.data.Plot)
              console.log('Actors: ' + response.data.Actors)
            })
  }            
}

function textFile(){
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }
    content = data.split(',')

    // console.log(content[0])
    // console.log(content[1])

    database = content[0]
    search = content[1]
    
    switch (database){

      case 'spotify-this-song':
        song()
        break
    
      case'concert-this':
        concert()
        break
    
       case 'movie-this': 
        movie()
        break
    
      case 'do-what-it-says':
        textFile()
        break 
    }
  })
  
} 