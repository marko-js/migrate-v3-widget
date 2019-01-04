import { types as t } from "@babel/core";

export const name = "onInput";
export const params = ["input", "out"];
export const parts = [
  {
    method: "getInitialProps",
    replaceParams: ["input", "out"],
    returnAs: t.memberExpression(t.thisExpression(), t.identifier("input"))
  },
  {
    method: "getWidgetConfig",
    replaceParams: ["input", "out"],
    returnAs: t.memberExpression(
      t.thisExpression(),
      t.identifier("widgetConfig")
    )
  },
  {
    method: "getInitialBody",
    replaceParams: ["input", "out"],
    returnAs: t.memberExpression(
      t.memberExpression(t.thisExpression(), t.identifier("input")),
      t.identifier("renderBody")
    )
  }
];
