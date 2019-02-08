import { Store } from 'redux';

class RendererContext {
  private stores = new Set<Store>();

  registerStore(store: Store) {
    this.stores.add(store);
  }

  getStores() {
    return this.stores;
  }
}

class RenderContextTracker {
  private rendererContextsStack: RendererContext[] = [];

  createRendererContext(): RendererContext {
    const rendererContext = new RendererContext();
    this.rendererContextsStack.push(rendererContext);
    return rendererContext;
  }

  closeRendererContext(): RendererContext {
    return this.rendererContextsStack.pop();
  }

  reportObservableWasRead(store: Store) {
    const rendererContext = this.rendererContextsStack[this.rendererContextsStack.length - 1];
    if (rendererContext) {
      rendererContext.registerStore(store);
    }
  }
}

export const renderContextTracker = new RenderContextTracker();
