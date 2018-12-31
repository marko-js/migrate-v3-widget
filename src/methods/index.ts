import { types as t } from "@babel/core";
import {
  ObjectMethod,
  ObjectExpression,
  ObjectProperty,
  Identifier
} from "@babel/types";
import { NodePath } from "@babel/traverse";
import getTemplateData from "./getTemplateData";
import getInitialProps from "./getInitialProps";
import getInitialState from "./getInitialState";
import init from "./init";
import onBeforeDestroy from "./onBeforeDestroy";
import onDestroy from "./onDestroy";
import onRender from "./onRender";
import onUpdate from "./onUpdate";
import onBeforeUpdate from "./onBeforeUpdate";
import getWidgetConfig from "./getWidgetConfig";
import getInitialBody from "./getInitialBody";
import template from "./template";
import Hub from "../hub";
import getNewComponentPath from "../util/get-new-component-path";

const METHOD_LOOKUP = {
  template,
  getTemplateData,
  getInitialProps,
  getInitialState,
  getInitialBody,
  getWidgetConfig,
  onRender,
  init,
  onBeforeUpdate,
  onUpdate,
  onBeforeDestroy,
  onDestroy
};

export default function(
  path: NodePath<ObjectExpression>,
  type: "defineComponent" | "defineWidget"
): void {
  const { node } = path;
  const hub = path.hub as Hub;
  hub.lifecycleMethods = {
    onCreate: createLifecycleMethod("onCreate", ["input", "out"]),
    onInput: createLifecycleMethod("onInput", ["input", "out"]),
    onRender: createLifecycleMethod("onRender", ["out"]),
    onMount: createLifecycleMethod("onMount"),
    onUpdate: createLifecycleMethod("onUpdate"),
    onDestroy: createLifecycleMethod("onDestroy")
  };

  path.get("properties").forEach(propPath => {
    if (propPath.isSpreadElement()) {
      throw path.buildCodeFrameError(
        "Cannot transform widgets with object spread."
      );
    }

    const propNode = propPath.node as ObjectMethod | ObjectProperty;
    let prop;
    if (t.isIdentifier(propNode.key)) {
      prop = propNode.key.name;
    } else if (t.isStringLiteral(propNode.key)) {
      prop = propNode.key.value;
    } else {
      return;
    }

    const transform = METHOD_LOOKUP[prop];
    if (transform) {
      transform(propPath);
    }
  });

  const lifecycleMethods = Object.values(hub.lifecycleMethods).filter(
    ({ body }) => body.body.length
  );

  node.properties.push(...lifecycleMethods);

  path.get("properties").forEach(propPath => {
    if (!propPath.isObjectMethod()) {
      return;
    }

    if (!lifecycleMethods.includes(propPath.node)) {
      return;
    }

    const params = propPath.node.params as Identifier[];
    const bodyPath = propPath.get("body");
    params.forEach(({ name }) => {
      const binding = bodyPath.scope.getBinding(name);
      if (!binding.references) {
        binding.path.remove();
      }
    });
  });

  hub.addMigration({
    async apply(helper) {
      const shouldRename = await helper.prompt({
        type: "confirm",
        message:
          "Would you like to rename the component file?\n" +
          "Note: Marko 4 automatically discovers these files based on the naming convention, you may be able to remove them from a browser.json file after this.",
        initial: true
      });

      if (!shouldRename) {
        return;
      }

      const componentFile = hub.filename;
      const templateFile = hub.options.templateFile;
      const newFile = getNewComponentPath(componentFile, templateFile, type);

      await helper.run("updateFilePath", {
        from: componentFile,
        to: newFile
      });

      if (type !== "defineComponent") {
        await helper.run("updateDependentPaths", {
          from: componentFile,
          to: newFile
        });
      }
    }
  });
}

function createLifecycleMethod(name, params = []) {
  return t.objectMethod(
    "method",
    t.identifier(name),
    params.map(param => t.identifier(param)),
    t.blockStatement([])
  );
}
