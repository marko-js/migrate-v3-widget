import { types as t } from "@babel/core";
import { NodePath } from "@babel/traverse";

export const name = "onMount";
export const parts = [
  {
    method: "init",
    replaceParams: ["widgetConfig"],
    map(
      functionPath: NodePath<
        t.ObjectMethod | t.FunctionExpression | t.FunctionDeclaration
      >
    ) {
      const widgetConfigName = "widgetConfig";
      const functionBodyBlock = functionPath.get("body");
      const functionBodyContent = functionBodyBlock.node.body;
      const widgetConfigIdentifier = t.identifier(widgetConfigName);
      const widgetConfigBinding = functionBodyBlock.scope.getBinding(
        widgetConfigName
      );

      if (!widgetConfigBinding) {
        return functionBodyContent;
      }

      if (!widgetConfigBinding.references) {
        widgetConfigBinding.path.remove();
        return functionBodyContent;
      }

      return [
        t.variableDeclaration("var", [
          t.variableDeclarator(
            widgetConfigIdentifier,
            t.memberExpression(t.thisExpression(), widgetConfigIdentifier)
          )
        ]),
        ...functionBodyContent
      ];
    }
  },
  {
    method: "onRender",
    map() {
      return [
        t.expressionStatement(
          t.callExpression(
            t.memberExpression(
              t.thisExpression(),
              t.identifier("onRenderLegacy")
            ),
            [
              t.objectExpression([
                t.objectProperty(
                  t.identifier("firstRender"),
                  t.booleanLiteral(true)
                )
              ])
            ]
          )
        )
      ];
    }
  }
];
