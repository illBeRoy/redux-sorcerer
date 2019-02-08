import * as React from 'react';
import { Store, Unsubscribe } from 'redux';
import { renderContextTracker } from './renderer-context';

/**
 * Turns a React component into a reactive observer over an observable Redux store.
 *
 * An observer component is capable of automatically subscribing to store changes.
 * The subscription takes place implicitly whenever an observing component utilizes a
 * store's state via `getState`. It is capable of automatically subscribing to the store
 * regardless of how it passed to it (meaning that you can pass the store via props or context,
 * or even create it or import if from outside).
 *
 * It is important to note that only the component that uses the store's state during its render
 * phase is actually subscribing to that store, and automatically unsubscribes from it once it ceases
 * to use its state in the render.
 *
 * The observer modifier can be used as a HoC or as a decorator.
 *
 * @example
 * ```js
 * const observableStore = observable(store);
 *
 * @observer
 * Class MyComponent extends React.Component {
 *   render() {
 *     return <span>{observbleStore.getState()}</span>
 *   }
 * }
 * ```
 */
export const observer = <TComponent extends React.ComponentType>(WrappedComponent: TComponent): TComponent => {
  return class extends React.Component {
    private storesSubscriptionsMap = new Map<Store, Unsubscribe>();

    update = () => {
      this.setState({ ...this.state });
    }

    handleStoreSubscriptions() {
      const rendererContext = renderContextTracker.closeRendererContext();

      this.storesSubscriptionsMap.forEach((unsubcribeFromStore, store) => {
        if (!rendererContext.getStores().has(store)) {
          unsubcribeFromStore();
          this.storesSubscriptionsMap.delete(store);
        }
      });

      rendererContext.getStores().forEach(store => {
        if (!this.storesSubscriptionsMap.has(store)) {
          const unsubscribeFromStore = store.subscribe(this.update);
          this.storesSubscriptionsMap.set(store, unsubscribeFromStore);
        }
      });
    }

    componentDidMount() {
      this.handleStoreSubscriptions();
    }

    componentDidUpdate() {
      this.handleStoreSubscriptions();
    }

    componentWillUnmount() {
      this.storesSubscriptionsMap.forEach(unsubscribeFromStore => unsubscribeFromStore());
    }

    render() {
      renderContextTracker.createRendererContext();
      return <WrappedComponent {...(this.props as any)} />;
    }
  } as any;
};
