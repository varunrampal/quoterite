import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import customerReducer from './customers/CustomersReducer';
import propertyReducer from './property/PropertiesReducer';
import quoteReducer from './quotes/QuotesReducer';
const rootReducer = combineReducers({
    customers: customerReducer,
    properties: propertyReducer,
    quotes:quoteReducer
});

export type AppState = ReturnType<typeof rootReducer>;
const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunkMiddleware)),
);

export default store;
