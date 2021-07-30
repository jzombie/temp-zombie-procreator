const OpenFSCore = require("./OpenFSCore");
const { DIR_SEPARATOR } = OpenFSCore;

const OpenFSInode = require("./OpenFSInode");

const OpenFSUser = require("./OpenFSUser");

module.exports = OpenFSCore;
module.exports.DIR_SEPARATOR = DIR_SEPARATOR;

module.exports.OpenFSInode = OpenFSInode;

module.exports.OpenFSUser = OpenFSUser;
