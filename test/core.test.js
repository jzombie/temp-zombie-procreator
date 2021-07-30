const test = require("tape-async");
const OpenFSCore = require("../src");
const { OpenFSUser } = OpenFSCore;

test("OpenFSCore constructor", (t) => {
  t.plan(3);

  t.throws(
    () => new OpenFSCore(),
    TypeError,
    "does not instantiate without constructor options"
  );

  let = user = null;

  t.doesNotThrow(() => {
    user = new OpenFSUser({
      username: "test",
      userId: "test-id",
    });
  }, "creates user");

  let fs = null;

  t.doesNotThrow(() => {
    fs = new OpenFSCore({ user });
  }, "instantiates without throwing");

  t.end();
});

// TODO: Test export / import structure
