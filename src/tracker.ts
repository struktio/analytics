import platform from "platform";

const isBrowser = typeof window !== "undefined";

/*
  Options for the tracker.	
*/
export interface TrackerOptions {
  /**
   * The root URL of the http server.
   * For example: `https://analytics.strukt.io`.
   */
  server?: string;
  /**
   * Whether to include detailed data.
   */
  detailed?: boolean;
  /**
   * Whether to ignore localhost.
   */
  ignoreLocalhost?: boolean;
  /**
   * Whether to ignore own visits.
   */
  ignoreOwnVisits?: boolean;
  /**
   * The path to the record endpoint on the server, must accept POST and PUT requests.
   * For example: `/api/event/record`.
   * should return { id: string } where id is the id of the record that was created.
   */
  recordPath: string;
  /**
   * The path to the action endpoint on the server, must accept POST and PUT requests.
   * should return { id: string } where id is the id of the action that was created.
   */
  actionPath: string;
  /**
   * The interval to update the record on the server.
   */
  pollingInterval?: number;
}

// Add interfaces for the various data structures
export interface DetailedData {
  siteLanguage: string;
  screenWidth: number;
  screenHeight: number;
  screenColorDepth: number;
  deviceName?: string;
  deviceManufacturer?: string;
  osName?: string;
  osVersion?: string;
  browserName?: string;
  browserVersion?: string;
  browserWidth: number;
  browserHeight: number;
}

export interface DefaultData {
  siteLocation: string;
  siteReferrer: string;
  source: string | undefined;
}

export type TrackerAttributes = DetailedData & DefaultData;

interface SendOptions {
  ignoreOwnVisits: boolean;
}

/**
 * Determines if a host is a localhost.
 * @param {String} hostname - Hostname that should be tested.
 * @returns {Boolean} isLocalhost
 */
const isLocalhost = function (hostname: string) {
  return (
    hostname === "" ||
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1"
  );
};

/**
 * Determines if user agent is a bot. Approach is to get most bots, assuming other bots don't run JS.
 * Source: https://stackoverflow.com/questions/20084513/detect-search-crawlers-via-javascript/20084661
 * @param {String} userAgent - User agent that should be tested.
 * @returns {Boolean} isBot
 */
const isBot = function (userAgent: string) {
  return /bot|crawler|spider|crawling/i.test(userAgent);
};

/**
 * Checks if an id is a fake id. This is the case when strukt ignores you because of the `ackee_ignore` cookie.
 * @param {String} id - Id that should be tested.
 * @returns {Boolean} isFakeId
 */
const isFakeId = function (id: string) {
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
export const attributes = function (
  detailed = false,
): (DefaultData & DetailedData) | DefaultData {
  const defaultData: DefaultData = {
    siteLocation: window.location.href,
    siteReferrer: document.referrer,
    source: source(),
  };

  const detailedData: DetailedData = {
    siteLanguage: (navigator.language || navigator.language).slice(0, 2),
    screenWidth: screen.width,
    screenHeight: screen.height,
    screenColorDepth: screen.colorDepth,
    deviceName: platform.product,
    deviceManufacturer: platform.manufacturer,
    osName: platform.os?.family,
    osVersion: platform.os?.version,
    browserName: platform.name,
    browserVersion: platform.version,
    browserWidth: window.outerWidth,
    browserHeight: window.outerHeight,
  };

  if (detailed === true) {
    let combinedData: DefaultData & DetailedData = {
      ...defaultData,
      ...detailedData,
    };

    return combinedData;
  }

  return defaultData;
};

/**
 * Creates an object with a query and variables property to create an action on the server.
 * @param {String} id - Id of the action.
 * @param {Object} input - Data that should be transferred to the server.
 * @returns {Object} Create action body.
 */
const createCleanupBody = function (sessionId: string): RequestInit {
  return {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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
const createRecordBody = function (
  session: string | undefined,
  input: Record<string, any>,
): RequestInit {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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
const updateRecordBody = function (id: string): RequestInit {
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
const createActionBody = function (
  id: string,
  session: string | undefined,
  input: Record<string, any>,
): RequestInit {
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
const updateActionBody = function (
  id: string,
  input: Record<string, any>,
): RequestInit {
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
const send = async function (
  url: string,
  body: RequestInit,
  options: SendOptions,
  next?: (id: string) => void,
): Promise<void> {
  try {
    let response: Response;
    response = await fetch(url, {
      ...body,
      credentials: options.ignoreOwnVisits ? "include" : "omit",
    });

    if (!response.ok) {
      console.error("Error sending tracker request");
    }

    const { id } = await response.json();

    if (typeof next === "function") {
      next(id);
    }
  } catch (error) {
    console.error("Error sending tracker request");
  }
};

/**
 * Looks for an element with strukt attributes and executes Strukt with the given attributes.
 * Fails silently.
 */
export const detect = function () {
  const elem = document.querySelector("[data-strukt-domain-id]");

  if (elem == null) return;

  const server = elem.getAttribute("data-strukt-server") || "";
  const id = elem.getAttribute("data-strukt-tracker-id");
  const options = elem.getAttribute("data-strukt-opts") || "{}";

  if (server == null || id == null) return;
  create("test2", JSON.parse(options)).record();
};

/**
 * Construct URL to the GraphQL endpoint of strukt.
 * @param {String} server - URL of the strukt server.
 * @returns {String} endpoint - URL to the GraphQL endpoint of the strukt server.
 */
const endpoint = function (server?: string): string {
  if (server == undefined) return "";
  const hasTrailingSlash = server.slice(-1) === "/";
  const baseUrl = server + (hasTrailingSlash === true ? "" : "/") + "";
  return baseUrl;
};

export interface TrackerInstance {
  record: (
    attributes?: TrackerAttributes,
    next?: (recordId: string) => void,
  ) => {
    stop: () => void;
  };
  updateRecord: (recordId: string) => {
    stop: () => void;
  };
  action: (
    eventId: string,
    attributes: TrackerAttributes,
    next?: (actionId: string) => void,
  ) => void;
  updateAction: (actionId: string, attributes: TrackerAttributes) => void;
  cleanup: (sessionId: string) => void;
}
/**
 * Creates a new instance.
 * @param {?Object} options
 * @param {String} sessionId The session ID can be used to track what a user does for the full
 * lifecycle of their time on the site, can be ommited without issue
 * @returns {Object} instance
 */
export const create = function (
  sessionId: string | undefined = undefined,
  options: TrackerOptions,
): TrackerInstance {
  options.recordPath = endpoint(options.server) + options.recordPath;
  options.actionPath = endpoint(options.server) + options.actionPath;
  const noop = () => {};

  // Fake instance when strukt ignores you
  const fakeInstance = {
    record: () => ({ stop: noop }),
    updateRecord: () => ({ stop: noop }),
    action: noop,
    updateAction: noop,
    cleanup: noop,
  };

  if (
    options.ignoreLocalhost === true &&
    isLocalhost(location.hostname) === true
  ) {
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
  const _record = (
    attrs = attributes(options?.detailed),
    next?: (recordId: string) => void,
  ) => {
    // Function to stop updating the record
    let isStopped = false;
    const stop = () => {
      isStopped = true;
    };

    send(
      options.recordPath,
      createRecordBody(sessionId, attrs),
      { ignoreOwnVisits: options?.ignoreOwnVisits ?? true },
      (recordId: string) => {
        console.log("record", recordId);
        if (isFakeId(recordId) === true) {
          return console.warn(
            "strukt ignores you because this is your own site",
          );
        }

        const interval = setInterval(() => {
          if (isStopped === true) {
            clearInterval(interval);
            return;
          }

          if (isInBackground() === true) return;

          send(options.recordPath, updateRecordBody(recordId), {
            ignoreOwnVisits: options?.ignoreOwnVisits ?? true,
          });
        }, options.pollingInterval ?? 2000);

        if (typeof next === "function") {
          return next(recordId);
        }
      },
    );

    return { stop };
  };

  // Updates a record very x seconds to track the duration of the visit
  const _updateRecord = (recordId: string) => {
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
      if (isStopped === true) {
        clearInterval(interval);
        return;
      }

      if (isInBackground() === true) return;

      send(options.recordPath, updateRecordBody(recordId), {
        ignoreOwnVisits: options?.ignoreOwnVisits ?? true,
      });
    }, options.pollingInterval ?? 15000);

    return { stop };
  };

  // Creates a new action on the server
  const _action = (
    actionId: string,
    attrs: Record<string, any>,
    next?: (actionId: string) => void,
  ) => {
    send(
      options.actionPath,
      createActionBody(actionId, sessionId, attrs),
      { ignoreOwnVisits: options?.ignoreOwnVisits ?? true },
      (actionId: string) => {
        if (isFakeId(actionId) === true) {
          return console.warn(
            "strukt ignores you because this is your own site",
          );
        }

        if (typeof next === "function") {
          return next(actionId);
        }
      },
    );
  };

  // Updates an action
  const _updateAction = (actionId: string, attrs: Record<string, any>) => {
    if (isFakeId(actionId) === true) {
      return console.warn("strukt ignores you because this is your own site");
    }

    send(options.actionPath, updateActionBody(actionId, attrs), {
      ignoreOwnVisits: options?.ignoreOwnVisits ?? true,
    });
  };

  // Updates an action
  const _cleanup = (sessionId: string) => {
    send(options.recordPath, createCleanupBody(sessionId), {
      ignoreOwnVisits: options?.ignoreOwnVisits ?? true,
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

// Only run strukt automatically when executed in a browser environment
if (isBrowser === true) {
  detect();
}
