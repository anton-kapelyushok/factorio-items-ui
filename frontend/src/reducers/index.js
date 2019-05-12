import { combineReducers } from 'redux';

import data from './data';
import graph from './graph';
import recipeAdder from './recipeadder';
import floatingElement from './floatingelement';

const reducer = combineReducers({
    data,
    graph,
    recipeAdder,
    floatingElement,
});

export default reducer;
