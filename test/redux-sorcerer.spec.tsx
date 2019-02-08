import * as React from 'react';
import { dom } from './utils/dom';
import { aStore, anAction, aState } from './builders/store';
import { aComponent } from './builders/component';
import { createObservableStore, observer } from '../src';

describe('redux-sorcerer', () => {
  afterEach(() =>
    dom.clear());

  describe('@observer and observableStore', () => {
    describe('when rendering state from an observable store in an observer component', () => {
      it('should automatically trigger re-render of the observing component when the store\'s state mutates', () => {
        const action = anAction().build();
        const nextState = aState().build();
        const store = createObservableStore(
          aStore()
            .whenAction(action).returnState(nextState)
            .build()
        );

        const componentDidUpdate = jest.fn();
        const Component = observer(
          aComponent()
            .rendersDataFromStore(store)
            .onUpdate(componentDidUpdate)
            .build()
        );

        dom.mount(<Component />);
        store.dispatch(action);

        expect(componentDidUpdate).toHaveBeenCalledWith(nextState);
      });

      it('should not trigger re-render of components that did not make use of a specific store', () => {
        const action = anAction().build();
        const store = createObservableStore(
          aStore()
            .whenAction(action).returnState(aState().build())
            .build()
        );

        const componentDidUpdate = jest.fn();
        const Component = observer(
          aComponent()
            .onUpdate(componentDidUpdate)
            .build()
        );

        dom.mount(<Component />);
        store.dispatch(action);

        expect(componentDidUpdate).not.toHaveBeenCalled();
      });

      it('should trigger re-render only of the leaf that utilizes the observed store, but not its parent', () => {
        const action = anAction().build();
        const nextState = aState().build();
        const store = createObservableStore(
          aStore()
            .whenAction(action).returnState(nextState)
            .build()
        );

        const childComponentDidUpdate = jest.fn();
        const ChildComponent = observer(
          aComponent()
            .rendersDataFromStore(store)
            .onUpdate(childComponentDidUpdate)
            .build()
        );

        const parentComponentDidUpdate = jest.fn();
        const ParentComponent = observer(
          aComponent()
            .withChild(ChildComponent)
            .onUpdate(parentComponentDidUpdate)
            .build()
        );

        dom.mount(<ParentComponent />);
        store.dispatch(action);

        expect(childComponentDidUpdate).toHaveBeenCalledWith(nextState);
        expect(parentComponentDidUpdate).not.toHaveBeenCalled();
      });

      it('should clean up store subscriptions of the observing component when it has been unmounted', () => {
        const storeWasUnsubscribedFrom = jest.fn();
        const store = createObservableStore(
          aStore()
            .onUnsubscribe(storeWasUnsubscribedFrom)
            .build()
        );

        const componentDidUpdate = jest.fn();
        const Component = observer(
          aComponent()
            .rendersDataFromStore(store)
            .onUpdate(componentDidUpdate)
            .build()
        );

        const mountedComponent = dom.mount(<Component />);
        mountedComponent.unmount();

        expect(storeWasUnsubscribedFrom).toHaveBeenCalled();
      });
    });
  });
});
