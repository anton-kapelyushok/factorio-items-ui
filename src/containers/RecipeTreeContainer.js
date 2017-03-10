import { connect } from 'react-redux';

import _ from 'lodash';
import RecipeTree from '../components/RecipeTree';

import {
    moveItem,
    translateCanvas,
    adjustScale,
    createLink,
    updateClientRect,
    addInputItem,
} from '../actions';

const getSlotProps = (items, recipeSlot) => {
    const item = _.find(items, (i) => i.name === recipeSlot.name);
    return {
        name: item.name,
        icon: item.icon,
        amount: recipeSlot.amount,
    };
};

const mapStateToProps = (state) => ({
    items: state.graph.items.map((i) => {
        let recipe;
        switch (i.type) {
            case 'input':
                return {
                    name: i.name,
                    inItems: [],
                    outItems: [getSlotProps(state.data.items, { amount: 1, name: i.name })],
                    x: i.x,
                    y: i.y,
                    count: i.count,
                };
            case 'output':
                return {
                    name: i.name,
                    inItems: [getSlotProps(state.data.items, { amount: 1, name: i.name })],
                    outItems: [],
                    x: i.x,
                    y: i.y,
                    count: i.count,
                };
            default:
                recipe = _.find(state.data.recipes, (r) => r.name === i.name);
                return {
                    name: i.name,
                    inItems: recipe.from.map((r) => getSlotProps(state.data.items, r)),
                    outItems: recipe.to.map((r) => getSlotProps(state.data.items, r)),
                    x: i.x,
                    y: i.y,
                    count: i.count,
                };
        }
    }),
    links: state.graph.links,
    scale: state.graph.scale,
    offsetX: state.graph.offsetX,
    offsetY: state.graph.offsetY,
});


const mapDispatchToProps = {
    onItemMove: moveItem,
    onConnectedLinkCreated: createLink,
    onCanvasTranslate: translateCanvas,
    onScaleAdjust: adjustScale,
    onDisconnectedInputLinkCreated: addInputItem,
    onClientRectUpdated: updateClientRect,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RecipeTree);