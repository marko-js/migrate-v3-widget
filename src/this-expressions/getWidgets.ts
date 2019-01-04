import { types as t } from "@babel/core";
import { NodePath } from "@babel/traverse";

export default (path: NodePath<t.MemberExpression>) => {
  (path.get("property") as NodePath<t.Identifier>).node.name = "getComponents";
};
