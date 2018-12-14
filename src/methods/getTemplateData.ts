import { NodePath } from "@babel/traverse";
import { ObjectProperty, ObjectMethod } from "@babel/types";
import Hub from "../hub";

export default (path: NodePath<ObjectMethod | ObjectProperty>) => {
  const hub = path.hub as Hub;
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
};
