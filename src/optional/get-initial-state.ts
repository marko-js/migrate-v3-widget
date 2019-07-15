import { types as t } from "@babel/core";
import { NodePath } from "@babel/traverse";
import getObjectMethod from "../util/get-object-method";
import Hub from "../hub";

export default (path: NodePath<t.ObjectExpression>) => {
  const hub = path.hub as Hub;
  if (
    !getObjectMethod(path, "getTemplateData") &&
    getObjectMethod(path, "getInitialState")
  ) {
    hub.addMigration({
      apply(helper) {
        if (helper.has("dataIsState")) {
          return helper.run("dataIsState");
        }

        console.warn(
          "Unable to fully migrate 'getInitialState' method, you must first upgrade Marko"
        );
      }
    });
  }
};
