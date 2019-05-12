import React, { PropTypes } from 'react';

import ItemListContainer from '../containers/ItemListContainer';
import EditorContainer from '../containers/EditorContainer';
import FloatingElementContainer from '../containers/FloatingElementContainer';

const App = ({ showFloatingElement }) =>
    <div className="App">
        <ItemListContainer/>
        <EditorContainer/>
        {showFloatingElement && <FloatingElementContainer /> }
    </div>
;

App.propTypes = {
    showFloatingElement: PropTypes.bool.isRequired,
};

export default App;
