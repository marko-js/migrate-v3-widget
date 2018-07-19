import { NodePath } from "@babel/traverse";
import { ObjectProperty, ObjectMethod } from "@babel/types";
import Hub from "../hub";

export default (path: NodePath<ObjectMethod | ObjectProperty>) => {
  const hub = path.hub as Hub;
  hub.usesGetInitialBody = true;
};
