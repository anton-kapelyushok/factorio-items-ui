import {connect} from 'react-redux';

import {hideRecipePicker, selectRecipe} from '../actions';

import RecipeSelector from '../components/RecipeSelector';

const mapStateToProps = (state) => {
    const itemName = state.recipeAdder.item;
    const source = state.recipeAdder.source;
    const dataRecipes = state.data.recipes;

    const inputItem = {
        name: itemName,
        type: 'input',
        from: [],
        to: [{name: itemName, amount: 1}],
        time: 1,
        category: 'input',
    };

    const outputItem = {
        name: itemName,
        type: 'output',
        from: [{name: itemName, amount: 1}],
        to: [],
        time: 1,
        category: 'output',
    };

    const outRecipes = dataRecipes.filter(
        r => r.to.find((i) => i.name === itemName)
    ).map(
        (r) => ({
            ...r,
            type: 'recipe',
        })
    );

    const inRecipes = dataRecipes.filter(
        r => r.from.find((i) => i.name === itemName)
    ).map(
        (r) => ({
            ...r,
            type: 'recipe',
        })
    );

    switch (source) {
        case 'recipe-picker':
            return {
                recipes: [inputItem, outputItem, ...outRecipes],
            };
        case 'input-link':
            return {
                recipes: [inputItem, ...outRecipes],
            };

        case 'output-link':
            return {
                recipes: [outputItem, ...inRecipes],
            };
        default:
            throw new Error(`Unknown source ${source}`);
    }
};

const mapDispatchToProps = {
    onRecipeSelected: selectRecipe,
    onClose: hideRecipePicker,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RecipeSelector);
