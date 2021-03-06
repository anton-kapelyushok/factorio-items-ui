import _ from 'lodash';

import {
    FACTORIO_DATA_FETCH_STARTED,
    FACTORIO_DATA_FETCHING_FAILED,
    FACTORIO_DATA_LOADED,
    FLOATING_ELEMENT_HIDE,
    FLOATING_ELEMENT_MOVE_RELATIVE,
    FLOATING_ELEMENT_SHOW,
    RECIPE_PICKER_HIDE,
    RECIPE_PICKER_SHOW,
    RECIPE_TREE_CLIENT_RECT_UPDATED,
    RECIPE_TREE_COUNTS_UPDATED,
    RECIPE_TREE_ITEM_ADDED,
    RECIPE_TREE_ITEM_MOVED,
    RECIPE_TREE_LAYOUT_CHANGED,
    RECIPE_TREE_LINK_CREATED,
} from '../constants/actiontypes';

import {LOADING} from '../constants/fetchstatus';

import parseData from '../dataparser';
import attachMouseMovementListener from '../events/movementlistener';

import solveProductionGraph from '../productiongraph';

export const addInputItem = (to, pos, source, type) => (dispatch, getState) => {
    const state = getState();
    const recipeName = state.graph.items[to.item].name;

    let slotName;
    if (type === 'input' || type === 'output') {
        slotName = recipeName;
    } else { // 'recipe'
        const recipe = _.find(state.data.recipes, (r) => r.name === recipeName);
        if (source === 'input-link') {
            slotName = recipe.from[to.slot].name;
        } else { // 'output-link'
            slotName = recipe.to[to.slot].name;
        }
    }

    dispatch(showRecipePicker(slotName, pos.x, pos.y, source, to));
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
        from: {node: l.from.item, slot: l.from.slot},
        to: {node: l.to.item, slot: l.to.slot},
    }));
    const input = inputIndices.map((i) => ({index: i, value: 5}));
    const output = outputIndices.map((i) => ({index: i, value: 5}));

    const solvePromise = solveProductionGraph(nodes, links, input, output);
    solvePromise.then((counts) => dispatch({
        type: RECIPE_TREE_COUNTS_UPDATED,
        counts,
    }));
};

export const moveItem = (index, x, y) => ({
    type: RECIPE_TREE_ITEM_MOVED,
    index, x, y
});

export const createLink = ({from, to}) => ({
    type: RECIPE_TREE_LINK_CREATED,
    from, to
});

export const addRecipe = (name, type, x, y) => ({
    type: RECIPE_TREE_ITEM_ADDED,
    name, recipeType: type, x, y,
});

export const translateCanvas = (dx, dy) => (dispatch, getState) => {
    const state = getState();
    const offsetX = dx;
    const offsetY = dy;
    const scale = state.graph.scale;
    dispatch({
        type: RECIPE_TREE_LAYOUT_CHANGED,
        scale, offsetX, offsetY,
    });
};

export const updateClientRect = (clientRect) => {
    return {
        type: RECIPE_TREE_CLIENT_RECT_UPDATED,
        ...clientRect,
    };
};

export const adjustScale = (scale) => (dispatch, getState) => {
    const state = getState();

    const offsetX = state.graph.offsetX;
    const offsetY = state.graph.offsetY;

    dispatch({
        type: RECIPE_TREE_LAYOUT_CHANGED,
        scale, offsetX, offsetY,
    });
};

export const loadData = (fetchData, toHref) => (dispatch, getState) => {
    if (getState().data.status === LOADING) {
        return;
    }
    dispatch({type: FACTORIO_DATA_FETCH_STARTED});
    fetchData()
        .then((data) => parseData(data, toHref))
        .then((parsedData) => dispatch({type: FACTORIO_DATA_LOADED, ...parsedData}))
        .catch((err) => dispatch({type: FACTORIO_DATA_FETCHING_FAILED, err}));

};

export const showRecipePicker = (itemName, x, y, source, sourceSlot) => ({
    type: RECIPE_PICKER_SHOW,
    item: itemName,
    x, y,
    source,
    sourceSlot,
});

export const hideRecipePicker = () => ({
    type: RECIPE_PICKER_HIDE,
});

export const selectRecipe = (targetRecipeName, type) => (dispatch, getState) => {
    let state = getState();
    const x = state.recipeAdder.x;
    const y = state.recipeAdder.y;
    const source = state.recipeAdder.source;
    dispatch(hideRecipePicker());
    dispatch(addRecipe(targetRecipeName, type, x, y));
    state = getState();


    if (state.recipeAdder.sourceSlot) {
        const sourceSlot = state.recipeAdder.sourceSlot;
        const lastItemIndex = state.graph.items.length - 1;
        const lastItem = state.graph.items[lastItemIndex];
        const sourceName = state.graph.items[state.recipeAdder.sourceSlot.item].name;
        const targetRecipe = _.find(state.data.recipes, (r) => r.name === targetRecipeName);
        if (source === 'input-link') {
            if (lastItem.type === 'input') {
                dispatch(createLink({from: {item: lastItemIndex, slot: 0}, to: sourceSlot}));
            } else { // 'recipe'
                const slot = targetRecipe.to.findIndex(s => s.name === sourceName);
                dispatch(createLink({from: {item: lastItemIndex, slot}, to: sourceSlot}));
            }
        } else if (source === 'output-link') {
            if (lastItem.type === 'output') {
                dispatch(createLink({from: sourceSlot, to: {item: lastItemIndex, slot: 0}}));
            } else { // 'recipe'
                const slot = targetRecipe.from.findIndex(s => s.name === sourceName);
                dispatch(createLink({from: sourceSlot, to: {item: lastItemIndex, slot}}));
            }
        }
    }
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
            dispatch({type: FLOATING_ELEMENT_HIDE});

            const graph = state.graph;

            if (elemX >= graph.left &&
                elemX <= graph.left + graph.width &&
                elemY >= graph.top &&
                elemY <= graph.top + graph.height
            ) {
                const xGraph = (elemX - graph.left) / graph.scale - graph.offsetX * graph.scale;
                const yGraph = (elemY - graph.top) / graph.scale - graph.offsetY * graph.scale;

                dispatch(showRecipePicker(name, xGraph, yGraph, 'recipe-picker'));
            }

        },
    });
};
