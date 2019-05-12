import {connect} from 'react-redux';

import React from 'react';

import ItemListContainer from '../containers/ItemListContainer';
import EditorContainer from '../containers/EditorContainer';
import FloatingElementContainer from '../containers/FloatingElementContainer';
import {calculateGraph} from "../actions";

const App = ({showFloatingElement, calculateGraph}) =>
    <div className="App">
        <div className="App-header">
            <button onClick={calculateGraph}>Solve</button>
        </div>
        <div className="App-content">
            <ItemListContainer/>
            <EditorContainer/>
            {showFloatingElement && <FloatingElementContainer/>}
        </div>
    </div>
;

const mapStateToProps = (state) => ({
    showFloatingElement: state.floatingElement.show,
});

const mapDispatchToProps = {
    calculateGraph: calculateGraph
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
