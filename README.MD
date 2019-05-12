#### Recipe planner for games with recipes

(higly coupled with factorio for now)

###### How to start:
1. install Factorio
1. run `npm install` in `factorio-server` and in `frontend`
1. specify correct path to Factorio in `factorioPath` variable
1. run `node index.js` in `factorio-server`
1. run `npm start` in `frontend`
1. you are beautiful 

###### How to use:
1. move items to from the left palette to the canvas
    * you can also add recipe by adding connection to canvas
1. connect input and output slots of the recipes
1. press `F12` and type `solve()` in console
1. something cool will happen
1. you are still beautiful

###### Other stuff:
1. there is `factorio-items` package that does some magic for extracting data from Factorio, I don't know how it works
1. there was some attempt to run it in Electron, i didn't add it because it was not interesting, may be I will do it some time

###### TODO:
does anyone care? ok

* ui for solve
* generic data sources
* ui for adding new datasources 
* autofill graph
* add topographical sorting
* ui for items count
* ui for removing recipes from canvas
* save/load canvases
* sexy ui
