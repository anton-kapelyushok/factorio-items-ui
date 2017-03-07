import React, { Component, PropTypes } from 'react';

class Recipe extends Component {
    render() {
        return (
            <li>
                <span>this.props.name</span>
                <span>this.props.type</span>
            </li>
        );
    }
}

export default class RecipePicker extends Component {
    render() {
        return (
            <div className="RecipePicker">
                <ul>
                    {this.props.recipes.map((recipe) =>
                        <Recipe
                            key={recipe.type+':'+recipe.name}
                            {...recipe}
                        />
                    )}
                </ul>
            </div>
        );
    }
}
