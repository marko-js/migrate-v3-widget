import { types as t } from "@babel/core";
import { NodePath } from "@babel/traverse";
import Hub from "../hub";
import getNewComponentPath from "../util/get-new-component-path";

export default (path: NodePath<t.ObjectExpression>) => {
  const hub = path.hub as Hub;
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
      const wasEntryPoint = hub.widgetType === "defineComponent";
      const templateFile = hub.options.templateFile;
      const newTemplateFile = wasEntryPoint
        ? componentFile.replace(/\.[^.]+$/, ".marko")
        : templateFile;
      const newFile = getNewComponentPath(
        componentFile,
        newTemplateFile,
        hub.widgetType
      );

      if (templateFile !== newTemplateFile) {
        await helper.run("updateFilePath", {
          from: templateFile,
          to: newTemplateFile
        });

        await helper.run("updateDependentPaths", {
          from: templateFile,
          to: newTemplateFile
        });
      }

      await helper.run("updateFilePath", {
        from: componentFile,
        to: newFile
      });

      await helper.run("updateDependentPaths", {
        from: componentFile,
        to: wasEntryPoint ? newTemplateFile : newFile
      });
    }
  });
};
