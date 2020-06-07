//At the top of the `liri.js` file, add code to read and set any environment variables with the dotenv package:
require("dotenv").config();
var Spotify = require("node-spotify-api");
var axios = require ("axios");
var moment = require("moment");
var fs = require("fs");

//Add the code required to import the `keys.js` file and store it in a variable.
var keys = require("./keys.js");

//You should then be able to access your keys information like so
var spotify = new Spotify(keys.spotify);
var bands = keys.bands;
var omdb = keys.omdb;

//set up the role of each index in a node/liri call
var liriCommands = process.argv[2];
var userInput = process.argv[3];

switch (liriCommands) {
    case 'spotify-this-song':
        spotifyThisSong(userInput);
        break;
    case 'concert-this':
        concertThis(userInput);
        break;
    case 'movie-this':
        movieThis(userInput);
        break;
    case 'do-what-it-says':
        doWhatItSays(userInput);
        break;
}

function spotifyThisSong(s) {
    if (s === undefined) {
        s = "I Saw The Sign, Ace of Base";
    }

    spotify
        .search({ type: 'track', query: s})
        .then(function(data){
            // console.log(data);
            for (var i=0; i<1; i++){
                console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
                console.log("Song name: " + data.tracks.items[0].name);
                console.log("Preview: " + data.tracks.items[0].external_urls.spotify);
                console.log("Album: " + data.tracks.items[0].album.name);
            }
        })
        .catch(function(err){
            console.error("Error occurred: " + err);
        })

}

function concertThis(artist) {
    
    axios({
        method: 'get',
        url: "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + bands.id
    })
    .then(function(response){
        for (var i=0; i<response.data.length; i++) {

            console.log("Venue: " + response.data[i].venue.name);
            console.log("Location: " + response.data[i].venue.location);
            var datetime = response.data[i].datetime;
            var unformatDate = datetime.split("T");//split the datetime AT where the T starts, then it will be an array of the date [0] followed by time [1]
            console.log("Date: " + moment(unformatDate[0]).format("MM-DD-YYYY"));
            console.log("-----------------------");
        }
    })
    .catch(function(error){
        console.log(error);
    })

}

function movieThis(movie) {
    if(!movie){
        movie = "Mr Nobody";
    }
    axios({
        method: 'get',
        url: "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + omdb.key
    })
    .then(function(response){
        console.log("Movie: " + response.data.Title);
        console.log("Released: " + response.data.Year);
        console.log("IMDb Rating: " + response.data.imdbRating);
        console.log("Rotten Tomatoes: " + response.data.Ratings[0]);
        console.log("Produced in: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Cast: " + response.data.Actors);
    })
    .catch(function(error){
        console.log(error);
    })
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data){
        if (error) {
            console.log(error);
            return
        }
        var dataSplit = data.split(",");
        if (dataSplit[0] === "spotify-this-song"){
            spotifyThisSong(dataSplit[1]);
        }
        else if (dataSplit[0] === "concert-this"){
            concertThis(dataSplit[1]);
        }
        else if (dataSplit[0] === "movie-this"){
            movieThis(dataSplit[1]);
        }
        
    });
        
}