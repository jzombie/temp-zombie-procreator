const PhantomCore = require("phantom-core");

/**
 * @exports
 */
const { EVT_UPDATED } = PhantomCore;

const OpenFSUser = require("./OpenFSUser");

const isValidFilename = require("valid-filename");

/**
 * @exports
 */
const INODE_TYPE_DIRECTORY = "dir";

/**
 * @exports
 */
const INODE_TYPE_FILE = "file";

/**
 * @exports
 */
const INODE_TYPE_URL = "link";

/**
 * Represents a path in the OpenFS filesystem, which describes a directory,
 * file, link, or other path type.
 *
 * Can be exported to an object (via getStructure()) or created from an object.
 *
 * @exports
 */
class OpenFSInode extends PhantomCore {
  /**
   * Validates if the supplied inode is a valid OpenFSInode instance.
   *
   * @param {OpenFSInode} inode
   * @throws {TypeError}
   * @return {void}
   */
  static validateInode(inode) {
    if (!(inode instanceof OpenFSInode)) {
      throw new TypeError("Supplied inode is not a valid OpenFSInode instance");
    }
  }

  /**
   * Ensures the given inodeType is valid.
   *
   * @param {string} inodeType
   * @throws {TypeError} Throws if not a valid inode type which this class
   * recognizes.
   * @return {void}
   */
  static validateType(inodeType) {
    if (
      ![INODE_TYPE_DIRECTORY, INODE_TYPE_FILE, INODE_TYPE_URL].includes(
        inodeType
      )
    ) {
      throw new TypeError(`${inodeType} is not a valid inode type`);
    }
  }

  /**
   * Ensures the given nodeName is a valid directory or file name.
   *
   * @param {string} nodeName
   * @return {void}
   */
  static validateName(nodeName) {
    if (!isValidFilename(nodeName)) {
      throw new ReferenceError(`Invalid node name: ${nodeName}`);
    }
  }

  /**
   * Creates an OpenFSInode from the given object.
   *
   * @param {Object} structure
   * @throws {Error}
   * @return {OpenFSInode}
   */
  static createFromStructure(structure) {
    // TODO: Create user from structure

    return new OpenFSInode(structure);
  }

  // TODO: Document
  constructor(fsNodeOptions) {
    OpenFSUser.validateUser(fsNodeOptions.owner);
    OpenFSInode.validateType(fsNodeOptions.type);
    OpenFSInode.validateName(fsNodeOptions.name);

    super();

    this._owner = fsNodeOptions.owner;
    this._type = fsNodeOptions.type;
    this._name = fsNodeOptions.name;

    this._children = {};
  }

  /**
   * Returns the structure of the inode and all related metadata regarding it.
   *
   * @return {Object} // TODO: Document structure
   */
  getStructure() {
    // TODO: Build

    return {
      [this._name]: {
        __meta__: {
          type: this.getType(),
          // TODO: Handle additional metadata
          // ...
        },
        ...this._children,
      },
    };
  }

  // TODO: Document
  /**
   * @return {Object}
   */
  /*
  getMetaData() {
    const { __meta__: metaData } = this.getStructure();

    return metaData;
  }
  */

  /*
  getSize(isRecursive = true) {
    // TODO: Build
  }
  */

  /**
   * @return {INODE_TYPE_DIRECTORY | INODE_TYPE_FILE | INODE_TYPE_URL}
   */
  getType() {
    return this._type;
  }

  /**
   * @param {string} name
   * @emit {EVT_UPDATED}
   * @return {void}
   */
  setName(name) {
    OpenFSInode.validateName(name);

    this._name = name;
    this.emit(EVT_UPDATED);
  }

  /**
   * @return {string}
   */
  getName() {
    return this._name;
  }

  /**
   * @return {OpenFSUser}
   */
  getOwner() {
    return this._owner;
  }

  /**
   * @param {OpenFSInode} inode
   * @emit {EVT_UPDATED}
   * @return {void}
   */
  addChildInode(inode) {
    // TODO: Ensure we have write permissions for this node and the child node

    OpenFSInode.validateInode(inode);

    if (this.getType() !== INODE_TYPE_DIRECTORY) {
      throw new ReferenceError(
        "Child inode cannot be added to a non-directory inode"
      );
    }

    const childName = inode.getName();

    if (this._children[childName]) {
      throw new ReferenceError(
        `Parent node already has child with name: ${childName}`
      );
    }

    this._children[childName] = inode;

    this.emit(EVT_UPDATED);
  }

  // TODO: Document
  /**
   * @param {OpenFSInode} inode
   * @emit {EVT_UPDATED}
   * @return {void}
   */
  removeChildNode(inode) {
    // TODO: Ensure we have write permissions for this node and the child node

    delete this._children[inode.getName()];

    this.emit(EVT_UPDATED);
  }
}

module.exports = OpenFSInode;
module.exports.INODE_TYPE_DIRECTORY = INODE_TYPE_DIRECTORY;
module.exports.INODE_TYPE_FILE = INODE_TYPE_FILE;
module.exports.INODE_TYPE_URL = INODE_TYPE_URL;
module.exports.EVT_UPDATED = EVT_UPDATED;
