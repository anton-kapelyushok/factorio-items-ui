import {
    FACTORIO_DATA_LOADED,
    FACTORIO_DATA_FETCH_STARTED,
    FACTORIO_DATA_FETCHING_FAILED,
} from '../constants/actiontypes';

import {
    INITIAL,
    LOADED,
    LOADING,
    FAILED,
} from '../constants/fetchstatus';

const defaultState = {
    recipes: [],
    items: [],
    status: INITIAL,
};

const data = (state = defaultState, action) => {
    switch (action.type) {
        case FACTORIO_DATA_LOADED:
            return {
                ...state,
                status: LOADED,
                recipes: action.recipes,
                items: action.items,
            };
        case FACTORIO_DATA_FETCH_STARTED:
            return {
                ...state,
                status: LOADING,
                recipes: [],
                items: [],
            };
        case FACTORIO_DATA_FETCHING_FAILED:
            return {
                ...state,
                status: FAILED,
            };
        default:
            return state;
    }
};

export default data;
