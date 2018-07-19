import { relative } from "path";
import { Hub as BabelHub, NodePath, Scope } from "@babel/traverse";
import { codeFrameColumns } from "@babel/code-frame";
import { File, Node, Program, Identifier, ObjectMethod } from "@babel/types";
const CWD = process.cwd();

export default class Hub extends BabelHub {
  public markoWidgetsIdentifier?: Identifier;
  public lifecycleMethods?: {
    onCreate: ObjectMethod;
    onInput: ObjectMethod;
    onRender: ObjectMethod;
    onMount: ObjectMethod;
    onUpdate: ObjectMethod;
    onDestroy: ObjectMethod;
  };
  public usesGetTemplateData?: boolean;
  public usesGetInitialBody?: boolean;

  constructor(
    public filename: string,
    public code: string,
    public options = {}
  ) {
    super(filename, options);
    this.code = code;
    this.options = options;
    this.filename = filename;
  }

  public getCode(): string {
    return this.code;
  }

  public buildError(node: Node, msg: string): SyntaxError {
    const { loc } = node;
    const frame = codeFrameColumns(this.code, loc, { highlightCode: true });
    const position = `(${loc.start.line},${loc.start.column})`;
    return new SyntaxError(
      `${relative(CWD, this.filename)}${position}: ${msg}\n${frame}`
    );
  }

  public createNodePath(ast: File) {
    const nodePath = new NodePath(this as any, ast);
    nodePath.node = ast;
    nodePath.scope = new Scope(nodePath.get("program") as NodePath<Program>);
    (nodePath.scope as any).init();

    return nodePath;
  }
}
