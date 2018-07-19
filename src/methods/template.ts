import { NodePath } from "@babel/traverse";
import { ObjectProperty, ObjectMethod } from "@babel/types";

export default (path: NodePath<ObjectMethod | ObjectProperty>) => {
  const valuePath = path.get("value") as NodePath;
  if (valuePath.isIdentifier()) {
    path.scope.getBinding(valuePath.node.name).path.remove();
  }

  path.remove();
};
