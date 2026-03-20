# local-chat

[English README](./README.md)

Chrome 强制在浏览器里下几个G的模型太鸡肋？删了太麻烦又或者觉得可惜？那就让本项目帮你用起来。

## 项目功能

- 直接在浏览器中调用 Chrome 本地模型进行对话
- 对话历史默认保存在当前浏览器
- 支持编辑、重发、重新生成、复制、重命名、导出对话
- 支持文本、图片、音频附件
- 内置独立翻译页面，适合本地快速翻译
- 提供中英文界面切换

## 技术栈

- React + TypeScript
- ViewModel 架构
- Vite 构建
- Bun 管理依赖与脚本

## 使用前提

- 需要使用支持 Prompt API 的 Google Chrome
- 如有需要，可开启 `chrome://flags/#prompt-api-for-gemini-nano`
- 如有需要，可在 `chrome://components` 中更新 `Optimization Guide On Device Model`

## 本地开发

安装依赖：

```bash
bun install
```

启动开发环境：

```bash
bun run dev
```

生产构建：

```bash
bun run build
```
