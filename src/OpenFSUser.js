const PhantomCore = require("phantom-core");

/**
 * @exports
 */
const { EVT_UPDATED, EVT_DESTROYED } = PhantomCore;

/**
 * TODO: Document
 *
 * @exports
 */
class OpenFSUser extends PhantomCore {
  /**
   * Validates if the supplied user is a valid OpenFSUser instance.
   *
   * @param {OpenFSUser} user
   * @throw {TypeError}
   * @return {void}
   */
  static validateUser(user) {
    if (!(user instanceof OpenFSUser)) {
      throw new TypeError("Supplied user is not a valid OpenFSUser instance");
    }
  }

  /**
   * @param {string} username
   * @throw {TypeError}
   * @return {void}
   */
  static validateUsername(username) {
    if (typeof username !== "string") {
      throw new TypeError("Username must be a string");
    }

    // TODO: Include additional validations
  }

  /**
   * @param {string} userId
   * @throw {TypeError}
   * @return {void}
   */
  static validateUserId(userId) {
    if (typeof userId !== "string") {
      throw new TypeError("userId must be a string");
    }

    // TODO: Ensure user id is unique across local instances
  }

  /**
   * @param {Object} userStructure
   * @throw {Error}
   * @return {OpenFSUser}
   */
  static createFromStructure(userStructure) {
    return new OpenFSUser(userStructure);
  }

  // TODO: Document
  constructor(fsUserOptions) {
    OpenFSUser.validateUsername(fsUserOptions.username);
    OpenFSUser.validateUserId(fsUserOptions.userId);

    super();

    this._username = fsUserOptions.username;
    this._userId = fsUserOptions.userId;
  }

  // TODO: Document
  /**
   * @return {Object} // TODO: Document structure
   */
  getStructure() {
    return {
      username: this._username,
      userId: this._userId,
    };
  }

  /**
   * @param {string} username
   * @emit {EVT_UPDATED}
   * @return {void}
   */
  setUsername(username) {
    OpenFSUser.validateUsername(username);

    this._username = username;
    this.emit(EVT_UPDATED);
  }

  /**
   * @return {string}
   */
  getUsername() {
    return this._username;
  }

  /**
   * @param {string} userId
   * @emit {EVT_UPDATED}
   * @return {void}
   */
  setUserId(userId) {
    OpenFSUser.validateUserId(userId);

    this._userId = userId;
    this.emit(EVT_UPDATED);
  }

  /**
   * @return {string}
   */
  getUserId() {
    return this._userId;
  }
}

module.exports = OpenFSUser;
module.exports.EVT_UPDATED = EVT_UPDATED;
module.exports.EVT_DESTROYED = EVT_DESTROYED;
