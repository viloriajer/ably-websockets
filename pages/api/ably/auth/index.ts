import Ably from "ably/promises";
import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

const rest = new Ably.Rest(process.env.ABLY_API_KEY as string);


export default function ablyAuthHandler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const tokenParams = {
        clientId: randomUUID(),
      };
      rest.auth.createTokenRequest(tokenParams, (err: any, tokenRequest: any) => {
        if (err) {
          res.status(500).send("Error requesting token: " + JSON.stringify(err));
        } else {
          res.setHeader("Content-Type", "application/json");
          res.send(JSON.stringify(tokenRequest));
        }
      });
  }