import { NodePath } from "@babel/traverse";
import { MemberExpression, Identifier } from "@babel/types";

export default (path: NodePath<MemberExpression>) => {
  (path.get("property") as NodePath<Identifier>).node.name = "getComponents";
};
