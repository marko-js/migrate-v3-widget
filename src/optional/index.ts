import { types as t } from "@babel/core";
import { NodePath } from "@babel/traverse";
import getTemplateData from "./get-template-data";
import renameFile from "./rename-file";

export default (path: NodePath<t.ObjectExpression>) => {
  getTemplateData(path);
  renameFile(path);
};
