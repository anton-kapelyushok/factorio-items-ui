import {
    RECIPE_PICKER_HIDE,
    RECIPE_PICKER_SHOW,
} from '../constants/actiontypes';


const defaultState =  {
    show: false,
    item: '',
    x: 0,
    y: 0,
    source: '',
    sourceSlot: undefined,
};

const recipeAddReducer  = (state = defaultState, action) => {
    switch(action.type) {
        case RECIPE_PICKER_HIDE:
            return { ...state, show: false, item: '', x: 0, y: 0 };
        case RECIPE_PICKER_SHOW:
            return {
                ...state,
                show: true,
                item: action.item,
                x: action.x,
                y: action.y,
                source: action.source,
                sourceSlot: action.sourceSlot,
            };
        default:
            return state;
    }
};


export default recipeAddReducer;
