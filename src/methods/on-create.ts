import { types as t } from "@babel/core";

export const name = "onCreate";
export const params = ["input", "out"];
export const parts = [
  {
    method: "getInitialState",
    replaceParams: ["input", "out"],
    returnAs: t.memberExpression(t.thisExpression(), t.identifier("state"))
  }
];
