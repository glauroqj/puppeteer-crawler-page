const fs = require("fs");

function moveFiles(oldPath, newPath, slug) {
  // Move the file
  fs.rename(oldPath, newPath, (error) => {
    if (error) {
      console.error("Error moving file:", slug, error);
    } else {
      console.log("File moved successfully!", slug);
    }
  });
}

export default moveFiles;
