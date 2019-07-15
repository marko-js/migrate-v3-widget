import { types as t } from "@babel/core";
import { NodePath } from "@babel/traverse";
import transformMethods from "./methods";
import * as transformOptional from "./optional";
import transformThisExpressions from "./this-expressions";
import Hub from "./hub";

export default {
  CallExpression: {
    enter(path: NodePath<t.CallExpression>) {
      const { parent, node } = path;
      const hub = path.hub as Hub;

      if (isMarkoWidgetsRequire(node)) {
        if (t.isVariableDeclarator(parent)) {
          path.parentPath.remove();
          hub.markoWidgetsIdentifier = parent.id as t.Identifier;
        }
      }
    },
    exit(path: NodePath<t.CallExpression>) {
      const {
        node: { callee }
      } = path;
      const hub = path.hub as Hub;
      const { markoWidgetsIdentifier } = hub;

      if (!t.isMemberExpression(callee) || !t.isIdentifier(callee.property)) {
        return;
      }

      const type = callee.property.name;

      if (type !== "defineComponent" && type !== "defineWidget") {
        return;
      }

      if (markoWidgetsIdentifier) {
        if (
          !t.isIdentifier(callee.object) ||
          callee.object.name !== markoWidgetsIdentifier.name
        ) {
          return;
        }
      } else if (!isMarkoWidgetsRequire(callee.object as t.CallExpression)) {
        return;
      }

      const [argPath] = path.get("arguments");
      if (!argPath.isObjectExpression()) {
        throw argPath.buildCodeFrameError(
          `Can only transform ${type} calls with a plain object as an argument.`
        );
      }

      argPath.get("properties").forEach(propPath => {
        if (propPath.isSpreadElement()) {
          throw propPath.buildCodeFrameError(
            "Cannot transform widgets with object spread."
          );
        }
      });

      hub.widgetType = type;
      transformOptional.preMigrate(argPath);
      transformMethods(argPath);
      transformOptional.postMigrate(argPath);
      path.replaceWith(argPath);
    }
  },
  ThisExpression(path) {
    if (path.parentPath.isMemberExpression()) {
      transformThisExpressions(path.parentPath);
    }
  }
};

function isMarkoWidgetsRequire(node: t.CallExpression) {
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
