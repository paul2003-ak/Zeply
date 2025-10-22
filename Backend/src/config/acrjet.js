import arcjet, {tokenBucket, shield , detectBot} from "@arcjet/node";

import {ENV} from './env.js';

//initialize arcjet with security rules

export const aj = arcjet({
    key:ENV.ARCJET_API_KEY,
    characteristics:["ip.src"],
    rules:[
        //shield protects your app from commen attacks e.g. SQL injection, XSS etc.
        shield({mode:"LIVE"}),

        //bot detection
        detectBot({
            mode:"LIVE",
            allow:[
                "CATEGORY:SEARCH_ENGINE",

            ]
        }),

        //rate limiting 
        tokenBucket({
            mode:"LIVE",
            refillRate:10,//tokens added per interval
            interval:10,//interval in seconds (10 sec)
            capacity:15, // maximum tokens in bucket
        })
    ]
})