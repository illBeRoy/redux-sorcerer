import * as React from 'react';
import { Store } from 'redux';

class ComponentBuilder {
  private store: Store;
  private children: React.ComponentType[] = [];
  private onUpdateHandler: (state: any) => void;

  rendersDataFromStore(store: Store) {
    this.store = store;
    return this;
  }

  withChild(child: React.ComponentType) {
    this.children.push(child);
    return this;
  }

  onUpdate(onUpdateHandler) {
    this.onUpdateHandler = onUpdateHandler;
    return this;
  }

  build() {
    const store = this.store;
    const children = this.children;
    const onUpdateHandler = this.onUpdateHandler || (() => null);

    return class extends React.Component {
      stateOnLastRender: any;

      componentDidUpdate() {
        onUpdateHandler(this.stateOnLastRender);
      }

      render() {
        this.stateOnLastRender = store && store.getState();
        return (
          <span>
            {children.map((Child, i) =>
              <Child key={i} />)}
          </span>
        );
      }
    };
  }
}

export const aComponent = () => new ComponentBuilder();
