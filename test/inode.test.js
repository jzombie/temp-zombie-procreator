const test = require("tape-async");
const { OpenFSInode, OpenFSUser } = require("../src");

const { INODE_TYPE_DIRECTORY, INODE_TYPE_FILE, INODE_TYPE_URL, EVT_UPDATED } =
  OpenFSInode;

test("OpenFSInode constructor", (t) => {
  t.plan(5);

  t.throws(
    () => {
      OpenFSInode.validateInode({});
    },
    TypeError,
    "determines invalid inode"
  );

  t.throws(
    () => new OpenFSInode(),
    TypeError,
    "does not instantiate without constructor options"
  );

  t.doesNotThrow(() => {
    const inode = new OpenFSInode({
      owner: new OpenFSUser({ username: "anon", userId: "test-123" }),
      type: INODE_TYPE_DIRECTORY,
      name: "test-directory",
    });

    OpenFSInode.validateInode(inode);
  }, "instantiates directory without throwing");

  t.doesNotThrow(() => {
    const inode = new OpenFSInode({
      owner: new OpenFSUser({ username: "anon", userId: "test-123" }),
      type: INODE_TYPE_FILE,
      name: "test-file",
    });

    OpenFSInode.validateInode(inode);
  }, "instantiates file without throwing");

  t.doesNotThrow(() => {
    const inode = new OpenFSInode({
      owner: new OpenFSUser({ username: "anon", userId: "test-123" }),
      type: INODE_TYPE_URL,
      name: "test-url",
    });

    OpenFSInode.validateInode(inode);
  }, "instantiates url without throwing");

  t.end();
});

test("inode types", (t) => {
  t.plan(7);

  const types = [INODE_TYPE_DIRECTORY, INODE_TYPE_FILE, INODE_TYPE_URL];

  const checkedInodeTypes = [];

  types.forEach((inodeType) => {
    t.ok(
      typeof inodeType === "string",
      `inode type "${inodeType}" is a string`
    );

    t.ok(
      !checkedInodeTypes.includes(inodeType),
      `inode type "${inodeType}" is unique`
    );

    checkedInodeTypes.push(inodeType);
  });

  t.throws(
    () => {
      OpenFSInode.validateType("invalid-inode-type");
    },
    TypeError,
    "throws TypeError when validating invalid type"
  );

  t.end();
});

// NOTE: Just performing basic tests here as this is mostly handled by a third-
// party library with its own included tests
test("node name", async (t) => {
  t.plan(9);

  const validFileNames = ["foo!bar", "hello....world", "test"];

  validFileNames.forEach((fileName) => {
    t.doesNotThrow(
      () => OpenFSInode.validateName(fileName),
      `"${fileName}" is a valid node name`
    );
  });

  t.throws(
    () => OpenFSInode.validateName("s".repeat(256)),
    ReferenceError,
    "node name longer than 255 characters throws ReferenceError"
  );

  t.throws(
    () => OpenFSInode.validateName("s\1"),
    ReferenceError,
    "node name with backslash () throws ReferenceError"
  );

  t.throws(
    () => OpenFSInode.validateName("s/1"),
    ReferenceError,
    "node name with forward slash (/) throws ReferenceError"
  );

  const inode = new OpenFSInode({
    owner: new OpenFSUser({ username: "anon", userId: "test-123" }),
    type: INODE_TYPE_URL,
    name: "test-url",
  });

  t.throws(
    () => inode.setName("s\1"),
    ReferenceError,
    "throws when setting invalid name to existing inode"
  );

  t.doesNotThrow(async () => {
    await Promise.all([
      new Promise((resolve) => {
        inode.once(EVT_UPDATED, () => {
          resolve();
        });
      }),
      inode.setName("new-name"),
    ]);
  }, "does not throw when setting new name");

  t.equals(inode.getName(), "new-name", "inode obtains new name");

  t.end();
});
