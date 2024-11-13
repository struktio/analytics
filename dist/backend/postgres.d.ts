/**
 * Use strukt in React.
 * Creates an instance once and a new record every time the pathname changes.
 * Safely no-ops during server-side rendering.
 */
declare const postgres: {
    record: (domainId: string, attrs?: {
        siteLanguage?: string | undefined;
        screenWidth?: number | undefined;
        screenHeight?: number | undefined;
        screenColorDepth?: number | undefined;
        deviceName?: string | undefined;
        deviceManufacturer?: string | undefined;
        osName?: string | undefined;
        osVersion?: string | undefined;
        browserName?: string | undefined;
        browserVersion?: string | undefined;
        browserWidth?: number | undefined;
        browserHeight?: number | undefined;
        siteLocation: string;
        siteReferrer: string;
        source: string | undefined;
    }, next?: ((recordId: string) => void) | undefined) => {
        stop: () => void;
    };
    updateRecord: (recordId: string) => {
        stop: () => void;
    };
    action: (eventId: string, attrs: Record<string, any>, next?: ((actionId: string) => void) | undefined) => void;
    updateAction: (actionId: string, attrs: Record<string, any>) => void;
};
export { postgres };
