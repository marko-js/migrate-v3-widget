import { types as t } from "@babel/core";
import { NodePath } from "@babel/traverse";

/**
 * Gets a property path on an ObjectExpression ast.
 *
 * @param path The object path to look through
 * @param name The key of the property to get
 */
export default (path: NodePath<t.ObjectExpression>, name: string) => {
  for (const method of path.get("properties")) {
    const node = method.node as t.ObjectMethod | t.ObjectProperty;
    const curName = t.isIdentifier(node.key)
      ? node.key.name
      : t.isStringLiteral(node.key)
      ? node.key.value
      : null;

    if (curName === name) {
      return method as NodePath<t.ObjectMethod | t.ObjectProperty>;
    }
  }
};
