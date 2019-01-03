import path from "path";

const EXT_REG = /\.[^.]+$/;
const FILE_NAME_MAP = {
  defineComponent: "component",
  defineWidget: "component-browser"
};

export default function(componentFile, templateFile, type) {
  let base = templateFile.replace(EXT_REG, "");
  let name = FILE_NAME_MAP[type];

  if (base.endsWith("/index")) {
    base = base.slice(0, -5);
  } else {
    name = `.${name}`;
  }

  return base + name + path.extname(componentFile);
}
