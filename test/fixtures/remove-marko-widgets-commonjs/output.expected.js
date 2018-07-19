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
    this.legacyOnRender({
      firstRender: true
    });

    var widgetConfig = this.widgetConfig;
    this.getComponent("x");
    console.log("init");
  },

  onUpdate() {
    this.legacyOnRender({
      firstRender: false
    });

    console.log("update");
  },

  onDestroy() {
    console.log("before destroy");
    console.log("other destroy");
  }
};
