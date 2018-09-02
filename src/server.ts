import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as expressValidator from "express-validator";
import * as http from "http";
import * as methodOverride from "method-override";
import * as morgan from "morgan";
import * as winston from "winston";
import security from "./security";
import session from "./session";
import views from "./views";

const NODE_ENV = process.env.NODE_ENV || "development";
const __PROD__ = NODE_ENV === "production";
const __TEST__ = NODE_ENV === "test";

export default class Cthulhu {
    public app: express.Application;
    public server: http.Server;

    constructor(config) {
        this.app = express();
        const cthulhu = this.app;
        const requiredConfigs = [
          "port",
        ];

      /**
       * Check for required configuration options. Throw error if any required
       * fields are missing.
       */
        requiredConfigs.forEach((requiredConfig) => {
          if (!config[requiredConfig]) {
            throw new Error("Must supply " + requiredConfig);
          }
        });

        // Set port
        cthulhu.set("port", config.port);

        // Add `compression` for compressing responses.
        cthulhu.use(compression());

        /**
         * Allow for the use of HTTP verbs such as PUT or DELETE in places
         * where the client doesn't support it.
         */
        cthulhu.use(methodOverride());

        cthulhu.disable("x-powered-by");

        // Add `body-parser` for parsing request body
        cthulhu.use(bodyParser.json());
        cthulhu.use(bodyParser.urlencoded({ extended: true }));

        // Enable session middleware
        // PassportJS's session piggy-backs on express-session
        session(cthulhu, config.session);

        // Enable security middleware
        security(cthulhu);

        /**
         * Add `express-validator`
         * This module allows values in req.body to be validated with the use of
         * helper methods.
         */
        cthulhu.use(expressValidator());

        // Add cookie-parser
        cthulhu.use(cookieParser());

        // Set folder for static files.
        if (config.views) {
          views(cthulhu, config.views);
        }

        cthulhu.use(morgan(__PROD__ || __TEST__ ? "combined" : "dev"));

        if (config.middleware) {
          config.middleware.forEach((fn) => cthulhu.use(fn));
        }

        this.server = new http.Server(cthulhu);
    }

    public start(): Cthulhu {
      const env = this.app.get("env");
      const port = this.app.get("port");

      // Start application server.
      this.server.listen(port, () => {
        winston.info("Cthulhu has risen at port " + port + " in " + env + " mode");
      });

      return this;
    }
}
