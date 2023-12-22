const fs = require("fs");
const path = require("path");

function fileReader(folderPath) {
  return new Promise((resolve, reject) => {
    if (!folderPath) throw new Error("< FILE READER : PATH IS MISSING!!! >");

    const arrayData = [];

    fs.readdir(folderPath, async (err, files) => {
      if (err) {
        console.error("Error reading folder:", err);
        reject(err);
        // throw new Error(err);
        return;
      }

      const totalFiles = files.length;

      // Loop through each file
      files.forEach((file) => {
        const filePath = path.join(folderPath, file);

        // Read the content of each file
        fs.readFile(filePath, "utf8", async (readErr, data) => {
          if (readErr) {
            console.error(`Error reading file ${file}:`, readErr);
            throw new Error(readErr);
          }

          // Parse the JSON data
          const jsonData = JSON.parse(data);

          // dealFiles(callApi(jsonData), totalFiles);

          // dealFiles(jsonData, totalFiles);

          arrayData.push(jsonData);

          console.log("< FILE > ", arrayData.length, totalFiles);

          if (arrayData.length === totalFiles) {
            // console.log("< RETURN VALUES? > ", arrayData.length, totalFiles);
            resolve(arrayData);
          }
          // Call the API with jsonData
          // await callApi(jsonData);
        });
      });
    });
  });
}

export default fileReader;
