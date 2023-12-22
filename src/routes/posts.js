/** services */
import crawlService from "services/crawlService";
import crawlService_letterboxd from "services/crawlService_letterboxd";
import loopFiles from "services/loopFiles";

const Promise = require("bluebird");

export default ({ app, parser, cors, corsOptions }) => {
  app.post("/crawl", parser, cors(corsOptions), async (req, res) => {
    const { routes, environment, folderName, lang } = req?.body || false;

    if (routes?.length > 0) {
      const queueService = routes.map(
        (route, idx) =>
          // crawlService({ url: route, environment, folderName, idx, lang })
          route
      );

      // console.log("< QUEUE SERVICE > ", queueService);

      await Promise.map(
        queueService,
        async (url) => {
          // Promise.map(
          //   url,
          //   (item) => {
          //     console.log("< DO A REQUEST > ", item);
          // return crawlService({
          //   url: item,
          // });
          //   },
          //   { concurrency: 2 }
          // ).then((innerResults) => {
          //   console.log("< INNER RESULTS > ", innerResults);
          // });
          // console.log("< STARTING > ", url);
          return await crawlService({
            url,
          });
        },
        {
          concurrency: 2,
        }
      )
        .then((allData) => {
          console.log("< ALL DATA > ", allData);
          res.status(200).send({
            data: allData,
          });
        })
        .catch((e) => {
          console.error("Error in Promise.map:", e);
          res.status(400).send("something get wrong!");
        });

      // async function makeRequestsInBatches(urls, batchSize) {
      //   try {
      // const result = await Promise.map(
      //   queueService,
      //   async (url) => {
      //     // Promise.map(
      //     //   url,
      //     //   (item) => {
      //     //     console.log("< DO A REQUEST > ", item);
      //     // return crawlService({
      //     //   url: item,
      //     // });
      //     //   },
      //     //   { concurrency: 2 }
      //     // ).then((innerResults) => {
      //     //   console.log("< INNER RESULTS > ", innerResults);
      //     // });
      //     console.log("< INNER BATCH > ", url);
      //     return await crawlService({
      //       url: url,
      //     });
      //   },
      //   {
      //     concurrency: 2,
      //   }
      // );
      //     return result;
      //     // .then((allData) => {
      //     //   console.log("< FINAL ALL DATA > ", allData);
      //     // })
      // .catch((e) => {
      //   console.error("Error in Promise.map:", e);
      // });
      // } catch (e) {
      //   console.error("Unhandled promise rejection:", e?.message);
      // }
      // }

      // makeRequestsInBatches(queueService, 2)
      //   .then((results) => {
      //     // Process the results
      //     results.forEach((data) => {
      //       console.log(data);
      //     });
      //   })
      //   .catch((error) => {
      //     // Handle any unhandled promise rejection here
      //     console.error("Unhandled promise rejection:", error.message);
      //   });

      // WORKING
      // Promise.allSettled([...queueService])
      //   .then((values) => {
      //     console.log("< ROUTES > ", values);
      // res.status(200).send({
      //   data: values,
      // });
      //   })
      //   .catch((e) => {
      //     res.status(500).send(e?.message || "something get wrong!");
      //   });
    } else {
      res.status(400).send("something get wrong!");
    }
    //   try {
    //     routes.map(async (url, idx) => await crawlService({url, environment, folderName, idx}))
    //     console.log('\x1b[33m < SUCCESS > ', folderName, environment, routes?.length, routes, '\x1b[0m')
    //     res.status(200).send('done!')
    //   } catch(e) {
    //     res.status(500).send(e)
    //   }
    // } else {
    //   res.status(400).send('something get wrong!')
    // }
  });

  app.post(
    "/action/loop-files",
    parser,
    cors(corsOptions),
    async (req, res) => {
      try {
        const { lang, api } = req?.body || false;

        console.log("< HIT > ", req.body);

        if (!lang || !api) {
          res.status(400).send("something get wrong! Missing Lang param");
          return;
        }
        const payload = await loopFiles(lang, api);

        if (payload) {
          res.status(200).send({
            // data: values,
            message: "Consider Done!",
          });
          return;
        } else {
          res.status(400).send("something get wrong!");
        }
      } catch (e) {
        res.status(400).send(e?.message || "something get wrong!");
      }
    }
  );

  app.post("/crawl/letterboxd", parser, cors(corsOptions), (req, res) => {
    const { routes, environment, folderName } = req?.body || false;

    if (routes?.length > 0) {
      const queueService = routes.map((route, idx) =>
        crawlService_letterboxd({ url: route, environment, folderName, idx })
      );

      Promise.allSettled([...queueService])
        .then((values) => {
          console.log("< ROUTES > ", values);
          res.status(200).send({
            data: values,
          });
        })
        .catch((e) => {
          res.status(500).send(e?.message || "something get wrong!");
        });
    } else {
      res.status(500).send("something get wrong!");
    }
  });
};
