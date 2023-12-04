import fetch from "node-fetch";

const fs = require("fs");
const path = require("path");

function loopFiles(lang) {
  return new Promise((resolve) => {
    const folderPath = path.join(__dirname, `../_data/json/imdb/${lang}`);

    console.log("< LOOP FILES > ", folderPath);

    async function callApi(jsonData) {
      // Replace the URL with your API endpoint
      const apiUrl =
        "https://www.opinaposter.com.br/api/intranet/poster/add-poster";

      // Make the API call with jsonData
      const response = await fetch(apiUrl, {
        method: "post",
        body: JSON.stringify(jsonData),
        headers: {
          "x-auth-works": "sheep",
        },
      });

      return response;
    }

    let arrayRequests = [];

    function dealFiles(request, totalFiles) {
      console.log("< DEAL FILES > ", request);
      arrayRequests.push(request);

      console.log(
        "< ALL REQUESTS > ",
        arrayRequests,
        totalFiles,
        arrayRequests.length
      );

      if (totalFiles === arrayRequests.length) {
        console.log("< CALL PROMISE ALL >");
        Promise.allSettled([...arrayRequests])
          .then((values) => {
            console.log("< VALUES > ", values);

            // setTimeout(() => {
            // }, 5000);
            resolve(true);
          })
          .catch((e) => {
            new Error(e);
            resolve(false);
          });
      }
    }
    // Read all files in the folder
    fs.readdir(folderPath, async (err, files) => {
      if (err) {
        console.error("Error reading folder:", err);
        throw new Error(err);
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

          dealFiles(callApi(jsonData), totalFiles);
          // console.log("< FILE > ", jsonData);
          // Call the API with jsonData
          // await callApi(jsonData);
        });
      });
    });
  });
}

export default loopFiles;
