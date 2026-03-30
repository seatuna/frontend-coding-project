# Frontend Take-Home Project: AI Research Assistant (Celena Toon)

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then run the development server:

```bash
npm run dev
```

Note: This project uses `msw` to mock calls to an LLM API. This should already be set up so you won't need to start it yourself. You should be able to see `MSW [mocking enabled]` in the browser console.

To see the error state, you can hit the "Stop" button. It'll abort the request and display an error.

## Assumptions

### Technical

* This project was bootstrapped with React 19, so I didn't worry about making sure I memoized callbacks
* Responses will be returned within 500 ms (the mocked API call returns responses randomly between 0 - 500ms)

### Product / Design

* It should look like a user-friendly chat app
* User should be able to differentiate their input from the AI assistant responses
  - user messages render on the right with a gray background
  - If the user input spans the whole width of the chat, there's a small margin to the left so it doesn't stretch all the way so it's easier to differentiate user vs assistant messages
* The page should scroll along as the streamed response is rendered
* The user textarea should grow if the user types more than one line of text

## Tools

* `msw` - Mock service worker library to mock event streaming. The `public/mockServiceWorker.js` file was generated using a command from `msw` during initial setup
* Cursor - I used AI to help generate the mock api, and the `useChat.tsx` hook
* I kept some of the styles provided from the boilerplate code provided and just worked on top of it to save time

## Improvements

* Move `parseStream` function into a `helpers.ts` file for cleaner code and easier automated testing
* More detailed comments and documentation, especially for the `useChat` hook that contains the majority of the logic
* Automated testing
* Clean up
  - CSS, some elements like the ones displaying the user and assistant messages have common styles that could be consolidated and made into more generic and reusable classes
  - ordering of props (alphabetical order)
  - ordering of imports in files
* Render the returned markdown into actual styles
* Make the user experience a little more fun, like adding animations to the loading state