import fs from "fs";
import path from "path";
import assert from "assert";
import stripAnsi from "strip-ansi";
import transform from "../src";

const FIXTURES_DIR = path.join(__dirname, "fixtures");

describe("CODEMOD", () => {
  fs.readdirSync(FIXTURES_DIR).forEach(entry => {
    const entryDir = path.join(FIXTURES_DIR, entry);
    const entryFile = path.join(entryDir, "input.js");
    it(entry, async () => {
      try {
        const { code } = await transform(entryFile);
        snapshot(entryDir, "output.js", code);
      } catch (err) {
        if (err.snapshot) {
          throw err;
        }

        snapshot(entryDir, "error.txt", stripAnsi(err.message), err);
      }
    });
  });
});

function snapshot(dir, file, data, originalError?) {
  const { name, ext } = path.parse(file);
  const expectedFile = path.join(dir, `${name}.expected${ext}`);
  const actualFile = path.join(dir, `${name}.actual${ext}`);

  fs.writeFileSync(actualFile, data, "utf-8");

  if (process.env.UPDATE_EXPECTATIONS) {
    fs.writeFileSync(expectedFile, data, "utf-8");
  } else {
    const expected = fs.existsSync(expectedFile)
      ? fs.readFileSync(expectedFile, "utf-8")
      : "";

    try {
      assert.equal(data, expected);
    } catch (err) {
      err.snapshot = true;
      err.name = err.name.replace(" [ERR_ASSERTION]", "");
      err.message = `${path.relative(process.cwd(), actualFile)}\n\n${
        err.message
      }`;

      throw originalError || err;
    }
  }
}
