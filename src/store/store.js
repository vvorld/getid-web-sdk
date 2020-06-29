import { createStore } from 'redux';
import rootReducer from './reducers/main';

export default  () => {
    return createStore(rootReducer);
} 
