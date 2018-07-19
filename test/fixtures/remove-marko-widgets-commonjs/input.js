const markoWidgets = require("marko-widgets");

function otherDestroy() {
  console.log("other destroy");
}

module.exports = markoWidgets.defineComponent({
  template: require("./something.marko"),
  getWidgetConfig(input) {
    return {
      input,
      a: "b"
    };
  },
  getTemplateData(input, state) {
    return Object.assign({}, input, state);
  },
  getInitialProps(asdsd) {
    return Object.assign({}, asdsd, {
      color: "green"
    });
  },
  getInitialState: function(input, out) {
    console.log(out);
    return Object.assign({}, input, {
      time: new Date()
    });
  },
  init(config) {
    this.getWidget("x");
    console.log("init");
  },
  onBeforeUpdate() {
    console.log("before update");
  },
  onUpdate() {
    console.log("update");
  },
  onBeforeDestroy() {
    console.log("before destroy");
  },
  onDestroy: otherDestroy,
  onRender(obj) {
    if (obj.firstRender) {
      console.log("first render");
    } else {
      console.log("second render");
    }
  }
});
