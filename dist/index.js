"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.Analytics = void 0;
var client_1 = require("./client");
Object.defineProperty(exports, "Analytics", { enumerable: true, get: function () { return client_1.Analytics; } });
var tracker_1 = require("./tracker");
Object.defineProperty(exports, "create", { enumerable: true, get: function () { return tracker_1.create; } });
