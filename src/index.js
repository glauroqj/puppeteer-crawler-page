import express from "express";
/** routes */
import routes from "routes/routes";

const port = process.env.PORT || 6000;
const app = express();

/** app routes */
routes(app);

app.listen(port, () => {
  console.log(`Server is running at localhost:${port}`);
});
