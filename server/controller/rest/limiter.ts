//

import {rateLimit} from "express-rate-limit";


export const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (request, response, next, options) => {
    response.status(429).json({error: "rateLimitExceeded"}).end();
  },
  keyGenerator: (request, response) => {
    const apiKey = request.headers["x-api-key"];
    if (apiKey !== undefined && typeof apiKey === "string") {
      return apiKey;
    } else {
      return "anonymous";
    }
  }
});
