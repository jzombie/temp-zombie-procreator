const test = require("tape-async");
const { OpenFSUser } = require("../src");

test("OpenFSUser constructor", (t) => {
  t.plan(3);

  t.throws(
    () => {
      new OpenFSUser();
    },
    TypeError,
    "does not instantiate without constructor args"
  );

  t.doesNotThrow(() => {
    const user = new OpenFSUser({
      username: "test",
      userId: "test-id",
    });

    OpenFSUser.validateUser(user);
  });

  t.throws(
    () => {
      OpenFSUser.validateUser({});
    },
    TypeError,
    "validate user throws TypeError when checking non-valid user"
  );

  t.end();
});

// TODO: Test export / import structure
