module.exports = {
  onCreate(input) {
    this.state = { type: input.type || "x" };
  },

  onDestroy() {
    console.log("onBeforeDestroy");
  }
};
