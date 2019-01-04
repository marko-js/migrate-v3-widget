import { types as t } from "@babel/core";
import { NodePath } from "@babel/traverse";
import getObjectMethod from "../util/get-object-method";
import Hub from "../hub";

export default (path: NodePath<t.ObjectExpression>) => {
  const hub = path.hub as Hub;
  const getTemplateDataProp = getObjectMethod(path, "getTemplateData");
  if (getTemplateDataProp) {
    hub.addMigration({
      apply(helper) {
        if (helper.has("getTemplateData")) {
          return helper.run("getTemplateData");
        }

        console.warn(
          "Unable to migrate 'getTemplateData' method, you must first upgrade Marko"
        );
      }
    });
  }
};
