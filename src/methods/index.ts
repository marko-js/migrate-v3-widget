import { types as t } from "@babel/core";
import { NodePath } from "@babel/traverse";
import getFunctionPath from "../util/get-function-path";
import getObjectMethod from "../util/get-object-method";
import isLastNode from "../util/is-last-node";
import Hub from "../hub";

import * as onCreateTransform from "./on-create";
import * as onDestroyTransform from "./on-destroy";
import * as onInputTransform from "./on-input";
import * as onMountTransform from "./on-mount";
import * as onRenderLegacyTransform from "./on-render-legacy";
import * as onRenderTransform from "./on-render";
import * as onUpdate from "./on-update";

const LIFECYCLE_MAP: Array<{
  name: string;
  params?: string[];
  parts: Array<{
    method: string;
    replaceParams?: string[];
    returnAs?: t.LVal;
    map?(
      body: NodePath<
        | t.ObjectMethod
        | t.FunctionExpression
        | t.FunctionDeclaration
        | t.ArrowFunctionExpression
      >
    ): t.Statement[];
  }>;
}> = [
  onCreateTransform,
  onInputTransform,
  onRenderTransform,
  onMountTransform,
  onUpdate,
  onDestroyTransform,
  onRenderLegacyTransform
];

export default function(path: NodePath<t.ObjectExpression>): void {
  const { node } = path;
  const removePaths: NodePath[] = [];
  const newProperties = LIFECYCLE_MAP.map(({ name, params = [], parts }) => {
    const statements = [];

    for (const part of parts) {
      const oldMethod = getObjectMethod(path, part.method);
      if (!oldMethod) {
        continue;
      }

      const functionPath = getFunctionPath(oldMethod, {
        params: part.replaceParams
      });
      const bodyPath = functionPath.get("body");

      // Update param names to be consistent.
      if (part.replaceParams) {
        functionPath.get("params").forEach((paramPath, i) => {
          const replaceParam = part.replaceParams[i];

          if (paramPath.isIdentifier()) {
            bodyPath.scope.rename(paramPath.node.name, replaceParam);
          }
        });
      }

      // Map previous lifecycle returns to assignments.
      let mustWrapInIIFE = false;
      let lastReturnStatementPath: NodePath<t.ReturnStatement>;
      bodyPath.traverse({
        ReturnStatement(returnStatementPath: NodePath<t.ReturnStatement>) {
          if (
            bodyPath.scope !== returnStatementPath.scope.getFunctionParent()
          ) {
            return;
          }

          if (
            returnStatementPath.parentPath !== bodyPath ||
            !isLastNode(returnStatementPath)
          ) {
            mustWrapInIIFE = true;
            returnStatementPath.stop();
          }

          lastReturnStatementPath = returnStatementPath;
        }
      });

      if (mustWrapInIIFE) {
        let replacement: t.Node = t.callExpression(
          t.arrowFunctionExpression([], bodyPath.node),
          []
        );

        if (part.returnAs) {
          replacement = t.assignmentExpression("=", part.returnAs, replacement);
        }

        bodyPath.replaceWith(
          t.blockStatement([t.expressionStatement(replacement)])
        );
      } else if (lastReturnStatementPath) {
        if (part.returnAs) {
          lastReturnStatementPath.replaceWith(
            t.assignmentExpression(
              "=",
              part.returnAs,
              lastReturnStatementPath.node.argument
            )
          );
        } else {
          lastReturnStatementPath.replaceWith(
            lastReturnStatementPath.node.argument
          );
        }
      }

      // Remove references to the old method.
      if (functionPath !== oldMethod && functionPath.parentPath !== oldMethod) {
        removePaths.push(functionPath);
      }

      removePaths.push(oldMethod);
      statements.push(
        ...(part.map ? part.map(functionPath) : bodyPath.node.body)
      );
    }

    if (!statements.length) {
      return;
    }

    return t.objectMethod(
      "method",
      t.identifier(name),
      params.map(p => t.identifier(p)),
      t.blockStatement(statements)
    );
  }).filter(Boolean);

  const templateProp = getObjectMethod(path, "template");
  if (templateProp) {
    const templateValue = templateProp.get("value") as NodePath;
    if (templateValue.isIdentifier()) {
      templateProp.scope.getBinding(templateValue.node.name).path.remove();
    }

    templateProp.remove();
  }

  removePaths.forEach(it => it.removed || it.remove());
  node.properties.push(...newProperties);

  // Remove unused params from new lifecycle methods.
  path.get("properties").forEach(propPath => {
    if (!propPath.isObjectMethod() || !newProperties.includes(propPath.node)) {
      return;
    }

    propPath.get("params").forEach(paramPath => {
      const binding = paramPath.scope.getBinding(
        (paramPath.node as t.Identifier).name
      );
      if (!binding.references) {
        paramPath.remove();
      }
    });
  });
}
