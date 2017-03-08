import {
    FLOATING_ELEMENT_SHOW,
    FLOATING_ELEMENT_HIDE,
    FLOATING_ELEMENT_MOVE_RELATIVE,
} from '../constants/actiontypes';

const defaultState = {
    show: false,
    x: 0,
    y: 0,
    item: '',
};

const floatingElement = (state = defaultState, action) => {
    switch (action.type) {
        case FLOATING_ELEMENT_SHOW:
            return {
                ...state,
                x: action.x,
                y: action.y,
                item: action.item,
                show: true,
            };
        case FLOATING_ELEMENT_MOVE_RELATIVE:
            return {
                ...state,
                x: state.x + action.dx,
                y: state.y + action.dy,
            };
        case FLOATING_ELEMENT_HIDE:
            return {
                ...state,
                show: false,
                item: '',
                x: 0,
                y: 0,
            };
        default:
            return state;
    }
};

export default floatingElement;
