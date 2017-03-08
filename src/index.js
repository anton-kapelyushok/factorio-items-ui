import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import AppContainer from './containers/AppContainer';
import Api from './api';

import reducers from './reducers';
import { loadData, calculateGraph } from './actions';

import './index.css';

const logger = createLogger();
const middleware = [thunk, logger];
const store = createStore(reducers, applyMiddleware(...middleware));

const api = new Api('http://localhost:3000');
store.dispatch(loadData(api.data.bind(api), api.resourceLink.bind(api)));

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.querySelector('#root')
);

window.solve = () => store.dispatch(calculateGraph());
