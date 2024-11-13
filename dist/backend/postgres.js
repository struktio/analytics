"use strict";
/**
 * Use strukt in React.
 * Creates an instance once and a new record every time the pathname changes.
 * Safely no-ops during server-side rendering.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgres = void 0;
const tracker_1 = require("../tracker");
const postgres = (0, tracker_1.create)("the-endpoint", { detailed: false, ignoreLocalhost: true });
exports.postgres = postgres;
