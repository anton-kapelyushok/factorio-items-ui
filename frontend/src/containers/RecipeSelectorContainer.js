import { connect } from 'react-redux';
import _ from 'lodash';

import { selectRecipe } from '../actions';

import RecipeSelector from '../components/RecipeSelector';

const mapStateToProps = (state) => {
    const itemName = state.recipeAdder.item;
    const dataRecipes = state.data.recipes;

    const inputItem = {
        name: itemName,
        type: 'input',
        from: [],
        to: [{ name: itemName, amount: 1 }],
        time: 1,
        category: 'input',
    };

    const outputItem = {
        name: itemName,
        type: 'output',
        from: [{ name: itemName, amount: 1 }],
        to: [],
        time: 1,
        category: 'output',
    };

    const recipes = dataRecipes.filter(
        (r) => _.find(
            [...r.to, ...r.from],
             (i) => i.name === itemName
         )
     ).map(
        (r) => ({
            ...r,
            type: 'recipe',
        })
    );

    return {
        recipes: [inputItem, outputItem, ...recipes],
    };
};

const mapDispatchToProps = {
    onRecipeSelected: selectRecipe,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RecipeSelector);
