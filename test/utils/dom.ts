import * as Adapter from 'enzyme-adapter-react-16';
import { ReactWrapper, mount, configure } from 'enzyme';
import { attempt } from './attempt';

configure({ adapter: new Adapter() });

class DomManager {
  private wrappers: ReactWrapper[] = [];

  mount(component): ReactWrapper {
    const wrapper = mount(component, { attachTo: document.createElement('div') });
    this.wrappers.push(wrapper);
    return wrapper;
  }

  clear() {
    this.wrappers.forEach(wrapper => attempt(() => wrapper.unmount()));
    this.wrappers = [];
  }
}

export const dom = new DomManager();
