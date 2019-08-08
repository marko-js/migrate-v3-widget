import { types as t } from "@babel/core";
import { NodePath } from "@babel/traverse";
import getFunctionPath from "./get-function-path";

export default (
  path: ReturnType<typeof getFunctionPath>
): NodePath<t.BlockStatement> => {
  const bodyPath: NodePath<t.Expression | t.BlockStatement> = path.get("body");

  if (bodyPath.isBlockStatement()) {
    return bodyPath;
  }

  // Replaces arrow functions without a block body to have a block body with an explicit return.
  path.set(
    "body",
    t.blockStatement([t.returnStatement(bodyPath.node as t.Expression)])
  );

  return path.get("body");
};
