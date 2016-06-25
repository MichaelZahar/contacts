import { createStore } from 'redux';
import { rootReducer} from '../reducers/rootReducer';

export function configureStore(preloadedState, middlware) {
  const store = createStore(
    rootReducer,
    preloadedState,
    middlware
  );

  return store;
}
