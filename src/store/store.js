import { createStore } from 'redux';
import rootReducer from './reducers/main';

const store = createStore(rootReducer);

export default store;
