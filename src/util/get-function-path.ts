import { types as t } from "@babel/core";
import { NodePath } from "@babel/traverse";

export default (
  path: NodePath<t.ObjectMethod | t.ObjectProperty>,
  { params = [] }: { params: string[] }
) => {
  if (path.isObjectMethod()) {
    return path;
  }

  const valuePath = path.get("value") as NodePath;
  if (valuePath.isFunctionExpression()) {
    return valuePath;
  }

  if (valuePath.isIdentifier()) {
    const binding = valuePath.scope.getBinding(valuePath.node.name);

    if (binding) {
      if (binding.references > 1) {
        const paramIdentifiers = params.map(p => t.identifier(p));
        valuePath.replaceWith(
          t.functionExpression(
            null,
            paramIdentifiers,
            t.blockStatement([
              t.returnStatement(
                t.callExpression(
                  t.memberExpression(valuePath.node, t.identifier("call")),
                  [t.thisExpression(), ...paramIdentifiers]
                )
              )
            ])
          )
        );

        return (valuePath as any) as NodePath<t.FunctionExpression>;
      } else if (binding.path.isFunctionDeclaration()) {
        return binding.path;
      }
    }
  }

  throw path.buildCodeFrameError(
    `Could not migrate ${path.node.key.name}, unable to find the function.`
  );
};
