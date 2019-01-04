const markoWidgets = require("marko-widgets");

function otherDestroy() {
  console.log("onDestroy hoisted");
}

module.exports = markoWidgets.defineComponent({
  template: require("./something.marko"),
  getWidgetConfig(input) {
    console.log("getWidgetConfig");

    if (input.x) {
      return {
        input,
        a: "b"
      };
    }

    return { y: true };
  },
  getTemplateData(input, state) {
    console.log("getTemplateData");
    return Object.assign({}, input, state);
  },
  getInitialProps(customParamName) {
    console.log("getInitialProps");
    const stuff = input.stuff.map(thing => {
      return thing + 1;
    });
    return Object.assign({ stuff }, customParamName, {
      color: "green"
    });
  },
  getInitialState: function(input, out) {
    console.log("getInitialState", out);
    return Object.assign({}, input, {
      time: new Date()
    });
  },
  getInitialBody(input) {
    console.log("getInitialBody");
    const defaultValue = "Default";
    return input.renderBody || defaultValue;
  },
  init(config) {
    this.getWidget("x");
    console.log("init", config.name);

    setTimeout(() => {
      this.setProps({
        a: 1
      });
    });
  },
  onBeforeUpdate() {
    console.log("onBeforeUpdate");
  },
  onUpdate() {
    console.log("onUpdate");
  },
  onBeforeDestroy() {
    console.log("onBeforeDestroy");
  },
  onDestroy: otherDestroy,
  onRender(obj) {
    if (obj.firstRender) {
      console.log("onRender: firstRender");
    } else {
      console.log("onRender: !firstRender");
    }
  }
});
