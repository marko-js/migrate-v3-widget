import { types as t } from "@babel/core";
import { NodePath } from "@babel/traverse";
import getWidget from "./getWidget";
import getWidgets from "./getWidgets";
import setProps from "./setProps";

const MEMBER_LOOKUP = {
  getWidget,
  getWidgets,
  setProps
};

export default function(path: NodePath<t.MemberExpression>): void {
  const identifier = path.get("property") as NodePath<t.Identifier>;
  const transformer = MEMBER_LOOKUP[identifier.node.name];
  if (transformer) {
    transformer(path);
  }
}
