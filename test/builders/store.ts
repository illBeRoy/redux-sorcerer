import { Chance } from 'chance';
import * as deepEqual from 'deep-equal';
import { createStore, Store } from 'redux';
import { anObject } from './object';

class StoreBuilder {
  private initialState = aState().build();
  private actionToStateMap: [any, any][] = [];
  private onUnsubscribeHandler: Function = () => null;

  private reducer = (state = this.initialState, action) => {
    const actionToState = this.actionToStateMap
      .find(([expectedAction, nextState]) => deepEqual(expectedAction, action));

    return actionToState ? actionToState[1] : state;
  }

  whenAction(action) {
    return {
      returnState: (nextState): StoreBuilder => {
        this.actionToStateMap.push([action, nextState]);
        return this;
      }
    };
  }

  onUnsubscribe(onUnsubscribeHandler: Function) {
    this.onUnsubscribeHandler = onUnsubscribeHandler;
    return this;
  }

  build(): Store {
    const store = createStore(this.reducer);
    const subscribe = (fn) => {
      const internalUnsubscribe = store.subscribe(fn);
      return () => {
        internalUnsubscribe();
        this.onUnsubscribeHandler();
      };
    };

    return {
      ...store,
      subscribe
    };
  }
}

class StateBuilder {
  build() {
    return anObject();
  }
}

class ActionBuilder {
  private type = Chance().string();
  private action = anObject();

  build() {
    return {
      ...this.action,
      type: this.type
    };
  }
}

export const aStore = () => new StoreBuilder();
export const aState = () => new StateBuilder();
export const anAction = () => new ActionBuilder();
