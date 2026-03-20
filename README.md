# local-chat

[中文说明](./README_zh.md)

Chrome forces you to download several GB of on-device models, but deleting them feels wasteful and keeping them unused is worse. This project gives that model a practical UI.

## What It Does

- Chat with Chrome's on-device model directly in the browser
- Keep local conversation history in `localStorage`
- Edit, resend, regenerate, copy, rename, and export chats
- Attach text, images, and audio files to prompts
- Use the built-in translation page for quick local translation
- Switch between Chinese and English UI

## Tech Stack

- React + TypeScript
- ViewModel-driven state management
- Vite for bundling
- Bun for dependency management and scripts

## Requirements

- Google Chrome with Prompt API support
- If needed, enable `chrome://flags/#prompt-api-for-gemini-nano`
- If needed, update `chrome://components` -> `Optimization Guide On Device Model`

## Development

Install dependencies:

```bash
bun install
```

Start the dev server:

```bash
bun run dev
```

Build for production:

```bash
bun run build
```
