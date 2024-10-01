import { Express, NextFunction, Request, Response } from "express";
import slowDown from "express-slow-down";

export const installExpressSlowdown = (app: Express) => {
  app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)

  const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 200, // allow 200 requests per 15 minutes, then...
    delayMs: 100, // begin adding 100ms of delay per request above 200:
    // request # 201 is delayed by  200ms
    // request # 202 is delayed by 300ms
    // request # 203 is delayed by 400ms
    // etc.
  });

  const rateLimit = (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    /* 
    Cesson sévigné : 37.70.219.10
Issy-les-Moulineaux :
185.64.148.116/.117
VPN : 35.181.20.69
Scan auto: 13.37.27.180
    */

    const ipWhitelist = [
      "81.220.247.81",
      "37.70.219.10",
      "185.64.148.116",
      "185.64.148.117",
      "35.181.20.69",
      "13.37.27.180",
    ];

    // don't apply rate limiter to whitelisted IPs
    if (ip && ipWhitelist.indexOf(ip) >= 0) {
      // console.log("whitelisted IP", ip);
      next();
      return;
    }

    // apply rate limiter
    speedLimiter(req, res, next);
  };

  //  apply to all requests
  app.use(rateLimit);
};

/* 
tcp 19101 ouvert jdwp - shellifier

dans quel mesure nos VM sont isolées */

/* 
const rateLimiter = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // implement your ip address limiting here
    // you should have one of three outcomes
    // 1. You call next() to allow the routing to continue for this request
    // 2. You call next(someError) to abort routing and fall-through to 
    //    your Express error handler
    // 3. You send a response using something like res.status(xxx).send(), 
    //    thus ending the request

    // block this request if the IP address is on the blacklist
    if (blacklist.indexOf(ip) >= 0) {
        res.status(403).send('You cannot use this service!');
        return;
    }

    // if the IP address is on the whitelist, then let it go
    if (whitelist.indexOf(ip) >= 0) {
        // continue routing
        next();
        return;
    }

    // apply rate limiter middleware
    limiter(req, res, next);
} */
