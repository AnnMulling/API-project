import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from './session';
import spotReducer from './spots';
import reviewReducer from './reviews';
import imgReducer from './images';

const rootReducer = combineReducers({
    session: sessionReducer,
    spots: spotReducer,
    reviews: reviewReducer,
});

let enhancer;

if (process.env.NODE_ENV === 'production') {
    enhancer = applyMiddleware(thunk);
} else {
const logger = require('redux-logger').default;
const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
enhancer = composeEnhancers(applyMiddleware(thunk, logger));
};


const configureStore = (preloadState) => {
    return createStore(rootReducer, preloadState, enhancer);
};

export default configureStore;
