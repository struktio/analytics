export interface TrackerOptions {
    /**
     * The id of the tracker.
     */
    projectId: string;
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
/**
 * Gathers all platform-, screen- and user-related information.
 * This is the data that will be sent to the server. Once sent,
 * it will be saved in the database and can be updated by the id returned from the send() function.
 * @param {Boolean} detailed - Include personal data.
 * @returns {Object} attributes - User-related information.
 */
export declare const attributes: (detailed?: boolean) => (DefaultData & DetailedData) | DefaultData;
/**
 * Looks for an element with strukt attributes and executes Strukt with the given attributes.
 * Fails silently.
 */
export declare const detect: () => void;
/**
 * Creates a new instance.
 * @param {String} server - URL of the strukt server.
 * @param {?Object} options
 * @returns {Object} instance
 */
export declare const create: (options: TrackerOptions) => {
    record: (id: string, attrs?: DefaultData | (DefaultData & DetailedData), next?: ((recordId: string) => void) | undefined) => {
        stop: () => void;
    };
    updateRecord: (recordId: string) => {
        stop: () => void;
    };
    action: (actionId: string, attrs: Record<string, any>, next?: ((actionId: string) => void) | undefined) => void;
    updateAction: (actionId: string, attrs: Record<string, any>) => void;
};
