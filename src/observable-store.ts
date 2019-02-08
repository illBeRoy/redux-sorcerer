import { Store } from 'redux';
import { renderContextTracker } from './renderer-context';

/**
 * Creates an observable object from a given Redux store.
 *
 * An observable store is a store to which observer components automatically subscribe once they utilize
 * its state via getState.
 *
 * It is important to mention that when making a Redux store observable, it is not being mutated, but rather
 * a new store is created from it. Therefore, multiple observable stores created from the same Redux store will
 * share the same state but will fail shallow equality.
 *
 * @example
 * ```js
 * const store = createStore(reducer);
 * const observableStore = createObservableStore(store);
 * ```
 */
export const createObservableStore = <TStore extends Store>(store: TStore): TStore => {
  const observableStore: Store = {
    subscribe: (...args) => store['subscribe'](...args),
    dispatch: (...args) => store['dispatch'](...args),
    getState: (...args) => {
      renderContextTracker.reportObservableWasRead(observableStore);
      return store['getState'](...args);
    },
    replaceReducer: (...args) => store['replaceReducer'](...args)
  };

  return observableStore as any;
};
