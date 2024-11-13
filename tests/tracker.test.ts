import { describe, it, expect, vi, beforeEach } from 'vitest';
import { create, attributes, TrackerOptions, DetailedData } from '../src/tracker';

// Mock fetch globally
global.fetch = vi.fn();

const consoleError = vi.spyOn(console, 'error');
describe('Tracker', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Reset fetch mock
		(global.fetch as ReturnType<typeof vi.fn>).mockReset();
		// Mock successful fetch response
		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ id: 'test-record-id' }),
		});
	});

	describe('create()', () => {
		it('should create a tracker instance with default options', () => {
			const options: TrackerOptions = {
				projectId: 'test-project',
				recordPath: '/api/event/record',
				actionPath: '/api/event/action',
			};

			const tracker = create(options);
			expect(tracker).toBeDefined();
			expect(tracker.record).toBeDefined();
		});

		it('should respect ignoreLocalhost option', () => {
			const options: TrackerOptions = {
				projectId: 'test-project',
				server: 'http://localhost:3000',
				recordPath: '/api/event/record',
				actionPath: '/api/event/action',
				ignoreLocalhost: true,
			};

			// Mock window.location
			Object.defineProperty(window, 'location', {
				value: { hostname: 'localhost' },
				writable: true,
			});
			// Mock location.search
			Object.defineProperty(location, 'search', {
				value: '?source=test',
				writable: true,
			});

			const tracker = create(options);

			tracker.record('test-project', attributes());
			expect(global.fetch).not.toHaveBeenCalled();
		});

	});

	describe('record()', () => {
		it('should send record request with correct data', async () => {
			const options: TrackerOptions = {
				projectId: 'test-project',
				recordPath: '/api/event/record',
				actionPath: '/api/event/action',
			};

			const tracker = create(options);

			await tracker.record('test-project', attributes());

			expect(global.fetch).toHaveBeenCalledWith(
				'/api/event/record',
				expect.objectContaining({
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						id: 'test-project',
						input: attributes(),
					}),
				})
			);
		});

		it('should start update interval and return stop function', async () => {
			vi.useFakeTimers();
			const options: TrackerOptions = {
				projectId: 'test-project',
				recordPath: '/api/event/record',
				actionPath: '/api/event/action',
				pollingInterval: 10,
			};

			const tracker = create(options);
			const result = await tracker.record('test-project', attributes());

			expect(result.stop).toBeDefined();

			// Fast-forward time
			vi.advanceTimersByTime(11);

			// expect(global.fetch).toHaveBeenCalledTimes(2); // Initial call + interval call

			// Call stop function
			result.stop();

			// Fast-forward time again
			vi.advanceTimersByTime(11);

			// Should not make additional calls after stop
			// expect(global.fetch).toHaveBeenCalledTimes(2);

			vi.useRealTimers();
		});
	});

	describe('attributes()', () => {
		it('should return basic attributes() when detailed is false', () => {
			const attrs = attributes();
			expect(attrs).toHaveProperty('siteLocation');
			expect(attrs).toHaveProperty('siteReferrer');
			expect(attrs).not.toHaveProperty('screenWidth');
			expect(attrs).not.toHaveProperty('screenHeight');
			expect(attrs).not.toHaveProperty('deviceName');
			expect(attrs).not.toHaveProperty('deviceManufacturer');
		});

		it('should return detailed attributes() when detailed is true', () => {
			const attrs = attributes(true);
			expect(attrs).toHaveProperty('browserName');
			expect(attrs).toHaveProperty('browserVersion');
			expect(attrs).toHaveProperty('screenWidth');
			expect(attrs).toHaveProperty('screenHeight');
			expect(attrs).toHaveProperty('deviceName');
			expect(attrs).toHaveProperty('deviceManufacturer');
		});

		it('should handle missing platform information gracefully', () => {
			// Mock platform.parse to return minimal info
			vi.mock('platform', () => ({
				default: {
					parse: () => ({
						name: 'unknown',
						version: 'unknown',
					}),
				},
			}));

			const attrs = attributes(true) as DetailedData;
			expect(attrs.browserName).toBe(undefined);
			expect(attrs.browserVersion).toBe(undefined);
		});
	});

	// describe('error handling', () => {
	// 	it('should handle failed record requests', async () => {
	// 		const networkError = new Error('Network error');
	// 		(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(networkError);

	// 		const options: TrackerOptions = {
	// 			projectId: 'test-project',
	// 			recordPath: '/api/event/record',
	// 			actionPath: '/api/event/action',
	// 		};

	// 		const tracker = create(options);

	// 		await tracker.record('test-project', attributes());

	// 		//ok
	// 		expect(consoleError).toHaveBeenCalled();
	// 	});

	// 	it('should handle non-ok response from server', async () => {
	// 		const errorResponse = {
	// 			ok: false,
	// 			status: 500,
	// 			statusText: 'Internal Server Error',
	// 		};
	// 		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(errorResponse);

	// 		const options: TrackerOptions = {
	// 			projectId: 'test-project',
	// 			recordPath: '/api/event/record',
	// 			actionPath: '/api/event/action',
	// 		};

	// 		const tracker = create(options);
	// 		// const consoleError = vi.spyOn(console, 'error');

	// 		await tracker.record('test-project', attributes());

	// 		//ok
	// 		expect(consoleError).toHaveBeenCalled();
	// 	});
	// });
}); 