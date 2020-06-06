//At the top of the `liri.js` file, add code to read and set any environment variables with the dotenv package:
require("dotenv").config();
var Spotify = require("node-spotify-api");

//Add the code required to import the `keys.js` file and store it in a variable.
var keys = require("./keys.js");

//You should then be able to access your keys information like so
var spotify = new Spotify(keys.spotify);

//set up the role of each index in a node/liri call
var liriCommands = process.argv[2];
var userInput = process.argv[3];

switch (liriCommands) {
    case 'spotify-this-song':
        spotifyThisSong(userInput);
        break;

}

function spotifyThisSong(s) {
    if (s === undefined) {
        s = "I Saw The Sign, Ace of Base";
    }

    spotify
        .search({ type: 'track', query: s})
        .then(function(response){
            console.log(response);
        })
        .catch(function(err){
            console.log(err);
        })
}
