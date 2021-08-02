const PhantomCore = require("phantom-core");
const SyncObject = require("sync-object");
const OpenFSInode = require("./OpenFSInode");
const OpenFSUser = require("./OpenFSUser");

const { INODE_TYPE_DIRECTORY, INODE_TYPE_FILE, INODE_TYPE_URL } = OpenFSInode;

/**
 * Unix-like directory separator.
 *
 * @exports
 */
const DIR_SEPARATOR = "/";

/**
 * @exports
 */
const ROOT_DIR_NAME = "root";

/**
 * @exports
 */
const HOME_DIR_PARENT_NAME = "home";

/**
 * A simplistic, Unix-inspired directory / file mapper intended for intranet
 * usage.
 *
 * @exports
 */
class OpenFSCore extends PhantomCore {
  /**
   * @param {Object} structure
   * @throws {Error}
   * @return {OpenFSCore}
   */
  static createFromStructure(structure) {
    // TODO: Build
  }

  // TODO: Document
  constructor(fsCoreOptions) {
    OpenFSUser.validateUser(fsCoreOptions.user);

    const username = fsCoreOptions.user.getUsername();

    const DEFAULT_STATE = {
      // TODO: Use OpenFSInode structure
      fsStructure: {
        // TODO: Use inodes instead of manually creating this
        [ROOT_DIR_NAME]: {
          __meta__: {
            type: INODE_TYPE_DIRECTORY,
          },
          [HOME_DIR_PARENT_NAME]: {
            __meta__: {
              type: INODE_TYPE_DIRECTORY,
            },
            [username]: {
              __meta__: {
                type: INODE_TYPE_DIRECTORY,
              },
              "speaker.app": {
                __meta__: {
                  type: INODE_TYPE_URL,
                  src: "https://speaker.app",
                },
              },
              "zenosmosis.com": {
                __meta__: {
                  type: INODE_TYPE_URL,
                  src: "https://zenosmosis.com",
                },
              },
            },
          },
        },
      },
    };

    super();

    // mergeOptions is inherited via PhantomCore
    // TODO: Rework using inode branching
    const initialState = SyncObject.mergeState(DEFAULT_STATE, {
      user: fsCoreOptions.user.getStructure(),
      fsStructure: fsCoreOptions.fsStructure,
    });

    this._syncObject = new SyncObject(initialState);

    this._user = user;

    /**
     * Defaults to user's home directory.
     *
     * @type {string}
     **/
    this._pwd = `${DIR_SEPARATOR}${HOME_DIR_PARENT_NAME}${DIR_SEPARATOR}${username}`;
  }

  // TODO: Document
  /**
   * @return {Object} // TODO: Document structure
   */
  getStructure() {
    // TODO: Build
  }

  // TODO: Document
  dir() {
    return this._pwd;
  }

  /**
   * @return {OpenFSUser}
   */
  getUser() {
    return this._user;
  }

  async mkdir(path, options = {}) {
    const DEFAULT_OPTIONS = {
      recursive: false,
    };

    // TODO: Build
  }

  async rmdir(path, options = {}) {
    const DEFAULT_OPTIONS = {
      recursive: false,
    };

    // TODO: Build
  }

  chdir(path) {
    // TODO: Build
    // TODO: Throw if invalid directory
    // TODO: Throw if directory doesn't exist
  }

  // NOTE: This intentionally differs from Node.js writeFile in the sense that it doesn't store the content directly via this operation
  async writeFile(path, readHandler) {
    // TODO: Build
  }

  async readFile(path) {
    // TODO: Build
    // TODO: Obtain read handler from file and expost it
  }

  async mountfs(path) {
    // TODO: Build
  }

  async unmountfs(path) {
    // TODO: Build
  }

  async ls() {
    // TODO: Build
    // TODO: Show content based off of this._pwd
  }
}

module.exports = OpenFSCore;
module.exports.DIR_SEPARATOR = DIR_SEPARATOR;
module.exports.ROOT_DIR_NAME = ROOT_DIR_NAME;
module.exports.HOME_DIR_PARENT_NAME = HOME_DIR_PARENT_NAME;
