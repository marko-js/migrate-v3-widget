const markoWidgets = require("marko-widgets");

function log() {
  console.log("some logger");
}

module.exports = markoWidgets.defineComponent({
  template: require("./something.marko"),
  getWidgetConfig: log,
  getTemplateData: log,
  getInitialProps: log,
  getInitialState: log,
  getInitialBody: log,
  init: log,
  onBeforeUpdate: log,
  onUpdate: log,
  onBeforeDestroy: log,
  onDestroy: log,
  onRender: log
});
