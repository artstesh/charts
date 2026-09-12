"use strict";
// Custom webpack config for the Karma test build. Combines two things:
// 1. The Forger TS-transformer hook (@artstesh/forger/lib/webpack.config.js) that
//    rewrites Forger.create<T>() calls at compile time.
// 2. A browser shim: since forger 2.2.0 the package root re-exports its Vitest
//    integration, which requires node's 'path' module. The karma bundle has no
//    node core modules (and never calls the integration), so stub it out.
const forgerHook = require("@artstesh/forger/lib/webpack.config.js");

module.exports = (config) => {
  const next = forgerHook(config);
  next.resolve = next.resolve || {};
  next.resolve.fallback = Object.assign({}, next.resolve.fallback, { path: false });
  return next;
};
