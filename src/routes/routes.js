import cors from "cors";
import bodyParser from "body-parser";
/** APIS */
import posts from "./post/posts";
import gets from "./get/gets";

export default (app) => {
  const urlBodyParser = bodyParser.json();
  // Setting cors
  const corsOptions = {
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: true,
    origin: process?.env?.WEBORIGIN,
    credentials: true,
  };

  posts({ app, parser: urlBodyParser, cors, corsOptions });
  gets({ app, parser: urlBodyParser, cors, corsOptions });
};
