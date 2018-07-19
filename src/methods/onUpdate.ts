import { NodePath } from "@babel/traverse";
import { ObjectProperty, ObjectMethod } from "@babel/types";
import getFunctionPath from "../util/get-function-path";
import Hub from "../hub";

export default (path: NodePath<ObjectMethod | ObjectProperty>) => {
  const { onUpdate } = (path.hub as Hub).lifecycleMethods;
  const functionPath = getFunctionPath(path);
  const bodyPath = functionPath.get("body");
  onUpdate.body.body.push(...bodyPath.node.body);
  if (functionPath !== path && functionPath.parentPath !== path) {
    functionPath.remove();
  }
  path.remove();
};
