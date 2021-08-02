const test = require("tape-async");
const { OpenFSInode, OpenFSUser } = require("../src");

const { INODE_TYPE_DIRECTORY, INODE_TYPE_FILE, INODE_TYPE_URL } = OpenFSInode;

test("OpenFSInode constructor", (t) => {
  t.plan(4);

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

// TODO: Rename
// TODO: Extract to separate test script
test("OpenFSInode export / import directory structure", (t) => {
  // TODO: Complete

  // TODO: Add plan
  // t.plan(?)

  const owner = new OpenFSUser({ username: "anon", userId: "test-123" });

  let dirInode = null;

  t.doesNotThrow(() => {
    dirInode = new OpenFSInode({
      owner,
      type: INODE_TYPE_DIRECTORY,
      name: "test-directory",
    });
  }, "base dir inode is created");

  t.throws(
    () => {
      dirInode.addChildInode(dirInode);
    },
    ReferenceError,
    "child inode cannot be same instance as parent inode"
  );

  let childDirInode1 = null;

  t.doesNotThrow(() => {
    childDirInode1 = new OpenFSInode({
      owner,
      type: INODE_TYPE_DIRECTORY,
      name: "test-child-directory",
    });
  }, "child dir inode 1 is created");

  t.notOk(
    dirInode.hasChildInode(childDirInode1),
    "base dir inode does not report child dir inode 1 as added before adding"
  );

  t.doesNotThrow(() => {
    dirInode.addChildInode(childDirInode1);
  }, "child dir inode 1 is added to base directory");

  t.ok(
    dirInode.hasChildInode(childDirInode1),
    "base dir inode reports child dir inode 1 as added after adding"
  );

  t.throws(
    () => {
      const dupChildInode = new OpenFSInode({
        owner,
        type: INODE_TYPE_DIRECTORY,
        name: "test-child-directory",
      });

      dirInode.addChildInode(dupChildInode);
    },
    ReferenceError,
    "duplicate child dir cannot be added with same name"
  );

  let childDirInode2 = null;

  t.doesNotThrow(() => {
    childDirInode2 = new OpenFSInode({
      owner,
      type: INODE_TYPE_DIRECTORY,
      name: "test-child-directory2",
    });
  }, "child dir 2 inode is created");

  t.doesNotThrow(() => {
    dirInode.addChildInode(childDirInode2);
  }, "child dir 2 inode is added to base dir");

  // TODO: Ensure parent child cannot be added as sub child to child inode
  t.throws(
    () => {
      childDirInode2.addChildInode(dirInode);
    },
    ReferenceError,
    "child dir 2 cannot add existing inode with a parent"
  );

  t.equals(
    typeof dirInode.getStructure(),
    "object",
    "getStructure is an object"
  );

  // TODO: Remove
  console.log({
    structure: dirInode.getStructure(),
  });

  t.end();
});

test("inode types", (t) => {
  const types = [INODE_TYPE_DIRECTORY, INODE_TYPE_FILE, INODE_TYPE_URL];

  t.plan(types.length * 2);

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

  t.end();
});

// NOTE: Just performing basic tests here as this is mostly handled by a third-
// party library with its own included tests
test("node name", (t) => {
  const validFileNames = ["foo!bar", "hello....world", "test"];

  t.plan(validFileNames.length + 3);

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

  t.end();
});
