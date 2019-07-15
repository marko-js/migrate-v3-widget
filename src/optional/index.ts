import { types as t } from "@babel/core";
import { NodePath } from "@babel/traverse";
import getInitialState from "./get-initial-state";
import getTemplateData from "./get-template-data";
import renameFile from "./rename-file";

export function preMigrate(path: NodePath<t.ObjectExpression>) {
  getInitialState(path);
  getTemplateData(path);
}

export function postMigrate(path: NodePath<t.ObjectExpression>) {
  renameFile(path);
}
