import fetch from "node-fetch";
import fileReader from "utils/loopFiles/fileReader";
import moveFiles from "utils/loopFiles/moveFiles";

const Promise = require("bluebird");
const path = require("path");

async function loopFiles(api) {
  const folderPath_EN = path.join(__dirname, `../_data/json/imdb/en`);
  const folderPath_PT = path.join(__dirname, `../_data/json/imdb/pt`);

  const backupFolder = path.join(__dirname, `../_data/json/imdb`);

  console.log("< LOOP FILES > ", folderPath_EN, folderPath_PT, api);

  async function callApi(jsonData) {
    const response = await fetch(api, {
      method: "post",
      body: JSON.stringify(jsonData),
      headers: {
        "x-auth-works": "sheep",
      },
    });

    return await response.json();
  }

  async function dealParallelRequests(dataArray, lang) {
    return await Promise.map(
      dataArray,
      async (data) => {
        return await callApi(data);
      },
      {
        concurrency: 10,
      }
    )
      .then((allData) => {
        console.log("< ALL DATA > ", allData);

        if (allData && allData.length > 0) {
          for (const item of allData) {
            const { slug } = item?.payload;

            moveFiles(
              `${backupFolder}/${lang}/${lang}-${slug}`,
              `${backupFolder}/${lang}_backup/${lang}-${slug}`,
              slug
            );
          }
        }
        return allData;
      })
      .catch((e) => {
        console.error("Error in Promise.map:", e);
      });
  }

  try {
    const EN_DATA = await fileReader(folderPath_EN);
    const result_EN = await dealParallelRequests(EN_DATA, "en");
    console.log("< LOOP FILES : EN_DATA > ", EN_DATA.length, result_EN);

    const PT_DATA = await fileReader(folderPath_PT);
    const result_PT = await dealParallelRequests(PT_DATA, "pt");
    console.log("< LOOP FILES : PT_DATA > ", PT_DATA.length, result_PT);

    return [result_EN, result_PT];
  } catch (e) {
    console.error(e);
    // throw new Error("< LOOP FILES ERROR : EN_DATA > ", e);
    return false;
  }

  // try {
  //   const PT_DATA = await fileReader(folderPathPT);
  //   console.log("< LOOP FILES : PT_DATA > ", PT_DATA.length);
  // } catch (e) {
  //   throw new Error("< LOOP FILES ERROR : PT_DATA > ", e);
  // }

  // Read all files in the folder
  // fs.readdir(folderPath, async (err, files) => {
  //   if (err) {
  //     console.error("Error reading folder:", err);
  //     throw new Error(err);
  //     return;
  //   }

  //   const totalFiles = files.length;

  //   // Loop through each file
  //   files.forEach((file) => {
  //     const filePath = path.join(folderPath, file);

  //     // Read the content of each file
  //     fs.readFile(filePath, "utf8", async (readErr, data) => {
  //       if (readErr) {
  //         console.error(`Error reading file ${file}:`, readErr);
  //         throw new Error(readErr);
  //       }

  //       // Parse the JSON data
  //       const jsonData = JSON.parse(data);

  //       // dealFiles(callApi(jsonData), totalFiles);

  //       dealFiles(jsonData, totalFiles);

  //       // console.log("< FILE > ", jsonData);
  //       // Call the API with jsonData
  //       // await callApi(jsonData);
  //     });
  //   });
  // });
}

export default loopFiles;
