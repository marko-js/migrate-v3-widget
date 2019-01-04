function log() {
  console.log("some logger");
}

module.exports = {
  getTemplateData: log,

  onCreate(input, out) {
    this.state = log.call(this, input, out);
  },

  onInput(input, out) {
    this.input = log.call(this, input, out);
    this.widgetConfig = log.call(this, input, out);
    this.input.renderBody = log.call(this, input, out);
  },

  onRender() {
    if (typeof window !== "undefined") {
      log.call(this);
    }
  },

  onMount() {
    var widgetConfig = this.widgetConfig;
    log.call(this, widgetConfig);

    this.onRenderLegacy({
      firstRender: true
    });
  },

  onUpdate() {
    log.call(this);

    this.onRenderLegacy({
      firstRender: false
    });
  },

  onDestroy() {
    log.call(this);
    log.call(this);
  },

  onRenderLegacy() {
    log.call(this);
  }
};
