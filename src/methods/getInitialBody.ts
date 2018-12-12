import { NodePath } from "@babel/traverse";
import { ObjectProperty, ObjectMethod } from "@babel/types";
import Hub from "../hub";

export default (path: NodePath<ObjectMethod | ObjectProperty>) => {
  const hub = path.hub as Hub;
  hub.addMigrator({
    apply(helper) {
      if (helper.has("getInitialBody")) {
        return helper.run("getInitialBody");
      }

      console.warn(
        "Unable to migrate 'getInitialBody' method, you must first upgrade Marko"
      );
    }
  });
};
