import { types as t } from "@babel/core";
import { NodePath } from "@babel/traverse";
import { ObjectProperty, ObjectMethod } from "@babel/types";
import Hub from "../hub";

export default (path: NodePath<ObjectMethod | ObjectProperty>) => {
  const { node } = path;
  const { onMount, onUpdate } = (path.hub as Hub).lifecycleMethods;

  onMount.body.body.push(
    t.expressionStatement(
      t.callExpression(
        t.memberExpression(t.thisExpression(), t.identifier("legacyOnRender")),
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
  );

  onUpdate.body.body.push(
    t.expressionStatement(
      t.callExpression(
        t.memberExpression(t.thisExpression(), t.identifier("legacyOnRender")),
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
  );
  node.key = t.identifier("legacyOnRender");
};
