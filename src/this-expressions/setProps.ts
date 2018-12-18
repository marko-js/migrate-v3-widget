import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

export default (path: NodePath<t.MemberExpression>) => {
  const { parent } = path;
  if (!t.isCallExpression(parent)) {
    return;
  }

  const {
    arguments: [arg]
  } = parent;
  if (!t.isExpression(arg)) {
    return;
  }

  path.parentPath.replaceWith(
    t.assignmentExpression(
      "=",
      t.memberExpression(t.thisExpression(), t.identifier("input")),
      arg
    )
  );
};
