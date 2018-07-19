import { types as t } from "@babel/core";
import { NodePath } from "@babel/traverse";
import { ObjectProperty, ObjectMethod } from "@babel/types";
import getFunctionPath from "../util/get-function-path";
import Hub from "../hub";

export default (path: NodePath<ObjectMethod | ObjectProperty>) => {
  const { onMount } = (path.hub as Hub).lifecycleMethods;
  const functionPath = getFunctionPath(path);
  const bodyPath = functionPath.get("body");
  const paramsPath = functionPath.get("params");
  const [configParam] = paramsPath;

  if (configParam && configParam.isIdentifier()) {
    const widgetConfigIdentifier = t.identifier("widgetConfig");
    bodyPath
      .get("body")[0]
      .insertBefore(
        t.variableDeclaration("var", [
          t.variableDeclarator(
            widgetConfigIdentifier,
            t.memberExpression(t.thisExpression(), widgetConfigIdentifier)
          )
        ])
      );
    bodyPath.scope.rename(configParam.node.name, "widgetConfig");
  }

  onMount.body.body.push(...bodyPath.node.body);
  if (functionPath !== path && functionPath.parentPath !== path) {
    functionPath.remove();
  }
  path.remove();
};
