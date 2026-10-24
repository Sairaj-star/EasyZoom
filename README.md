# EasyZoom

A simple, accessible static website that helps people find official Zoom installation destinations and open a Zoom meeting using either a complete invitation link or a meeting ID/passcode.

## Run locally
1. Extract the ZIP.
2. Open `index.html` in a current browser, or open the folder in VS Code and use a local static server extension.
3. No backend, package installation, API key, or paid service is required.

## Publish free
You can publish the three files (`index.html`, `styles.css`, `script.js`) to GitHub Pages or another static hosting provider.

## Important limitations
- EasyZoom cannot silently install Zoom. App stores and operating systems may require user confirmation or additional installation steps.
- Browser joining depends on Zoom support, device/browser, and the meeting host's settings.
- Meeting ID/passcode entry creates an official Zoom join URL in the user's browser. Zoom may still ask for the passcode or other verification.
- EasyZoom does not send meeting details to a server or save them in local storage.
- Zoom is a third-party service. EasyZoom is not affiliated with Zoom.
