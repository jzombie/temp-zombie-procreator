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

test("OpenFSUser structure export / import", (t) => {
  t.plan(3);

  const username = "test";
  const userId = "test-id";

  const user = new OpenFSUser({
    username,
    userId,
  });

  const structure = user.getStructure();

  let newUser = null;

  t.doesNotThrow(() => {
    newUser = OpenFSUser.createFromStructure(structure);

    OpenFSUser.validateUser(newUser);
  }, "new user is created from structure");

  t.equals(newUser.getUsername(), username, "imported username matches");
  t.equals(newUser.getUserId(), userId, "imported userId matches");

  t.end();
});
