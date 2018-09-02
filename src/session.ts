import { Application } from "express";
import * as session from "express-session";
import * as uuid from "uuid";

export default function(cthulhu: Application, secret: string) {
  if (secret === void 0) { throw Error("Must provide `secret` in configuration"); }

  cthulhu.use(session({
    genid(req) {
      return uuid.v4();
    },
    // Do not save session if nothing has been modified
    resave: false,
    // Do not create session unless something is to be stored
    saveUninitialized: false,
    secret,
  }));
}
