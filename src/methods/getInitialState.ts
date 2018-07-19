import { types as t } from "@babel/core";
import { NodePath } from "@babel/traverse";
import { ObjectProperty, ObjectMethod, ReturnStatement } from "@babel/types";
import getFunctionPath from "../util/get-function-path";
import Hub from "../hub";

export default (path: NodePath<ObjectMethod | ObjectProperty>) => {
  const { onCreate } = (path.hub as Hub).lifecycleMethods;
  const functionPath = getFunctionPath(path);
  const bodyPath = functionPath.get("body");
  const paramsPath = functionPath.get("params");
  const [inputParamPath, outParamPath] = paramsPath;

  if (inputParamPath && inputParamPath.isIdentifier()) {
    bodyPath.scope.rename(inputParamPath.node.name, "input");
  }

  if (outParamPath && outParamPath.isIdentifier()) {
    bodyPath.scope.rename(outParamPath.node.name, "out");
  }

  bodyPath.traverse({
    ReturnStatement(returnStatementPath: NodePath<ReturnStatement>) {
      returnStatementPath.replaceWith(
        t.assignmentExpression(
          "=",
          t.memberExpression(t.thisExpression(), t.identifier("state")),
          returnStatementPath.node.argument
        )
      );
    }
  });

  onCreate.body.body.push(...bodyPath.node.body);
  if (functionPath !== path && functionPath.parentPath !== path) {
    functionPath.remove();
  }
  path.remove();
};
