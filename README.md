![Logo](https://github.com/illBeRoy/redux-sorcerer/blob/master/logo.png?raw=true)
> 💫 Magically bind your React components with your Redux stores

## Introduction
**Come join an experiment.** Redux-Sorcerer is a micro library (144 lines) that magically binds your React components to your Redux stores. All you have to do is read a given store's state upon rendering, and you'll automatically update with it. Example:

```js
import * as React from 'react';
import { createObservableStore, observer } from 'redux-sorcerer';
import { createCounterStore, addOneAction } from './my-store';

const counterStore =
  createObservableStore(
    createCounterStore());

@observer
class App extends React.Component {
  render() {
    return (
      <span>
        count: { counterStore.getState().count }
        <button onClick={() => counterStore.dispatch(addOneAction())}>
          ADD
        </button>
      </span>
    );
  }
}
```

## Installing
You can start by installing `redux-sorcerer` as a dependency:

```sh
npm install redux-sorcerer
```

## API
The `redux-sorcerer` package consists of two main modifiers:

### `createObservableStore(store)`
Creates an observable object from a given Redux store.

An observable store is a store to which observer components automatically subscribe once they utilize its state via getState.

It is important to mention that when making a Redux store observable, it is not being mutated, but rather a new store is created from it. Therefore, multiple observable stores created from the same Redux store will share the same state but will fail shallow equality.

### `observer(WrappedComponent)`
Turns a React component into a reactive observer over an observable Redux store.

An observer component is capable of automatically subscribing to store changes. The subscription takes place implicitly whenever an observing component utilizes a store's state via `getState`. It is capable of automatically subscribing to the store regardless of how it passed to it (meaning that you can pass the store via props or context or even create it or import if from outside). It is important to note that only the component that uses the store's state during its render phase is actually subscribing to that store, and automatically unsubscribes from it once it ceases to use its state in the render.

The observer modifier can be used as a HoC or as a decorator.

## FAQ
### How does it work?
To begin with, `redux-sorcerer` keeps track of the current rendering component via a rendering stack. Whenever an `observer` component is being rendered, it hooks into the stack. While it is rendered, any `observableStore` that is being used registers with it is being count.

Once rendering is done, the `observer` pops its hook from the stack and subscribes to all the stores that were used by it during the render, as well as unsubscribes to all the stores it no longer uses.

Since every `observer` hooks into the rendering stack, only an `observer` that uses a store directly is subscribed to it, which saves unnecessary renders and therefore, much like similar libraries, it is a good practice to directly make any component that utilizes a store an `observer`.

### It looks a little like MobX
Yeah, it does 😊 I've had the pleasure to use both Redux and MobX at some points, and on one hand I really liked the way Redux lets you express logic, and on the other the ease that MobX's observer pattern brings. Why not both, then?

### Why create yet another binding library?
For fun, to begin with. Needless to say that this is more of an experiment, rather than a production ready library. And you're welcome to take part! 😇

### Testing
Tests run on top of `jest` and are powered by the `enzyme` testing library.

<sub>Logo icon by [mavadee](https://www.flaticon.com/authors/mavadee) from [flaticon.com](https://www.flaticon.com/)</sub>