import { render, act } from '@testing-library/react';
import { TrackerProvider } from '../src/client';
import { create } from '../src/tracker';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';

// Mock the tracker module
vi.mock('../src/tracker', () => ({
	create: vi.fn(),
	attributes: vi.fn(() => ({
		browserName: 'test-browser',
		browserVersion: '1.0',
	})),
}));

describe('Analytics Component', () => {
	const mockStop = vi.fn();
	const mockRecord = vi.fn(() => ({ stop: mockStop }));

	beforeEach(() => {
		vi.clearAllMocks();
		(create as any).mockReturnValue({ record: mockRecord });
		// Mock window.location
		Object.defineProperty(window, 'location', {
			value: { href: 'http://localhost:3000' },
			writable: true,
		});
	});

	it('should render with project id', () => {
		const { container } = render(
			<TrackerProvider
				pathname="/test"
				options={{
					projectId: 'test-project',
					detailed: true,
					ignoreLocalhost: false,
					ignoreOwnVisits: false,
					recordPath: '/api/event/record',
					actionPath: '/api/event/action',
				}}
			>
				<div>Test</div>
			</TrackerProvider>
		);

		expect(container.querySelector('[data-strukt-tracker-id="test-project"]')).toBeTruthy();
	});

	it('should create tracker instance and record', () => {
		render(
			<TrackerProvider
				pathname="/test"
				options={{
					projectId: 'test-project',
					detailed: true,
					ignoreLocalhost: false,
					ignoreOwnVisits: false,
					recordPath: '/api/event/record',
					actionPath: '/api/event/action',
				}}
			>
				<div>Test</div>
			</TrackerProvider>
		);

		expect(create).toHaveBeenCalled();
		expect(mockRecord).toHaveBeenCalledWith('test-project', expect.objectContaining({
			siteLocation: 'http://localhost:3000/test',
		}));
	});

	it('should cleanup on unmount', () => {
		const { unmount } = render(
			<TrackerProvider
				pathname="/test"
				options={{
					projectId: 'test-project',
					detailed: true,
					ignoreLocalhost: false,
					ignoreOwnVisits: false,
					recordPath: '/api/event/record',
					actionPath: '/api/event/action',
				}}
			>
				<div>Test</div>
			</TrackerProvider>
		);

		unmount();
		expect(mockStop).toHaveBeenCalled();
	});
}); 