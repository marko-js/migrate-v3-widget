module.exports = {
  getTemplateData(input, state) {
    return Object.assign({}, input, state);
  },

  legacyOnRender(obj) {
    if (obj.firstRender) {
      console.log("first render");
    } else {
      console.log("second render");
    }
  },

  onCreate(input, out) {
    console.log(out);

    this.state = Object.assign({}, input, {
      time: new Date()
    });
  },

  onInput(input) {
    this.input = Object.assign({}, input, {
      color: "green"
    });

    this.widgetConfig = {
      input,
      a: "b"
    };
  },

  onRender() {
    console.log("before update");
  },

  onMount() {
    var widgetConfig = this.widgetConfig;
    this.getComponent("x");
    console.log("init");

    this.legacyOnRender({
      firstRender: true
    });
  },

  onUpdate() {
    console.log("update");

    this.legacyOnRender({
      firstRender: false
    });
  },

  onDestroy() {
    console.log("before destroy");
    console.log("other destroy");
  }
};
