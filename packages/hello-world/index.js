import HelloWorld from './src/main';
// ComponentName 为 HelloWorld
/* istanbul ignore next */
HelloWorld.install = function(Vue) {
  Vue.component(HelloWorld.name, HelloWorld);
};
export default HelloWorld;
