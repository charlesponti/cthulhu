import * as express from "express";
import * as path from "path";

const hour = 3600000;
const day = hour * 24;
const week = day * 7;

const { INIT_DIR } = process.env;

export default (cthulhu: express.Application, viewsDir: string) => {
  cthulhu.use(
    express.static(
      path.resolve(`${INIT_DIR}/public`),
      { maxAge: week }, // TTL (Time To Live) for static files
    ),
  );

  // Set view engine
  cthulhu.set("view engine", "html");

  // Set directory where views are stored.
  cthulhu.set("views", path.resolve(INIT_DIR || "", viewsDir));
};
