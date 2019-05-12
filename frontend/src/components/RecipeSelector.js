import React, { PropTypes } from 'react';

const Recipe = ({ type, name, onClick }) =>
    <li className="RecipeSelector__Recipe" onClick={onClick}>
        {type} {name}
    </li>
;

Recipe.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    from: PropTypes.array.isRequired,
    to: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
};

const RecipeSelector = ({ recipes, onRecipeSelected }) =>
    <div className="RecipeSelector">
        <div className="wrapper">
            <ul>
                { recipes.map((recipe) =>
                    <Recipe
                        key={recipe.name+':'+recipe.type}
                        {...recipe}
                        onClick={() => onRecipeSelected(recipe.name, recipe.type)}
                    />
                )}
            </ul>
        </div>
    </div>
;

RecipeSelector.propTypes = {
    recipes: PropTypes.array.isRequired,
    onRecipeSelected: PropTypes.func.isRequired,
};

export default RecipeSelector;
