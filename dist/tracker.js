"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.detect = exports.attributes = void 0;
const platform_1 = __importDefault(require("platform"));
const isBrowser = typeof window !== "undefined";
/**
 * Determines if a host is a localhost.
 * @param {String} hostname - Hostname that should be tested.
 * @returns {Boolean} isLocalhost
 */
const isLocalhost = function (hostname) {
    return (hostname === "" ||
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "::1");
};
/**
 * Determines if user agent is a bot. Approach is to get most bots, assuming other bots don't run JS.
 * Source: https://stackoverflow.com/questions/20084513/detect-search-crawlers-via-javascript/20084661
 * @param {String} userAgent - User agent that should be tested.
 * @returns {Boolean} isBot
 */
const isBot = function (userAgent) {
    return /bot|crawler|spider|crawling/i.test(userAgent);
};
/**
 * Checks if an id is a fake id. This is the case when strukt ignores you because of the `ackee_ignore` cookie.
 * @param {String} id - Id that should be tested.
 * @returns {Boolean} isFakeId
 */
const isFakeId = function (id) {
    return id === "88888888-8888-8888-8888-888888888888";
};
/**
 * Checks if the website is in background (e.g. user has minimzed or switched tabs).
 * @returns {boolean}
 */
const isInBackground = function () {
    return document.visibilityState === "hidden";
};
/**
 * Get the optional source parameter.
 * @returns {String} source
 */
const source = function () {
    const source = (location.search.split(`source=`)[1] || "").split("&")[0];
    return source === "" ? undefined : source;
};
/**
 * Gathers all platform-, screen- and user-related information.
 * This is the data that will be sent to the server. Once sent,
 * it will be saved in the database and can be updated by the id returned from the send() function.
 * @param {Boolean} detailed - Include personal data.
 * @returns {Object} attributes - User-related information.
 */
const attributes = function (detailed = false) {
    var _a, _b;
    const defaultData = {
        siteLocation: window.location.href,
        siteReferrer: document.referrer,
        source: source(),
    };
    const detailedData = {
        siteLanguage: (navigator.language || navigator.language).slice(0, 2),
        screenWidth: screen.width,
        screenHeight: screen.height,
        screenColorDepth: screen.colorDepth,
        deviceName: platform_1.default.product,
        deviceManufacturer: platform_1.default.manufacturer,
        osName: (_a = platform_1.default.os) === null || _a === void 0 ? void 0 : _a.family,
        osVersion: (_b = platform_1.default.os) === null || _b === void 0 ? void 0 : _b.version,
        browserName: platform_1.default.name,
        browserVersion: platform_1.default.version,
        browserWidth: window.outerWidth,
        browserHeight: window.outerHeight,
    };
    if (detailed === true) {
        let combinedData = Object.assign(Object.assign({}, defaultData), detailedData);
        return combinedData;
    }
    return defaultData;
};
exports.attributes = attributes;
/**
 * Creates an object with a query and variables property to create an action on the server.
 * @param {String} id - Id of the action.
 * @param {Object} input - Data that should be transferred to the server.
 * @returns {Object} Create action body.
 */
const createCleanupBody = function (projectId, sessionId) {
    return {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: projectId,
            sessionId,
        }),
        credentials: "include",
    };
};
/**
 * Creates an object with a query and variables property to create a record on the server.
 * @param {String} id - Id of the domain.
 * @param {Object} input - Data that should be transferred to the server.
 * @returns {Object} Create record body.
 */
const createRecordBody = function (id, session, input) {
    return {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id,
            session,
            input,
        }),
        credentials: "include",
    };
};
/**
 * Creates an object with a query and variables property to update a record on the server.
 * @param {String} id - Id of the record.
 * @returns {Object} Update record body.
 */
const updateRecordBody = function (id) {
    return {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
        credentials: "include",
    };
};
/**
 * Creates an object with a query and variables property to create an action on the server.
 * @param {String} id - Id of the action.
 * @param {Object} input - Data that should be transferred to the server.
 * @returns {Object} Create action body.
 */
const createActionBody = function (id, session, input) {
    return {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id,
            session,
            input,
        }),
        credentials: "include",
    };
};
/**
 * Creates an object with a query and variables property to update an action on the server.
 * @param {String} id - Id of the action.
 * @param {Object} input - Data that should be transferred to the server.
 * @returns {Object} Update action body.
 */
const updateActionBody = function (id, input) {
    return {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id,
            input,
        }),
        credentials: "include",
    };
};
/**
 * Sends a request to a specified URL.
 * Won't catch all errors as some are already logged by the browser.
 * In this case the callback won't fire.
 * @param {String} url - URL to the GraphQL endpoint of the strukt server.
 * @param {Object} body - JSON which will be sent to the server.
 * @param {Object} options
 * @param {?Function} next - The callback that handles the response. Receives the following properties: json.
 */
const send = function (url, body, options, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let response;
            response = yield fetch(url, Object.assign(Object.assign({}, body), { credentials: options.ignoreOwnVisits ? "include" : "omit" }));
            if (!response.ok) {
                console.error("Error sending tracker request");
            }
            const { id } = yield response.json();
            if (typeof next === "function") {
                next(id);
            }
        }
        catch (error) {
            console.error("Error sending tracker request");
        }
    });
};
/**
 * Looks for an element with strukt attributes and executes Strukt with the given attributes.
 * Fails silently.
 */
const detect = function () {
    const elem = document.querySelector("[data-strukt-domain-id]");
    if (elem == null)
        return;
    const server = elem.getAttribute("data-strukt-server") || "";
    const id = elem.getAttribute("data-strukt-tracker-id");
    const options = elem.getAttribute("data-strukt-opts") || "{}";
    if (server == null || id == null)
        return;
    (0, exports.create)("tset", "test2", JSON.parse(options)).record();
};
exports.detect = detect;
/**
 * Construct URL to the GraphQL endpoint of strukt.
 * @param {String} server - URL of the strukt server.
 * @returns {String} endpoint - URL to the GraphQL endpoint of the strukt server.
 */
const endpoint = function (server) {
    if (server == undefined)
        return "";
    const hasTrailingSlash = server.slice(-1) === "/";
    const baseUrl = server + (hasTrailingSlash === true ? "" : "/") + "";
    return baseUrl;
};
/**
 * Creates a new instance.
 * @param {String} server - URL of the strukt server.
 * @param {?Object} options
 * @returns {Object} instance
 */
const create = function (projectId, sessionId = undefined, options) {
    options.recordPath = endpoint(options.server) + options.recordPath;
    options.actionPath = endpoint(options.server) + options.actionPath;
    const noop = () => { };
    // Fake instance when strukt ignores you
    const fakeInstance = {
        record: () => ({ stop: noop }),
        updateRecord: () => ({ stop: noop }),
        action: noop,
        updateAction: noop,
        cleanup: noop,
    };
    if (options.ignoreLocalhost === true &&
        isLocalhost(location.hostname) === true) {
        console.warn("strukt ignores you because you are on localhost");
        return fakeInstance;
    }
    if (isBot(navigator.userAgent) === true) {
        console.warn("strukt ignores you because you are a bot");
        return fakeInstance;
    }
    // Creates a new record on the server and updates the record
    // evry x seconds to track the duration of the visit. Tries to use
    // the default attributes when there're no custom attributes defined.
    const _record = (attrs = (0, exports.attributes)(options === null || options === void 0 ? void 0 : options.detailed), next) => {
        var _a;
        // Function to stop updating the record
        let isStopped = false;
        const stop = () => {
            isStopped = true;
        };
        send(options.recordPath, createRecordBody(projectId, sessionId, attrs), { ignoreOwnVisits: (_a = options === null || options === void 0 ? void 0 : options.ignoreOwnVisits) !== null && _a !== void 0 ? _a : true }, (recordId) => {
            var _a;
            console.log("record", recordId);
            if (isFakeId(recordId) === true) {
                return console.warn("strukt ignores you because this is your own site");
            }
            const interval = setInterval(() => {
                var _a;
                if (isStopped === true) {
                    clearInterval(interval);
                    return;
                }
                if (isInBackground() === true)
                    return;
                send(options.recordPath, updateRecordBody(recordId), {
                    ignoreOwnVisits: (_a = options === null || options === void 0 ? void 0 : options.ignoreOwnVisits) !== null && _a !== void 0 ? _a : true,
                });
            }, (_a = options.pollingInterval) !== null && _a !== void 0 ? _a : 2000);
            if (typeof next === "function") {
                return next(recordId);
            }
        });
        return { stop };
    };
    // Updates a record very x seconds to track the duration of the visit
    const _updateRecord = (recordId) => {
        var _a;
        // Function to stop updating the record
        let isStopped = false;
        const stop = () => {
            isStopped = true;
        };
        console.log("updateRecord", recordId);
        if (isFakeId(recordId) === true) {
            console.warn("strukt ignores you because this is your own site");
            return { stop };
        }
        const interval = setInterval(() => {
            var _a;
            if (isStopped === true) {
                clearInterval(interval);
                return;
            }
            if (isInBackground() === true)
                return;
            send(options.recordPath, updateRecordBody(recordId), {
                ignoreOwnVisits: (_a = options === null || options === void 0 ? void 0 : options.ignoreOwnVisits) !== null && _a !== void 0 ? _a : true,
            });
        }, (_a = options.pollingInterval) !== null && _a !== void 0 ? _a : 15000);
        return { stop };
    };
    // Creates a new action on the server
    const _action = (actionId, attrs, next) => {
        var _a;
        send(options.actionPath, createActionBody(actionId, sessionId, attrs), { ignoreOwnVisits: (_a = options === null || options === void 0 ? void 0 : options.ignoreOwnVisits) !== null && _a !== void 0 ? _a : true }, (actionId) => {
            if (isFakeId(actionId) === true) {
                return console.warn("strukt ignores you because this is your own site");
            }
            if (typeof next === "function") {
                return next(actionId);
            }
        });
    };
    // Updates an action
    const _updateAction = (actionId, attrs) => {
        var _a;
        if (isFakeId(actionId) === true) {
            return console.warn("strukt ignores you because this is your own site");
        }
        send(options.actionPath, updateActionBody(actionId, attrs), {
            ignoreOwnVisits: (_a = options === null || options === void 0 ? void 0 : options.ignoreOwnVisits) !== null && _a !== void 0 ? _a : true,
        });
    };
    // Updates an action
    const _cleanup = (projectId, sessionId) => {
        var _a;
        send(options.recordPath, createCleanupBody(projectId, sessionId), {
            ignoreOwnVisits: (_a = options === null || options === void 0 ? void 0 : options.ignoreOwnVisits) !== null && _a !== void 0 ? _a : true,
        });
    };
    // Return the real instance
    return {
        record: _record,
        updateRecord: _updateRecord,
        action: _action,
        updateAction: _updateAction,
        cleanup: _cleanup,
    };
};
exports.create = create;
// Only run strukt automatically when executed in a browser environment
if (isBrowser === true) {
    (0, exports.detect)();
}
