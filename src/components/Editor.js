import React, { PropTypes } from 'react';

import RecipeTreeContainer from '../containers/RecipeTreeContainer';
import RecipeSelectorContainer from '../containers/RecipeSelectorContainer';

const Editor = ({ showRecipePicker }) =>
    <div className="Editor">
        <RecipeTreeContainer />
        { showRecipePicker && <RecipeSelectorContainer /> }
    </div>
;

Editor.propTypes = {
    showRecipePicker: PropTypes.bool.isRequired,
};

export default Editor;
