import { MemberExpression, Identifier } from "@babel/types";
import { NodePath } from "@babel/traverse";
import getWidget from "./getWidget";
import getWidgets from "./getWidgets";

const MEMBER_LOOKUP = {
  getWidget,
  getWidgets
};

export default function(path: NodePath<MemberExpression>): void {
  const identifier = path.get("property") as NodePath<Identifier>;
  const transformer = MEMBER_LOOKUP[identifier.node.name];
  if (transformer) {
    transformer(path);
  }
}
