import { NodePath } from "@babel/traverse";
import { ObjectProperty, ObjectMethod } from "@babel/types";
import getFunctionPath from "../util/get-function-path";
import Hub from "../hub";

export default (path: NodePath<ObjectMethod | ObjectProperty>) => {
  const { onRender } = (path.hub as Hub).lifecycleMethods;
  const functionPath = getFunctionPath(path);
  const bodyPath = functionPath.get("body");
  onRender.body.body.unshift(...bodyPath.node.body);
  if (functionPath !== path && functionPath.parentPath !== path) {
    functionPath.remove();
  }
  path.remove();
};
