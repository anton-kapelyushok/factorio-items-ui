import _ from 'lodash';

import {
    RECIPE_TREE_ITEM_ADDED,
    RECIPE_TREE_ITEM_MOVED,
    RECIPE_TREE_LINK_CREATED,
    RECIPE_TREE_LAYOUT_CHANGED,
    RECIPE_TREE_CLIENT_RECT_UPDATED,
    RECIPE_TREE_COUNTS_UPDATED,

    FACTORIO_DATA_FETCH_STARTED,
    FACTORIO_DATA_LOADED,
    FACTORIO_DATA_FETCHING_FAILED,

    RECIPE_PICKER_HIDE,
    RECIPE_PICKER_SHOW,

    FLOATING_ELEMENT_SHOW,
    FLOATING_ELEMENT_MOVE_RELATIVE,
    FLOATING_ELEMENT_HIDE,

} from '../constants/actiontypes';

import { LOADING } from '../constants/fetchstatus';

import parseData from '../dataparser';
import attachMouseMovementListener from '../events/movementlistener';

import solveProductionGraph from '../productiongraph';

export const addInputItem = (to, pos) => (dispatch, getState) => {
    const state = getState();
    const recipeName = state.graph.items[to.item].name;
    const recipe = _.find(state.data.recipes, (r) => r.name === recipeName);

    const slotName = recipe.from[to.slot].name;

    dispatch(showRecipePicker(slotName, pos.x, pos.y));
};

export const calculateGraph = () => (dispatch, getState) => {
    const state = getState();
    const recipes = state.data.recipes;
    const outputIndices = [];
    const inputIndices = [];
    const nodes = state.graph.items.map((item, i) => {
        switch (item.type) {
            case 'input':
                inputIndices.push(i);
                return {
                    name: item.name,
                    output: [1],
                    input: [],
                };
            case 'output':
                outputIndices.push(i);
                return {
                    name: item.name,
                    output: [],
                    input: [1],
                };
            default:
                const recipe = _.find(recipes, (r) => r.name === item.name);
                return {
                    name: item.name,
                    output: recipe.to.map((i) => i.amount),
                    input: recipe.from.map((i) => i.amount),
                };
        }
    });
    const links = state.graph.links.map((l) => ({
        from: { node: l.from.item, slot: l.from.slot },
        to: { node: l.to.item, slot: l.to.slot },
    }));
    const input = inputIndices.map((i) => ({ index: i, value: 5 }));
    const output = outputIndices.map((i) => ({ index: i, value: 5 }));

    const solvePromise = solveProductionGraph(nodes, links, input, output);
    solvePromise.then((counts) =>  dispatch({
        type: RECIPE_TREE_COUNTS_UPDATED,
        counts,
    }));
};

export const moveItem = (index, dx, dy) => ({
    type: RECIPE_TREE_ITEM_MOVED,
    index, dx, dy
});

export const createLink = ({ from, to }) => ({
    type: RECIPE_TREE_LINK_CREATED,
    from, to
});

export const addRecipe = (name, type, x, y) => ({
    type: RECIPE_TREE_ITEM_ADDED,
    name, recipeType: type, x, y,
});

export const translateCanvas = (dx, dy) => (dispatch, getState) => {
    const state = getState();
    const offsetX = state.graph.offsetX + dx;
    const offsetY = state.graph.offsetY + dy;
    const scale = state.graph.scale;
    dispatch({
        type: RECIPE_TREE_LAYOUT_CHANGED,
        scale, offsetX, offsetY,
    });
};

export const updateClientRect = (clientRect) => {
    return {
    type: RECIPE_TREE_CLIENT_RECT_UPDATED,
    ...clientRect, };
};

export const adjustScale = (delta) => (dispatch, getState)  => {
    const state = getState();

    const offsetX = state.graph.offsetX;
    const offsetY = state.graph.offsetY;
    let scale = state.graph.scale;
    scale = delta > 0 ? scale /= 1.1 : scale *= 1.1;
    scale = Math.min(4, Math.max(0, scale));

    dispatch({
        type: RECIPE_TREE_LAYOUT_CHANGED,
        scale, offsetX, offsetY,
    });
};

export const loadData = (fetchData, toHref) => (dispatch, getState) => {
    if (getState().data.status === LOADING) {
        return;
    }
    dispatch({ type: FACTORIO_DATA_FETCH_STARTED });
    fetchData()
        .then((data) => parseData(data, toHref))
        .then((parsedData) => dispatch({ type: FACTORIO_DATA_LOADED, ...parsedData }))
        .catch((err) => dispatch({ type: FACTORIO_DATA_FETCHING_FAILED, err }));

};


export const showRecipePicker = (itemName, x, y) => ({
    type: RECIPE_PICKER_SHOW,
    item: itemName,
    x, y,
});

export const hideRecipePicker = () => ({
    type: RECIPE_PICKER_HIDE,
});

export const selectRecipe = (name, type) => (dispatch, getState) => {
    const state = getState();
    const x = state.recipeAdder.x;
    const y = state.recipeAdder.y;
    dispatch(hideRecipePicker());
    dispatch(addRecipe(name, type, x, y));
};

export const showFloatingElement = (e, name) => (dispatch, getState) => {
    attachMouseMovementListener(e, {
        onStart: () => dispatch({
            type: FLOATING_ELEMENT_SHOW,
            item: name,
            x: e.clientX,
            y: e.clientY,
        }),
        onMove: (dx, dy) => dispatch({
            type: FLOATING_ELEMENT_MOVE_RELATIVE,
            dx, dy
        }),
        onEnd: () => {
            const state = getState();
            const elemX = state.floatingElement.x;
            const elemY = state.floatingElement.y;
            dispatch({ type: FLOATING_ELEMENT_HIDE });

            const graph = state.graph;

            if (elemX >= graph.left &&
                elemX <= graph.left + graph.width &&
                elemY >= graph.top &&
                elemY <= graph.top + graph.height
            ) {
                const xGraph = (elemX - graph.left)/graph.scale - graph.offsetX;
                const yGraph = (elemY - graph.top)/graph.scale - graph.offsetY;

                dispatch(showRecipePicker(name, xGraph, yGraph));
            }

        },
    });
};
