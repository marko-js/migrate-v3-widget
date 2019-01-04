module.exports = {
  getTemplateData(input, state) {
    console.log("getTemplateData");
    return Object.assign({}, input, state);
  },

  onCreate(input, out) {
    console.log("getInitialState", out);

    this.state = Object.assign({}, input, {
      time: new Date()
    });
  },

  onInput(input) {
    console.log("getInitialProps");
    const stuff = input.stuff.map(thing => {
      return thing + 1;
    });

    this.input = Object.assign({ stuff }, input, {
      color: "green"
    });

    this.widgetConfig = (() => {
      console.log("getWidgetConfig");

      if (input.x) {
        return {
          input,
          a: "b"
        };
      }

      return { y: true };
    })();

    console.log("getInitialBody");
    const defaultValue = "Default";
    this.input.renderBody = input.renderBody || defaultValue;
  },

  onRender() {
    if (typeof window !== "undefined") {
      console.log("onBeforeUpdate");
    }
  },

  onMount() {
    var widgetConfig = this.widgetConfig;
    this.getComponent("x");
    console.log("init", widgetConfig.name);

    setTimeout(() => {
      this.input = {
        a: 1
      };
    });

    this.onRenderLegacy({
      firstRender: true
    });
  },

  onUpdate() {
    console.log("onUpdate");

    this.onRenderLegacy({
      firstRender: false
    });
  },

  onDestroy() {
    console.log("onBeforeDestroy");
    console.log("onDestroy hoisted");
  },

  onRenderLegacy(event) {
    if (event.firstRender) {
      console.log("onRender: firstRender");
    } else {
      console.log("onRender: !firstRender");
    }
  }
};
