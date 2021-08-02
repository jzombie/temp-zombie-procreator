const test = require("tape-async");
const { OpenFSInode, OpenFSUser } = require("../src");

const { INODE_TYPE_DIRECTORY, L } = OpenFSInode;

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
