const path = require("path");
const getFileNameWithoutExtension = (filePath) => {
    return path.basename(filePath, path.extname(filePath));
  };

module.exports = {getFileNameWithoutExtension};