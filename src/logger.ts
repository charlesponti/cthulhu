import { Application, Request } from "express";
import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as morgan from "morgan";
import * as path from "path";
import * as winston from "winston";

interface ILoggingOptions {
  dir: string;
  file: string;
}

interface IRequestWithId extends Request {
  id: string;
}

/**
 * Configure logger
 * @param  {string} logfile Path to logfile
 * @param  {object} config Configuration for transports
 * @return {winston.Logger}
 */
export default function(app: Application, options: ILoggingOptions) {
  const cwd = process.cwd();
  const logFile = path.resolve(cwd, `${options.dir}/${options.file}`);
  const addRequestId = require("express-request-id")({ setHeader: false });

  app.use(addRequestId);
  morgan.token("id", (req: IRequestWithId) => req.id.split("-")[0]);

  app.use(morgan("[:date[iso] #:id] Started :method :url for :remote-addr", {immediate: true}));

  app.use(morgan("[: date[iso] #: id] Completed : status : res[content - length] in : response - time ms"));

  // If logs directory does not exist, create one
  if (!fs.existsSync(path.resolve(cwd, options.dir))) {
    mkdirp.sync(path.resolve(cwd, options.dir));
  }

  // If log file does not exist, create one with empty content.
  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, "");
  }

  const logger = winston.createLogger({
    exitOnError: false,
    format: winston.format.json(),
    level: "info",
    transports: [
      new winston.transports.File({
        filename: logFile,
        handleExceptions: true,
        level: "info",
        maxFiles: 5,
        maxsize: 5242880, // 5MB
      }),
      new winston.transports.Console({
        handleExceptions: true,
        level: "debug",
      }),
    ],

  });

  return logger;
}
