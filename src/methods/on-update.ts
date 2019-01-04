import { types as t } from "@babel/core";

export const name = "onUpdate";
export const parts = [
  {
    method: "onUpdate"
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
                  t.booleanLiteral(false)
                )
              ])
            ]
          )
        )
      ];
    }
  }
];
