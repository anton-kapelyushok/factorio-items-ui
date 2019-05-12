const _ = require('lodash');

function normalizeItems (items) {
    return _.map(items, (item) => {
        if (_.isArray(item)) {
            return {
                type: 'item',
                name: item[0],
                amount: item[1],
            };
        } else {
            return item;
        }
    });
}

function parseRecipes(data) {
    const recipesData = data.raw.recipe;
    return _.mapValues(recipesData, (recipeData) => {
        const name = recipeData.name;
        const from = normalizeItems(recipeData.ingredients);
        const to = ('results' in recipeData) ?
            normalizeItems(recipeData.results) :
            normalizeItems([[ recipeData.result, recipeData.result_count ]]) ;
        const category = recipeData.category || 'crafting';
        const time = recipeData.energy_required || 0.5;

        return { name, from, to, category, time };
    });
}

module.exports = parseRecipes;
