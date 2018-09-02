import { Application, Request, Response } from "express";
import * as graphql from "../node_modules/graphql";

interface IGetUserAuthInfoRequest extends Request {
  user: string; // or any other type
}

export function connectGraphql(app: Application, schema: graphql.GraphQLSchema) {
  app.post("/graphql", (req: IGetUserAuthInfoRequest, res: Response) => {
    graphql.graphql(schema, req.body, { user: req.user })
      .then((data) => {
        res.send(JSON.stringify(data));
      });
  });
}
