import fs from "mz/fs";
import { parse, print } from "recast";
import babelParser from "recast/parsers/babel";
import Hub from "./hub";
import visitor from "./visitor";

export interface Options {
  onContext?: (hub: Hub) => void;
}

export default async function migrateFile(
  filename: string,
  options: Options = {}
) {
  const source = await fs.readFile(filename, "utf-8");
  const ast = parse(source, { parser: babelParser });
  const hub = new Hub(filename, source);
  const nodePath = hub.createNodePath(ast);
  if (options.onContext) {
    options.onContext(hub);
  }
  nodePath.traverse(visitor);
  return print(ast);
}
