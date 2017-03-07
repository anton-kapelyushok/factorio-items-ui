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
    const recipes = data.recipe;
    return _.mapValues(recipes, (recipe) => {
        const name = recipe.name;

        const from = normalizeItems(recipe.ingredients);
        const to = ('results' in recipe) ?
            normalizeItems(recipe.results) :
            normalizeItems([[ recipe.result, recipe.result_count || 1 ]]) ;
        const category = recipe.category || 'crafting';
        const time = recipe.energy_required || 0.5;

        return { name, from, to, category, time };
    });
}

function parseData(data) {
    const recipes = _.values(parseRecipes(data));
    const itemNames = _.uniq(_.flatten(_.map(_.values(recipes), (recipe) => {
        return [...recipe.to.map(i => i.name), ...recipe.from.map(i => i.name)];
    })));
    const dataWithoutRecipe = _.map(_.values(_.mapValues(data, (value, key) => {
        if (key === 'recipe' || key === 'tile' || key === 'projectile' || key === 'autoplace-control' || key === 'resource' || key === 'noise-layer') {
            return {};
        } else {
            return value;
        }
    })));

    const allItems = _.reduce(dataWithoutRecipe, (result, items) => {
        result = {...result, ...items };
        return result;
    }, {});

    const items = _.values(_.pick(allItems, itemNames));

    return { items, recipes };
}

module.exports = parseData;
