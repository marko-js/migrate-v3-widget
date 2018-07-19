import { NodePath } from "@babel/traverse";
import { ObjectMethod, ObjectProperty } from "@babel/types";

export default (path: NodePath<ObjectMethod | ObjectProperty>) => {
  if (path.isObjectMethod()) {
    return path;
  }

  const valuePath = path.get("value") as NodePath;
  if (valuePath.isFunctionExpression()) {
    return valuePath;
  }

  if (valuePath.isIdentifier()) {
    const binding = valuePath.scope.getBinding(valuePath.node.name);
    if (binding && binding.path.isFunctionDeclaration()) {
      return binding.path;
    }
  }

  throw path.buildCodeFrameError(
    "Can only migrate getInitialProps where the function is inline with the component definition."
  );
};
