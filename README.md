# @strukt-io/analytics

![Logo](https://github.com/struktio/strukt/blob/main/public/strukt_logo.png?raw=true)

A lightweight, privacy-focused analytics package for React web applications.

## Features

- Privacy-focused with configurable data collection
- Built-in support for page views and custom events
- TypeScript support
- Automatic path tracking
- Customizable endpoint support

## Install

```bash
npm install @strukt-io/analytics
```

*or*

```bash
yarn add @strukt-io/analytics
```

## Usage

Import and initialize the analytics hook in your application:

```js
<Analytics pathname="/" options={{
  server: 'https://api.example.com/analytics',
  projectId: 'proj_123abc',
  detailed: false,
  ignoreLocalhost: true,
  ignoreOwnVisits: true,
  recordPath: '/api/event/record',
  actionPath: '/api/event/action',
}} />
```

or

```js
useAnalytics('/', {
  server: 'https://api.example.com/analytics',
  projectId: 'proj_123abc',
  detailed: false,
  ignoreLocalhost: true,
  ignoreOwnVisits: true,
  recordPath: '/api/event/record',
  actionPath: '/api/event/action',
})
```

The analytics hook will automatically track page views when the path changes. An undefined or empty path will be skipped.

This hook is safe to use during server-side rendering and will only activate on the client.

## API

### Parameters

- `pathname` `{?String}` Current path to track
- `config` `{Object}` Configuration object containing:
  - `endpoint` `{String}` Analytics API endpoint
  - `projectId` `{String}` Your project identifier
  - `apiKey` `{?String}` Optional API key for authentication
- `options` `{?Object}` Optional configuration:
  - `detailed` `{Boolean}` Enable detailed event tracking
  - `ignoreLocalhost` `{Boolean}` Skip tracking on localhost
  - `ignoreOwnVisits` `{Boolean}` Skip tracking your own visits
  - `customDimensions` `{Object}` Additional data to track


## Privacy

This package is designed with privacy in mind:

- No cookies by default
- Configurable data collection
- IP anonymization
- Respects Do Not Track
- GDPR compliant
- No third-party requests

## License

MIT © Strukt