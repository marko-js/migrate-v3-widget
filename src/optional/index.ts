import { types as t } from "@babel/core";
import { NodePath } from "@babel/traverse";
import getInitialState from "./get-initial-state";
import getTemplateData from "./get-template-data";
import renameFile from "./rename-file";

export default (path: NodePath<t.ObjectExpression>) => {
  getInitialState(path);
  getTemplateData(path);
  renameFile(path);
};
