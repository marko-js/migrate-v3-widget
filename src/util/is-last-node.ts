import { NodePath } from "@babel/traverse";

/**
 * Checks if a babel NodePath is the last node in it's container.
 */
export default ({ container, node }: NodePath) => {
  return (
    Array.isArray(container) && container.indexOf(node) === container.length - 1
  );
};
