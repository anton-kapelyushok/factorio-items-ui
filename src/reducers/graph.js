import {
    RECIPE_TREE_ITEM_ADDED,
    RECIPE_TREE_ITEM_MOVED,
    RECIPE_TREE_LINK_CREATED,
    RECIPE_TREE_LAYOUT_CHANGED,
    RECIPE_TREE_CLIENT_RECT_UPDATED,
} from '../constants/actiontypes';


const defaultState = {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    links: [],
    items: [],
    width: 0,
    height: 0,
    left: 0,
    top: 0,
};

const graph = (state = defaultState, action) => {
    switch (action.type) {
        case RECIPE_TREE_LAYOUT_CHANGED:
            return {
                ...state,
                offsetX: action.offsetX,
                offsetY: action.offsetY,
                scale: action.scale,
            };
        case RECIPE_TREE_CLIENT_RECT_UPDATED:
            return {
                ...state,
                width: action.width,
                height: action.height,
                left: action.left,
                top: action.top,
            };
        case RECIPE_TREE_ITEM_ADDED:
            return {
                ...state,
                items: [ ...state.items, {
                    x: action.x,
                    y: action.y,
                    name: action.name,
                    type: action.recipeType,
                    count: 0,
                }],
            };
        case RECIPE_TREE_ITEM_MOVED:
            const items = [...state.items];
            items[action.index] = {...items[action.index] };
            items[action.index].x += action.dx;
            items[action.index].y += action.dy;

            return {
                ...state,
                items,
            };
        case RECIPE_TREE_LINK_CREATED:
            const links = [...state.links, {
                from: action.from,
                to: action.to
            }];
            return {
                ...state,
                links,
            };
        default:
            return state;
    }
};

export default graph;
