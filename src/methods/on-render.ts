import { types as t } from "@babel/core";
import { NodePath } from "@babel/traverse";

export const name = "onRender";
export const parts = [
  {
    method: "onBeforeUpdate",
    map(functionPath: NodePath<t.FunctionExpression>) {
      return [
        t.ifStatement(
          t.binaryExpression(
            "!==",
            t.unaryExpression("typeof", t.identifier("window"), true),
            t.stringLiteral("undefined")
          ),
          functionPath.get("body").node
        )
      ];
    }
  }
];
