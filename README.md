# HARpoon

A nautically themed tool that runs Puppeteer and Lighthouse to generate HAR files.

⚠️ Please consider taking action to [end whaling](http://stopkillingwhales.com/take-action.html) ⚠️ 

## Using the NodeJS library

```sh
npm install perf-har-poon
```

`blubber` is asynchronous. It uses workers to spin up Puppeteer, so you can call it on a bunch of URLs in parallel.

```js
import { blubber } from "perf-har-poon"

// You can get the HAR data for a web page visit...
const { har } = await blubber({ url: "URL_TO_TEST" })

// Or specific Lighthouse reports, if you want them.
const { report } = await blubber({ url: "URL_TO_TEST", audits: ["network-rtt", "errors-in-console"] })

// You could override the default Chrome args, but you shouldn't.
const { har } = await blubber({ url: "URL_TO_TEST", chromeArgs: ["--headless"] })
```

`blubber` returns a `Promise` that resolves with an object that looks like this: 

```js
{ 
    url: "URL" // The URL you entered 
    har: { } // HAR data associated with visiting the web page
    report: { } // A Lighthouse report in JSON format, if "audits" were given in the POST body
}
```

If you want to read the Lighthouse logs, set [`logLevel`](https://github.com/GoogleChrome/lighthouse/blob/9152513f40cff56f06cdd1421fbd20ff9b0acb6d/types/externs.d.ts#L21):

```js
// You can read the logs from Lighthouse.
const { har } = await blubber({ url: "URL_TO_TEST", logLevel: "verbose" })
```

## Using the Docker container

### From Docker hub

```sh
docker run -itd --rm -p 3000:3000 doramatadora/har-poon
```

### Build it yourself

Clone this repo and build the container using `make`:

```sh
make image # builds the Docker image for this service
make run # runs the Docker image and listens on http://0.0.0.0:3000/
make stop # you guessed it
```

Env vars you can set for the server: `ADDRESS` (defaults to `0.0.0.0`) and `PORT` (defaults to `3000`)

### API

`GET` or `POST` to `/throw?url=[URL]`

```sh
curl --location 'http://0.0.0.0:3000/throw?url=URL_TO_TEST' \
-H 'Content-Type: application/json' \
--data '{ "audits": ["errors-in-console"] }'
```

#### Response (JSON)

```json
{
    "url": "[URL]",
    "har": { },
    "report": { }
}
```

#### `POST` body – all properties are optional: 

* `audits` - A list of Lighthouse audit IDs
* `chromeArgs` - Override Chrome args (you won't need this)

```json
{
    "audits": ["...", "..."], 
    "chromeArgs": ["...", "..."] 
}
```

## A list of Lighthouse performance audits? Ok sure

```json
[
  "bootup-time",
  "critical-request-chains",
  "cumulative-layout-shift",
  "diagnostics",
  "dom-size",
  "duplicated-javascript",
  "efficient-animated-content",
  "final-screenshot",
  "first-contentful-paint",
  "first-meaningful-paint",
  "font-display",
  "interactive",
  "largest-contentful-paint",
  "largest-contentful-paint-element",
  "layout-shift-elements",
  "lcp-lazy-loaded",
  "legacy-javascript",
  "long-tasks",
  "main-thread-tasks",
  "mainthread-work-breakdown",
  "max-potential-fid",
  "metrics",
  "modern-image-formats",
  "network-requests",
  "network-rtt",
  "network-server-latency",
  "no-document-write",
  "non-composited-animations",
  "offscreen-images",
  "performance-budget",
  "prioritize-lcp-image",
  "redirects",
  "render-blocking-resources",
  "screenshot-thumbnails",
  "script-treemap-data",
  "server-response-time",
  "speed-index",
  "third-party-facades",
  "third-party-summary",
  "timing-budget",
  "total-blocking-time",
  "total-byte-weight",
  "unminified-css",
  "unminified-javascript",
  "unsized-images",
  "unused-css-rules",
  "unused-javascript",
  "user-timings",
  "uses-long-cache-ttl",
  "uses-optimized-images",
  "uses-passive-event-listeners",
  "uses-rel-preconnect",
  "uses-rel-preload",
  "uses-responsive-images",
  "uses-text-compression",
  "viewport",
  "errors-in-console"
]
```