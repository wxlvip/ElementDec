import { createTest } from '../util';
import HelloWorld from 'packages/hello-world';
describe.only('test HelloWorld', () => {
  const name = '测试hello-world组件';
  const vm = createTest(HelloWorld, {
    name
  }, true);
  it('there should be .hello-world', () => {
    expect(vm.$el.classList.contains('hello-world')).to.be.true;
  });
  it('should contains name', () => {
    expect(vm.$el.textContent).to.contains(name);
  });
});
