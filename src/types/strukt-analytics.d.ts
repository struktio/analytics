declare module "@strukt/analytics" {
	interface TrackerAttributes {
		siteLanguage?: string;
		screenWidth?: number;
		screenHeight?: number;
		screenColorDepth?: number;
		deviceName?: string;
		deviceManufacturer?: string;
		osName?: string;
		osVersion?: string;
		browserName?: string;
		browserVersion?: string;
		browserWidth?: number;
		browserHeight?: number;
		siteLocation: string;
		siteReferrer: string;
		source?: string;
	}

	interface TrackerInstance {
		record: (
			domainId: string,
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
	}

	interface TrackerOptions {
		detailed?: boolean;
		ignoreLocalhost?: boolean;
		ignoreOwnVisits?: boolean;
	}

	interface TrackerEnvironment {
		server: string;
		domainId: string;
	}

	interface TrackerAPI {
		create: (server: string, options?: TrackerOptions) => TrackerInstance;
		attributes: (detailed?: boolean) => TrackerAttributes;
		detect: () => void;
	}

	export const tracker: TrackerAPI;

	export function Analytics(
		pathname: string | URL,
		options?: TrackerOptions,
	): React.FC<{ pathname: string | URL, options: TrackerOptions }>;
}
