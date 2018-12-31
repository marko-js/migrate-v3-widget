import path from "path";

const EXT_REG = /\.[^.]+$/;
const FILE_NAME_MAP = {
  defineComponent: "component",
  defineWidget: "component-browser"
};

export default function(componentFile, templateFile, type) {
  let base = templateFile.replace(EXT_REG, "");
  let name = FILE_NAME_MAP[type];

  if (base === "index") {
    base = "";
  } else {
    name = `.${name}`;
  }

  return base + name + path.extname(componentFile);
}
