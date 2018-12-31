import fs from "mz/fs";
import { parse, print } from "recast";
import babelParser from "recast/parsers/babel";
import Hub from "./hub";
import visitor from "./visitor";

export interface Options {
  templateFile: string;
  onContext?: (hub: Hub) => void;
}

export default async function migrateFile(
  filename: string,
  options: Options = { templateFile: "" }
) {
  const source = await fs.readFile(filename, "utf-8");
  const ast = parse(source, { parser: babelParser });
  const hub = new Hub(filename, source, options);
  const nodePath = hub.createNodePath(ast);
  if (options.onContext) {
    options.onContext(hub);
  }
  nodePath.traverse(visitor);
  return print(ast).code;
}
