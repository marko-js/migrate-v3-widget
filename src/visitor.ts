import { types as t, PluginObj } from "@babel/core";
import { NodePath } from "@babel/traverse";
import { Identifier, CallExpression } from "@babel/types";
import transformMethods from "./methods";
import transformThisExpressions from "./this-expressions";
import Hub from "./hub";

export default {
  CallExpression: {
    enter(path: NodePath<CallExpression>) {
      const { parent, node } = path;
      const hub = path.hub as Hub;

      if (isMarkoWidgetsRequire(node)) {
        if (t.isVariableDeclarator(parent)) {
          path.parentPath.remove();
          hub.markoWidgetsIdentifier = parent.id as Identifier;
        }
      }
    },
    exit(path: NodePath<CallExpression>) {
      const {
        node: { callee }
      } = path;
      const hub = path.hub as Hub;
      const { markoWidgetsIdentifier } = hub;

      if (
        !t.isMemberExpression(callee) ||
        !t.isIdentifier(callee.property) ||
        callee.property.name !== "defineComponent"
      ) {
        return;
      }

      if (markoWidgetsIdentifier) {
        if (
          !t.isIdentifier(callee.object) ||
          callee.object.name !== markoWidgetsIdentifier.name
        ) {
          return;
        }
      } else if (!isMarkoWidgetsRequire(callee.object as CallExpression)) {
        return;
      }

      const [argPath] = path.get("arguments");
      if (!argPath.isObjectExpression()) {
        return;
      }

      transformMethods(argPath);
      path.replaceWith(argPath);
    }
  },
  ThisExpression(path) {
    if (path.parentPath.isMemberExpression()) {
      transformThisExpressions(path.parentPath);
    }
  }
};

function isMarkoWidgetsRequire(node: CallExpression) {
  const {
    callee,
    arguments: [arg]
  } = node;
  return (
    t.isIdentifier(callee) &&
    callee.name === "require" &&
    t.isStringLiteral(arg) &&
    (arg.value === "marko-widgets" || arg.value === "marko/legacy-components")
  );
}
