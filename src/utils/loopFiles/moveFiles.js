const fs = require("fs");

function moveFiles(oldPath, newPath) {
  const sourcePath = "path/to/source/file.txt";
  const destinationPath = "path/to/destination/file.txt";

  // Move the file
  fs.rename(oldPath, newPath, (error) => {
    if (error) {
      console.error("Error moving file:", error);
    } else {
      console.log("File moved successfully!", newPath);
    }
  });
}

export default moveFiles;
