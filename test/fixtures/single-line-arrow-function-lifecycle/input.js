const markoWidgets = require("marko-widgets");

module.exports = markoWidgets.defineComponent({
  template: require("./something.marko"),
  getInitialState: input => ({ type: input.type || "x" }),
  onBeforeDestroy: () => console.log("onBeforeDestroy")
});
