import { marked } from "marked";

const STORAGE_KEY = "local-chat-histories";
const LANG_KEY = "local-chat-language";
const SETTINGS_KEY = "local-chat-settings";
const SIDEBAR_WIDTH_DEFAULT = 280;
const SIDEBAR_WIDTH_MIN = 220;
const SIDEBAR_WIDTH_MAX = 420;
const MAX_EMBED_BYTES = 1_500_000;
const MAX_TEXT_CHARS = 8000;
const MAX_PROMPT_TEXT_CHARS = 6000;
const TITLE_PROMPT =
  "Given a conversation between a user and assistant, infer the language used, and generate a short, natural title in that same language. No punctuation. No framing. Just output the title.\n\nConversation:\nUser: {user}\nAssistant: {assistant}";

export const I18N = {
  "zh-CN": {
    appTitle: "本地模型对话（Chrome Prompt API）",
    brandTitle: "本地模型对话",
    brandSub: "Chrome Prompt API",
    language: "语言",
    newChat: "新建对话",
    translate: "翻译",
    defaultTitle: "新对话",
    rename: "重命名",
    delete: "删除",
    send: "发送",
    stop: "停止",
    uploadFile: "上传文件",
    attachPhoto: "拍照",
    attachAudio: "录音",
    attachments: "附件",
    remove: "移除",
    attachmentPreviewUnavailable: "预览不可用",
    attachmentTemp: "预览仅当前会话可用",
    openPreview: "打开预览",
    recordStart: "开始录音",
    recordStop: "停止录音",
    recording: "录音中...",
    recordPermissionDenied: "无法获取麦克风权限。",
    recordUnavailable: "当前浏览器不支持录音。",
    inputPlaceholder: "输入内容，按 Ctrl/⌘ + Enter 发送",
    statusStreaming: "模型输出中...",
    statusError: "发生错误：",
    apiChromeOnly: "仅支持 Chrome 浏览器，请使用 Chrome 运行此应用。",
    apiDownloadable:
      "Prompt API 可下载，请打开 chrome://components，点击 Optimization Guide On Device Model 的 Update 按钮。",
    apiDownloading: "Prompt API 正在下载中...",
    apiNeedFlag: "Prompt API 不可用，请开启 chrome://flags/#prompt-api-for-gemini-nano。",
    apiTitle: "Prompt API",
    apiForceUse: "强制使用",
    apiDownloadNow: "立即下载",
    apiDownloadProgress: "下载进度",
    editMessage: "编辑消息",
    editCancel: "取消",
    editSave: "保存",
    resend: "从此处重发",
    regenerate: "重新生成",
    copy: "复制",
    toastCopied: "已复制到剪贴板",
    toastCopyFailed: "复制失败",
    confirm: "确定",
    cancel: "取消",
    settings: "设置",
    close: "关闭",
    theme: "主题",
    themeSystem: "跟随系统",
    themeLight: "日间",
    themeDark: "夜间",
    sendShortcut: "发送快捷键",
    templateChat: "系统提示词",
    templateTitle: "标题总结模板",
    save: "保存",
    hintChat: "可用变量：{date} {language}",
    hintTitle: "可用变量：{date} {language} {user} {assistant}。留空将禁用自动生成标题。",
    settingsBackup: "设置备份",
    backupSettings: "备份设置",
    backupToFile: "导出文件",
    backupToClipboard: "复制到剪贴板",
    importSettings: "导入设置",
    importFromFile: "从文件导入",
    importFromClipboard: "从剪贴板导入",
    clipboardUnavailable: "剪贴板不可用或权限被拒绝。",
    exportChats: "导出对话",
    openExportDialog: "打开导出面板",
    exportDialogTitle: "导出对话",
    exportHint: "可多选对话进行导出",
    exportFormat: "导出格式",
    exportSelectAll: "全选",
    exportClear: "清空",
    exportSelected: "导出选中",
    exportEmpty: "暂无可导出的对话",
    exportFormatJson: "JSON",
    exportFormatMd: "Markdown",
    exportFormatTxt: "文本",
    roleUser: "用户",
    roleAssistant: "助手",
    emptyTitle: "开始一段本地对话",
    emptyBody: "在浏览器里直接整理想法、粘贴内容、附加图片或录音，再交给本地模型处理。",
    emptyPrivacy: "对话与设置默认保存在当前浏览器。",
    composerHint: "支持文本、图片、音频与粘贴文件。",
    historyCount: "对话",
    topbarUpdated: "更新于",
    topbarMessages: "消息",
    topbarContext: "上下文",
    topbarAttachments: "附件",
    locale: "zh-CN",
  },
  "en-US": {
    appTitle: "Local Model Chat (Chrome Prompt API)",
    brandTitle: "Local Model Chat",
    brandSub: "Chrome Prompt API",
    language: "Language",
    newChat: "New Chat",
    translate: "Translate",
    defaultTitle: "New Chat",
    rename: "Rename",
    delete: "Delete",
    send: "Send",
    stop: "Stop",
    uploadFile: "Upload",
    attachPhoto: "Photo",
    attachAudio: "Audio",
    attachments: "Attachments",
    remove: "Remove",
    attachmentPreviewUnavailable: "Preview unavailable",
    attachmentTemp: "Preview available this session only",
    openPreview: "Open preview",
    recordStart: "Start recording",
    recordStop: "Stop recording",
    recording: "Recording...",
    recordPermissionDenied: "Microphone permission denied.",
    recordUnavailable: "Recording is not supported in this browser.",
    inputPlaceholder: "Type here, press Ctrl/⌘ + Enter to send",
    statusStreaming: "Model is responding...",
    statusError: "Error: ",
    apiChromeOnly: "This app only supports Chrome. Please use Chrome.",
    apiDownloadable:
      "Prompt API is downloadable. Open chrome://components and click Update for Optimization Guide On Device Model.",
    apiDownloading: "Prompt API is downloading...",
    apiNeedFlag: "Prompt API is unavailable. Enable chrome://flags/#prompt-api-for-gemini-nano.",
    apiTitle: "Prompt API",
    apiForceUse: "Force Use",
    apiDownloadNow: "Download Now",
    apiDownloadProgress: "Download progress",
    editMessage: "Edit Message",
    editCancel: "Cancel",
    editSave: "Save",
    resend: "Resend from here",
    regenerate: "Regenerate",
    copy: "Copy",
    toastCopied: "Copied to clipboard",
    toastCopyFailed: "Copy failed",
    confirm: "Confirm",
    cancel: "Cancel",
    settings: "Settings",
    close: "Close",
    theme: "Theme",
    themeSystem: "System",
    themeLight: "Light",
    themeDark: "Dark",
    sendShortcut: "Send Shortcut",
    templateChat: "System Prompt",
    templateTitle: "Title Summary Template",
    save: "Save",
    hintChat: "Available variables: {date} {language}",
    hintTitle: "Available variables: {date} {language} {user} {assistant}. Leave empty to disable auto title.",
    settingsBackup: "Settings Backup",
    backupSettings: "Backup Settings",
    backupToFile: "Export File",
    backupToClipboard: "Copy to Clipboard",
    importSettings: "Import Settings",
    importFromFile: "Import from File",
    importFromClipboard: "Import from Clipboard",
    clipboardUnavailable: "Clipboard unavailable or permission denied.",
    exportChats: "Export Chats",
    openExportDialog: "Open Export Panel",
    exportDialogTitle: "Export Chats",
    exportHint: "Select multiple chats to export",
    exportFormat: "Format",
    exportSelectAll: "Select All",
    exportClear: "Clear",
    exportSelected: "Export Selected",
    exportEmpty: "No chats to export",
    exportFormatJson: "JSON",
    exportFormatMd: "Markdown",
    exportFormatTxt: "Text",
    roleUser: "User",
    roleAssistant: "Assistant",
    emptyTitle: "Start a local conversation",
    emptyBody:
      "Draft ideas in the browser, paste content, attach images, or record audio before sending it to the on-device model.",
    emptyPrivacy: "Chats and settings stay in this browser by default.",
    composerHint: "Supports text, images, audio, and pasted files.",
    historyCount: "Chats",
    topbarUpdated: "Updated",
    topbarMessages: "Messages",
    topbarContext: "Context",
    topbarAttachments: "Attachments",
    locale: "en-US",
  },
} as const;

type Role = "user" | "assistant";
type SendShortcut = "ctrlEnter" | "shiftEnter" | "enter";
export type ThemeMode = "system" | "light" | "dark";

export type AttachmentKind = "text" | "image" | "audio";

export type Attachment = {
  id: string;
  kind: AttachmentKind;
  name: string;
  mime: string;
  size: number;
  lastModified: number;
  text?: string;
  textTruncated?: boolean;
  dataUrl?: string;
  transientUrl?: string;
};

export type Message = {
  role: Role;
  content: string;
  ts: number;
  attachments?: Attachment[];
};

export type History = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  autoTitleDone: boolean;
  messages: Message[];
};

export type Settings = {
  sendShortcut: SendShortcut;
  theme: ThemeMode;
  systemPrompt: string;
  titleTemplate: string;
  sidebarWidth: number;
};

export type RenameSource = "topbar" | "history" | null;

export type State = {
  histories: History[];
  activeId: string | null;
  streaming: boolean;
  streamingId: string | null;
  editingIndex: number | null;
  editDraft: string;
  statusText: string;
  apiStatusText: string;
  apiAvailability: ApiAvailability;
  downloadProgress: number | null;
  promptContextUsage: number | null;
  promptContextWindow: number | null;
  settings: Settings;
  currentLang: keyof typeof I18N;
  renameTargetId: string | null;
  renameDraft: string;
  renameSource: RenameSource;
  composerAttachments: Attachment[];
  previewAttachment: Attachment | null;
  recording: boolean;
};

type Listener = () => void;

type ApiAvailability =
  | "unknown"
  | "chromeOnly"
  | "needFlag"
  | "downloadable"
  | "downloading"
  | "ready";

const formatterOptions = {
  gfm: true,
  breaks: true,
} as const;

marked.setOptions(formatterOptions);

const escapeHtml = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const renderMarkdown = (md: string) => {
  if (marked) {
    return marked.parse(md || "");
  }
  return `<p>${escapeHtml(md || "")}</p>`;
};

export class ChatViewModel {
  private listeners = new Set<Listener>();
  private chatSessions = new Map<
    string,
    { session: LanguageModel; modalities: Set<LanguageModelMessageType> }
  >();
  private readonly maxChatSessions = 8;
  private availabilityTimer: number | null = null;
  private availabilityInFlight = false;
  private downloadInFlight = false;
  private streamToken: { historyId: string; cancelled: boolean } | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordChunks: Blob[] = [];
  private recordStream: MediaStream | null = null;
  private recordDiscard = false;
  private state: State;

  constructor() {
    const currentLang = this.initLanguage();
    const settings = this.loadSettings();
    const histories = this.loadHistories();
    const activeId = null;

    this.state = {
      histories,
      activeId,
      streaming: false,
      streamingId: null,
      editingIndex: null,
      editDraft: "",
      statusText: "",
      apiStatusText: "",
      apiAvailability: "unknown",
      downloadProgress: null,
      promptContextUsage: null,
      promptContextWindow: null,
      settings,
      currentLang,
      renameTargetId: null,
      renameDraft: "",
      renameSource: null,
      composerAttachments: [],
      previewAttachment: null,
      recording: false,
    };
  }

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => this.state;

  private emit() {
    this.listeners.forEach((listener) => listener());
  }

  private setState(updater: (prev: State) => State) {
    this.state = updater(this.state);
    this.emit();
  }

  private setPromptContextState(contextUsage: number | null, contextWindow: number | null) {
    this.setState((prev) => {
      if (
        prev.promptContextUsage === contextUsage &&
        prev.promptContextWindow === contextWindow
      ) {
        return prev;
      }
      return { ...prev, promptContextUsage: contextUsage, promptContextWindow: contextWindow };
    });
  }

  t = (key: keyof (typeof I18N)["en-US"]) => {
    const { currentLang } = this.state;
    return (
      (I18N[currentLang] && I18N[currentLang][key]) || I18N["en-US"][key] || key
    );
  };

  private formatApiStatusText(status: ApiAvailability, lang: keyof typeof I18N) {
    if (status === "chromeOnly") return I18N[lang].apiChromeOnly;
    if (status === "downloadable") return I18N[lang].apiDownloadable;
    if (status === "downloading") return I18N[lang].apiDownloading;
    if (status === "needFlag") return I18N[lang].apiNeedFlag;
    return "";
  }

  private isChromeOnly = () => {
    const ua = navigator.userAgent || "";
    const isChrome = /Chrome\//.test(ua);
    const isEdge = /Edg\//.test(ua);
    const isOpera = /OPR\//.test(ua);
    return isChrome && !isEdge && !isOpera;
  };

  private setApiAvailability(status: ApiAvailability) {
    this.setState((prev) => ({
      ...prev,
      apiAvailability: status,
      apiStatusText: this.formatApiStatusText(status, prev.currentLang),
      downloadProgress:
        status === "downloadable" || status === "downloading" ? prev.downloadProgress : null,
    }));
  }

  private refreshApiStatusText = () => {
    this.setState((prev) => ({
      ...prev,
      apiStatusText: this.formatApiStatusText(prev.apiAvailability, prev.currentLang),
    }));
  }

  startAvailabilityCheck = () => {
    if (this.availabilityInFlight) return;
    this.availabilityInFlight = true;
    void this.checkAvailability();
  };

  forceUsePromptApi = async () => {
    if (this.availabilityTimer) window.clearTimeout(this.availabilityTimer);
    this.availabilityTimer = null;
    this.availabilityInFlight = true;
    this.setState((prev) => ({ ...prev, apiStatusText: "" }));

    if (!this.isChromeOnly()) {
      this.setApiAvailability("chromeOnly");
      this.availabilityInFlight = false;
      return;
    }

    let session: LanguageModel | null = null;
    try {
      session = await this.createSession(this.textOnlyModalities());
      this.setApiAvailability("ready");
      this.availabilityInFlight = false;
    } catch {
      await this.checkAvailability();
      if (this.state.apiAvailability !== "downloading") {
        this.availabilityInFlight = false;
      }
    } finally {
      if (session) this.destroySession(session);
    }
  };

  startDownloadPromptApi = async () => {
    if (this.downloadInFlight) return;
    this.downloadInFlight = true;
    this.setApiAvailability("downloading");
    this.setState((prev) => ({ ...prev, downloadProgress: 0 }));

    let session: LanguageModel | null = null;
    try {
      const lm = this.getPromptApi();
      const expected = this.buildExpectedOptions(this.textOnlyModalities());
      session = await lm.create({
        temperature: 0.7,
        topK: 40,
        ...expected,
        monitor: (monitor) => {
          monitor.addEventListener?.("downloadprogress", (event) => {
            const loaded = event.loaded;
            if (typeof loaded !== "number") return;
            const progress = Math.max(0, Math.min(1, loaded));
            this.setState((prev) => ({ ...prev, downloadProgress: progress }));
          });
        },
      });
      this.setApiAvailability("ready");
      this.setState((prev) => ({ ...prev, apiStatusText: "", downloadProgress: null }));
    } catch {
      await this.checkAvailability();
      this.setState((prev) => ({ ...prev, downloadProgress: null }));
    } finally {
      if (session) this.destroySession(session);
      this.downloadInFlight = false;
    }
  };

  formatDate = (ts: number) => {
    const locale = I18N[this.state.currentLang]?.locale || "en-US";
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(ts));
  };

  formatTime = (ts: number) => {
    const locale = I18N[this.state.currentLang]?.locale || "en-US";
    return new Date(ts).toLocaleString(locale, {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  private formatDateTime = (ts: number) => {
    const locale = I18N[this.state.currentLang]?.locale || "en-US";
    return new Date(ts).toLocaleString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  formatBytes = (value: number) => {
    if (!Number.isFinite(value)) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    let size = Math.max(0, value);
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex += 1;
    }
    const precision = unitIndex === 0 ? 0 : size < 10 ? 1 : 0;
    return `${size.toFixed(precision)} ${units[unitIndex]}`;
  };

  private getPromptLanguages = () => {
    const lang = this.state.currentLang;
    if (lang.toLowerCase().startsWith("en")) return ["en"];
    if (lang.toLowerCase().startsWith("ja")) return ["ja"];
    if (lang.toLowerCase().startsWith("es")) return ["es"];
    return undefined;
  };

  private buildExpectedInputs = (
    modalities: Set<LanguageModelMessageType>
  ): LanguageModelExpected[] => {
    const languages = this.getPromptLanguages();
    const inputs: LanguageModelExpected[] = [
      languages ? { type: "text", languages } : { type: "text" },
    ];
    if (modalities.has("image")) inputs.push({ type: "image" });
    if (modalities.has("audio")) inputs.push({ type: "audio" });
    return inputs;
  };

  private buildExpectedOutputs = (): LanguageModelExpected[] => {
    const languages = this.getPromptLanguages();
    return [languages ? { type: "text", languages } : { type: "text" }];
  };

  private buildExpectedOptions = (modalities: Set<LanguageModelMessageType>) => ({
    expectedInputs: this.buildExpectedInputs(modalities),
    expectedOutputs: this.buildExpectedOutputs(),
  });

  private textOnlyModalities = () => new Set<LanguageModelMessageType>(["text"]);

  private templateDate = () => this.formatDate(Date.now());

  private applyTemplate = (template: string, vars: Record<string, string>) =>
    Object.keys(vars).reduce((acc, key) => {
      return acc.replaceAll(`{${key}}`, vars[key] ?? "");
    }, template || "");

  private defaultSettings = (): Settings => ({
    sendShortcut: "ctrlEnter",
    theme: "system",
    systemPrompt: "",
    titleTemplate: TITLE_PROMPT,
    sidebarWidth: SIDEBAR_WIDTH_DEFAULT,
  });

  getTitlePrompt = () => TITLE_PROMPT;

  private loadSettings() {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return this.defaultSettings();
    try {
      const parsed = JSON.parse(raw) as Partial<Settings & { chatTemplate?: string }>;
      const next = {
        ...this.defaultSettings(),
        ...parsed,
        systemPrompt: parsed.systemPrompt ?? parsed.chatTemplate ?? "",
      };
      return this.sanitizeSettings(next);
    } catch {
      return this.defaultSettings();
    }
  }

  private normalizeSidebarWidth = (value: unknown) => {
    if (typeof value !== "number" || Number.isNaN(value)) return SIDEBAR_WIDTH_DEFAULT;
    const rounded = Math.round(value);
    return Math.min(SIDEBAR_WIDTH_MAX, Math.max(SIDEBAR_WIDTH_MIN, rounded));
  };

  private sanitizeSettings = (settings: Settings): Settings => ({
    ...settings,
    sidebarWidth: this.normalizeSidebarWidth(settings.sidebarWidth),
  });

  exportSettingsBundle = () => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      settings: this.state.settings,
    };
    return {
      filename: `settings_${this.fileStamp()}.json`,
      mime: "application/json",
      content: JSON.stringify(payload, null, 2),
    };
  };

  importSettingsBundle = (raw: string) => {
    try {
      const parsed = JSON.parse(raw) as unknown;
      const isRecord = (value: unknown): value is Record<string, unknown> =>
        typeof value === "object" && value !== null;
      if (!isRecord(parsed)) return { ok: false, error: "Invalid settings format." };
      const input = isRecord(parsed.settings) ? parsed.settings : parsed;
      if (!isRecord(input)) return { ok: false, error: "Invalid settings format." };
      const next = {
        ...this.defaultSettings(),
        ...input,
      };
      this.updateSettings(next as Settings);
      return { ok: true };
    } catch {
      return { ok: false, error: "Invalid JSON." };
    }
  };

  exportHistoriesBundle = (ids: string[], format: "json" | "md" | "txt") => {
    const selected = this.state.histories.filter((h) => ids.includes(h.id));
    const stamp = this.fileStamp();

    if (format === "json") {
      const payload = {
        version: 1,
        exportedAt: new Date().toISOString(),
        histories: this.serializeHistories(selected),
      };
      return {
        filename: `chats_${stamp}.json`,
        mime: "application/json",
        content: JSON.stringify(payload, null, 2),
      };
    }

    const lines: string[] = [];
    selected.forEach((history, index) => {
      if (index > 0) lines.push("", "");
      lines.push(`# ${history.name}`);
      lines.push(`Created: ${this.formatDateTime(history.createdAt)}`);
      lines.push(`Updated: ${this.formatDateTime(history.updatedAt)}`);
      lines.push("");
      history.messages.forEach((message) => {
        lines.push(`[${this.t(message.role === "user" ? "roleUser" : "roleAssistant")} ${this.formatDateTime(message.ts)}]`);
        if (message.content) {
          lines.push(message.content.trim());
        }
        if (message.attachments && message.attachments.length > 0) {
          const names = message.attachments.map((attachment) => {
            const size = this.formatBytes(attachment.size);
            return `${attachment.name} (${size})`;
          });
          lines.push(`Attachments: ${names.join(", ")}`);
        }
        lines.push("");
      });
    });

    return {
      filename: `chats_${stamp}.${format}`,
      mime: format === "md" ? "text/markdown" : "text/plain",
      content: lines.join("\n").trim(),
    };
  };

  private persistSettings(settings: Settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  private serializeHistories(histories: History[]) {
    return histories.map((history) => ({
      ...history,
      messages: history.messages.map((message) => ({
        ...message,
        attachments: message.attachments?.map((attachment) =>
          Object.fromEntries(
            Object.entries(attachment).filter(([key]) => key !== "transientUrl")
          ) as Omit<Attachment, "transientUrl">
        ),
      })),
    }));
  }

  private saveHistories(histories: History[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.serializeHistories(histories)));
  }

  private loadHistories(): History[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as History[];
      return this.normalizeHistories(parsed);
    } catch {
      return [];
    }
  }

  private normalizeHistories(histories: History[]) {
    return histories.map((history) => ({
      ...history,
      messages: history.messages.map((message) => ({
        ...message,
        attachments: message.attachments?.map((attachment) => ({
          ...attachment,
        })),
      })),
    }));
  }

  private initLanguage(): keyof typeof I18N {
    const saved = localStorage.getItem(LANG_KEY) as keyof typeof I18N | null;
    if (saved && I18N[saved]) return saved;

    const browserLang = (navigator.language || "en-US").toLowerCase();
    const match = (Object.keys(I18N) as Array<keyof typeof I18N>).find(
      (key) => key.toLowerCase() === browserLang || key.toLowerCase().startsWith(browserLang)
    );
    return match || "en-US";
  }

  setLanguage = (lang: keyof typeof I18N) => {
    if (!I18N[lang]) return;
    localStorage.setItem(LANG_KEY, lang);
    this.clearChatSessions();
    this.setState((prev) => ({
      ...prev,
      currentLang: lang,
    }));
    this.refreshApiStatusText();
  };

  private createHistory = (lang: keyof typeof I18N, name: string | null = null): History => {
    const now = Date.now();
    return {
      id: crypto.randomUUID(),
      name: name || I18N[lang].defaultTitle,
      createdAt: now,
      updatedAt: now,
      autoTitleDone: false,
      messages: [],
    };
  };

  newChat = () => {
    if (this.state.recording) this.cancelRecording();
    this.revokeAttachments(this.state.composerAttachments);
    this.setState((prev) => {
      const history = this.createHistory(prev.currentLang);
      const histories = [history, ...prev.histories];
      this.saveHistories(histories);
      return {
        ...prev,
        histories,
        activeId: history.id,
        editingIndex: null,
        editDraft: "",
        composerAttachments: [],
        previewAttachment: null,
      };
    });
    this.setPromptContextState(null, null);
  };

  setActive = (id: string) => {
    if (this.state.recording) this.cancelRecording();
    this.revokeAttachments(this.state.composerAttachments);
    this.setState((prev) => ({
      ...prev,
      activeId: id,
      editingIndex: null,
      editDraft: "",
      renameTargetId: null,
      renameDraft: "",
      renameSource: null,
      composerAttachments: [],
      previewAttachment: null,
    }));
    this.syncActiveSessionContext(id);
  };

  deleteHistory = (id: string) => {
    if (!id) return;
    if (id === this.state.activeId) {
      this.deleteActive();
      return;
    }

    if (this.state.streamingId === id) {
      this.cancelStream(id);
    }
    this.deleteChatSession(id);

    const target = this.state.histories.find((history) => history.id === id);
    if (target) {
      this.revokeAttachments(target.messages.flatMap((message) => message.attachments ?? []));
    }

    this.setState((prev) => {
      const exists = prev.histories.some((history) => history.id === id);
      if (!exists) return prev;
      const histories = prev.histories.filter((history) => history.id !== id);
      this.saveHistories(histories);
      return {
        ...prev,
        histories,
        renameTargetId: prev.renameTargetId === id ? null : prev.renameTargetId,
        renameDraft: prev.renameTargetId === id ? "" : prev.renameDraft,
        renameSource: prev.renameTargetId === id ? null : prev.renameSource,
      };
    });
  };

  deleteActive = () => {
    if (this.state.recording) this.cancelRecording();
    const activeId = this.state.activeId;
    if (activeId) {
      if (this.state.streamingId === activeId) {
        this.cancelStream(activeId);
      }
      this.deleteChatSession(activeId);
    }
    const activeHistory = this.getActive();
    if (activeHistory) {
      this.revokeAttachments(
        activeHistory.messages.flatMap((message) => message.attachments ?? [])
      );
    }
    this.revokeAttachments(this.state.composerAttachments);
    this.setState((prev) => {
      const deletedId = prev.activeId;
      if (!deletedId) return prev;
      const remaining = prev.histories.filter((history) => history.id !== deletedId);
      this.saveHistories(remaining);
      return {
        ...prev,
        histories: remaining,
        activeId: null,
        editingIndex: null,
        editDraft: "",
        renameTargetId: null,
        renameDraft: "",
        renameSource: null,
        composerAttachments: [],
        previewAttachment: null,
      };
    });
  };

  beginRenameTopbar = () => {
    const history = this.getActive();
    if (!history) return;
    this.setState((prev) => ({
      ...prev,
      renameTargetId: history.id,
      renameDraft: history.name,
      renameSource: "topbar",
    }));
  };

  beginRenameHistory = (id: string) => {
    const history = this.state.histories.find((h) => h.id === id);
    if (!history) return;
    this.setState((prev) => ({
      ...prev,
      renameTargetId: id,
      renameDraft: history.name,
      renameSource: "history",
    }));
  };

  updateRenameDraft = (value: string) => {
    this.setState((prev) => ({ ...prev, renameDraft: value }));
  };

  commitRename = () => {
    this.setState((prev) => {
      const targetId = prev.renameTargetId;
      if (!targetId) return prev;
      const clean = (prev.renameDraft || "").trim();
      if (!clean) {
        return { ...prev, renameTargetId: null, renameDraft: "", renameSource: null };
      }
      const histories = prev.histories.map((history) =>
        history.id === targetId
          ? { ...history, name: clean, updatedAt: Date.now() }
          : history
      );
      this.saveHistories(histories);
      return {
        ...prev,
        histories,
        renameTargetId: null,
        renameDraft: "",
        renameSource: null,
      };
    });
  };

  cancelRename = () => {
    this.setState((prev) => ({
      ...prev,
      renameTargetId: null,
      renameDraft: "",
      renameSource: null,
    }));
  };

  updateSettings = (next: Settings) => {
    const sanitized = this.sanitizeSettings(next);
    this.persistSettings(sanitized);
    if (this.state.settings.systemPrompt !== sanitized.systemPrompt) {
      this.clearChatSessions();
    }
    this.setState((prev) => ({ ...prev, settings: sanitized }));
  };

  updateSettingsField = (patch: Partial<Settings>) => {
    const next = this.sanitizeSettings({ ...this.state.settings, ...patch });
    this.persistSettings(next);
    if (this.state.settings.systemPrompt !== next.systemPrompt) {
      this.clearChatSessions();
    }
    this.setState((prev) => ({ ...prev, settings: next }));
  };

  setSidebarWidth = (width: number) => {
    this.updateSettingsField({ sidebarWidth: width });
  };

  private fileStamp = () =>
    new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-").replace("T", "_").replace("Z", "");

  private limitText = (text: string, limit: number) => {
    if (text.length <= limit) return { text, truncated: false };
    return { text: `${text.slice(0, limit)}...`, truncated: true };
  };

  private readAsDataUrl = (file: Blob) =>
    new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onerror = () => resolve(null);
      reader.onload = () =>
        resolve(typeof reader.result === "string" ? reader.result : null);
      reader.readAsDataURL(file);
    });

  private getAttachmentKind = (file: File): AttachmentKind | null => {
    const type = (file.type || "").toLowerCase();
    if (type.startsWith("text/")) return "text";
    if (type.startsWith("image/")) return "image";
    if (type.startsWith("audio/")) return "audio";
    const name = file.name.toLowerCase();
    if (/\.(txt|md|csv|json|yaml|yml|log)$/.test(name)) return "text";
    if (/\.(mp3|wav|m4a|aac|flac|ogg|opus)$/.test(name)) return "audio";
    return null;
  };

  private async buildAttachment(file: File): Promise<Attachment | null> {
    const kind = this.getAttachmentKind(file);
    if (!kind) return null;
    const attachment: Attachment = {
      id: crypto.randomUUID(),
      kind,
      name: file.name || `${kind}-${this.fileStamp()}`,
      mime: file.type || "application/octet-stream",
      size: file.size,
      lastModified: file.lastModified || Date.now(),
    };

    if (kind === "text") {
      const raw = await file.text();
      const preview = this.limitText(raw.trim(), MAX_TEXT_CHARS);
      return {
        ...attachment,
        text: preview.text,
        textTruncated: preview.truncated,
      };
    }

    const transientUrl = URL.createObjectURL(file);
    let dataUrl: string | undefined;
    if (file.size <= MAX_EMBED_BYTES) {
      const read = await this.readAsDataUrl(file);
      if (read) dataUrl = read;
    }
    return { ...attachment, dataUrl, transientUrl };
  }

  addAttachmentsFromFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;
    const prepared = await Promise.all(list.map((file) => this.buildAttachment(file)));
    const attachments = prepared.filter((item): item is Attachment => Boolean(item));
    if (attachments.length === 0) return;
    this.setState((prev) => ({
      ...prev,
      composerAttachments: [...prev.composerAttachments, ...attachments],
    }));
  };

  removeComposerAttachment = (id: string) => {
    const target = this.state.composerAttachments.find((item) => item.id === id);
    if (target?.transientUrl) URL.revokeObjectURL(target.transientUrl);
    this.setState((prev) => ({
      ...prev,
      previewAttachment:
        prev.previewAttachment && prev.previewAttachment.id === id
          ? null
          : prev.previewAttachment,
      composerAttachments: prev.composerAttachments.filter((item) => item.id !== id),
    }));
  };

  private recordingExtension = (mime: string) => {
    const lower = mime.toLowerCase();
    if (lower.includes("ogg")) return "ogg";
    if (lower.includes("mpeg") || lower.includes("mp3")) return "mp3";
    if (lower.includes("wav")) return "wav";
    if (lower.includes("mp4") || lower.includes("m4a")) return "m4a";
    if (lower.includes("webm")) return "webm";
    return "audio";
  };

  private async addRecordingBlob(blob: Blob) {
    const mime = blob.type || "audio/webm";
    const ext = this.recordingExtension(mime);
    const file = new File([blob], `recording-${this.fileStamp()}.${ext}`, { type: mime });
    const attachment = await this.buildAttachment(file);
    if (!attachment) return;
    this.setState((prev) => ({
      ...prev,
      composerAttachments: [...prev.composerAttachments, attachment],
    }));
  }

  private cleanupRecording = () => {
    if (this.recordStream) {
      this.recordStream.getTracks().forEach((track) => track.stop());
    }
    this.recordStream = null;
    this.mediaRecorder = null;
    this.recordChunks = [];
  };

  startRecording = async () => {
    if (this.state.recording) return;
    if (this.state.streaming) return;
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      this.setState((prev) => ({ ...prev, statusText: this.t("recordUnavailable") }));
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      this.recordDiscard = false;
      this.recordChunks = [];
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) this.recordChunks.push(event.data);
      };
      recorder.onstop = async () => {
        if (this.recordDiscard) {
          this.recordDiscard = false;
          this.cleanupRecording();
          return;
        }
        const blob = new Blob(this.recordChunks, { type: recorder.mimeType || "audio/webm" });
        this.cleanupRecording();
        await this.addRecordingBlob(blob);
      };
      recorder.onerror = () => {
        this.cleanupRecording();
        this.setState((prev) => ({ ...prev, recording: false }));
      };
      this.mediaRecorder = recorder;
      this.recordStream = stream;
      recorder.start();
      this.setState((prev) => ({ ...prev, recording: true, statusText: this.t("recording") }));
    } catch {
      this.cleanupRecording();
      this.setState((prev) => ({ ...prev, recording: false, statusText: this.t("recordPermissionDenied") }));
    }
  };

  stopRecording = () => {
    if (!this.mediaRecorder) return;
    this.recordDiscard = false;
    this.mediaRecorder.stop();
    this.setState((prev) => ({ ...prev, recording: false, statusText: "" }));
  };

  cancelRecording = () => {
    if (!this.mediaRecorder) return;
    this.recordDiscard = true;
    this.mediaRecorder.stop();
    this.setState((prev) => ({ ...prev, recording: false, statusText: "" }));
  };

  openAttachmentPreview = (attachment: Attachment) => {
    if (attachment.kind === "text") return;
    const previewUrl = attachment.dataUrl || attachment.transientUrl;
    if (!previewUrl) return;
    this.setState((prev) => ({ ...prev, previewAttachment: attachment }));
  };

  closeAttachmentPreview = () => {
    if (!this.state.previewAttachment) return;
    this.setState((prev) => ({ ...prev, previewAttachment: null }));
  };

  private revokeAttachments = (attachments?: Attachment[]) => {
    attachments?.forEach((attachment) => {
      if (attachment.transientUrl) URL.revokeObjectURL(attachment.transientUrl);
    });
  };

  openEdit = (index: number) => {
    if (this.state.streaming) return;
    const history = this.getActive();
    const msg = history?.messages[index];
    if (!msg) return;
    this.setState((prev) => ({
      ...prev,
      editingIndex: index,
      editDraft: msg.content || "",
    }));
  };

  closeEdit = () => {
    this.setState((prev) => ({ ...prev, editingIndex: null, editDraft: "" }));
  };

  updateEditDraft = (value: string) => {
    this.setState((prev) => ({ ...prev, editDraft: value }));
  };

  saveEdit = () => {
    this.setState((prev) => {
      const history = this.getActive(prev);
      if (!history) return prev;
      const idx = prev.editingIndex;
      if (idx === null) return prev;
      const msg = history.messages[idx];
      if (!msg) return prev;
      const histories = prev.histories.map((h) =>
        h.id === history.id
          ? {
              ...h,
              messages: h.messages.map((m, i) =>
                i === idx ? { ...m, content: prev.editDraft.trim() } : m
              ),
              updatedAt: Date.now(),
            }
          : h
      );
      this.saveHistories(histories);
      return {
        ...prev,
        histories,
        editingIndex: null,
        editDraft: "",
      };
    });
  };

  deleteMessage = (index: number) => {
    const active = this.getActive();
    const target = active?.messages[index];
    if (target?.attachments) this.revokeAttachments(target.attachments);
    this.setState((prev) => {
      const history = this.getActive(prev);
      if (!history) return prev;
      if (index < 0 || index >= history.messages.length) return prev;
      const previewIds = new Set(target?.attachments?.map((attachment) => attachment.id));
      const histories = prev.histories.map((h) =>
        h.id === history.id
          ? {
              ...h,
              messages: h.messages.filter((_, i) => i !== index),
              updatedAt: Date.now(),
            }
          : h
      );
      this.saveHistories(histories);
      return {
        ...prev,
        histories,
        previewAttachment:
          prev.previewAttachment && previewIds.has(prev.previewAttachment.id)
            ? null
            : prev.previewAttachment,
      };
    });
  };

  resendFrom = async (index: number) => {
    if (this.state.streaming) return;
    const history = this.getActive();
    const msg = history?.messages[index];
    if (!msg || msg.role !== "user") return;

    this.setState((prev) => {
      const active = this.getActive(prev);
      if (!active) return prev;
      const nextMessages = active.messages.slice(0, index + 1).map((m, i) =>
        i === index ? { ...m, content: prev.editDraft.trim() } : m
      );
      nextMessages.push({ role: "assistant", content: "", ts: Date.now() });
      const histories = prev.histories.map((h) =>
        h.id === active.id
          ? { ...h, messages: nextMessages, updatedAt: Date.now() }
          : h
      );
      this.saveHistories(histories);
      return {
        ...prev,
        histories,
        editingIndex: null,
        editDraft: "",
        streaming: true,
        streamingId: active.id,
        statusText: this.t("statusStreaming"),
      };
    });

    const active = this.getActive();
    if (!active) return;
    const targetId = active.id;
    const token = this.beginStreaming(targetId);

    try {
      const { prompt, modalities } = await this.buildChatPrompt(active);
      const cancelled = await this.streamAssistant(prompt, targetId, token, modalities);
      if (cancelled) return;
    } catch (err) {
      if (!token.cancelled) this.failAssistant(err, targetId);
    } finally {
      this.finishStreaming(targetId);
    }
  };

  regenerateFromAssistant = async (index: number) => {
    if (this.state.streaming) return;
    const history = this.getActive();
    const msg = history?.messages[index];
    if (!history || !msg || msg.role !== "assistant") return;
    const removed = history.messages.slice(index + 1);
    removed.forEach((item) => {
      if (item.attachments) this.revokeAttachments(item.attachments);
    });

    this.setState((prev) => {
      const active = this.getActive(prev);
      if (!active) return prev;
      if (index < 0 || index >= active.messages.length) return prev;
      if (active.messages[index].role !== "assistant") return prev;
      const messages = active.messages.slice(0, index + 1).map((m, i) =>
        i === index ? { ...m, content: "", ts: Date.now() } : m
      );
      const histories = prev.histories.map((h) =>
        h.id === active.id ? { ...h, messages, updatedAt: Date.now() } : h
      );
      this.saveHistories(histories);
      return {
        ...prev,
        histories,
        editingIndex: null,
        editDraft: "",
        streaming: true,
        streamingId: active.id,
        statusText: this.t("statusStreaming"),
      };
    });

    const active = this.getActive();
    if (!active) return;
    const targetId = active.id;
    const token = this.beginStreaming(targetId);

    try {
      const { prompt, modalities } = await this.buildChatPrompt(active);
      const cancelled = await this.streamAssistant(prompt, targetId, token, modalities);
      if (cancelled) return;
    } catch (err) {
      if (!token.cancelled) this.failAssistant(err, targetId);
    } finally {
      this.finishStreaming(targetId);
    }
  };

  regenerateFromUser = async (index: number) => {
    if (this.state.streaming) return;
    const history = this.getActive();
    const msg = history?.messages[index];
    if (!history || !msg || msg.role !== "user") return;
    const removed = history.messages.slice(index + 1);
    removed.forEach((item) => {
      if (item.attachments) this.revokeAttachments(item.attachments);
    });

    this.setState((prev) => {
      const active = this.getActive(prev);
      if (!active) return prev;
      if (index < 0 || index >= active.messages.length) return prev;
      if (active.messages[index].role !== "user") return prev;
      const nextMessages = active.messages.slice(0, index + 1);
      nextMessages.push({ role: "assistant", content: "", ts: Date.now() });
      const histories = prev.histories.map((h) =>
        h.id === active.id ? { ...h, messages: nextMessages, updatedAt: Date.now() } : h
      );
      this.saveHistories(histories);
      return {
        ...prev,
        histories,
        editingIndex: null,
        editDraft: "",
        streaming: true,
        streamingId: active.id,
        statusText: this.t("statusStreaming"),
      };
    });

    const active = this.getActive();
    if (!active) return;
    const targetId = active.id;
    const token = this.beginStreaming(targetId);

    try {
      const { prompt, modalities } = await this.buildChatPrompt(active);
      const cancelled = await this.streamAssistant(prompt, targetId, token, modalities);
      if (cancelled) return;
    } catch (err) {
      if (!token.cancelled) this.failAssistant(err, targetId);
    } finally {
      this.finishStreaming(targetId);
    }
  };

  sendMessage = async (text: string) => {
    if (this.state.streaming) return;
    const trimmed = text.trim();
    if (!trimmed && this.state.composerAttachments.length === 0) return;

    this.setState((prev) => {
      let active = this.getActive(prev);
      let histories = prev.histories;
      if (!active) {
        active = this.createHistory(prev.currentLang);
        histories = [active, ...prev.histories];
      }
      const attachments = prev.composerAttachments;
      const messages: Message[] = [
        ...active.messages,
        {
          role: "user",
          content: trimmed,
          ts: Date.now(),
          attachments: attachments.length > 0 ? attachments : undefined,
        },
        { role: "assistant", content: "", ts: Date.now() },
      ];
      const nextHistories = histories.map((h) =>
        h.id === active.id ? { ...h, messages, updatedAt: Date.now() } : h
      );
      this.saveHistories(nextHistories);
      return {
        ...prev,
        histories: nextHistories,
        activeId: active.id,
        streaming: true,
        streamingId: active.id,
        statusText: this.t("statusStreaming"),
        composerAttachments: [],
      };
    });

    const active = this.getActive();
    if (!active) return;
    const targetId = active.id;
    const token = this.beginStreaming(targetId);

    let cancelled = false;
    try {
      const { prompt, modalities } = await this.buildChatPrompt(active);
      cancelled = await this.streamAssistant(prompt, targetId, token, modalities);
      if (cancelled) return;
    } catch (err) {
      if (!token.cancelled) this.failAssistant(err, targetId);
    } finally {
      this.finishStreaming(targetId);
      if (!cancelled) await this.maybeAutoTitle();
    }
  };

  private getActive = (state: State = this.state) =>
    state.histories.find((h) => h.id === state.activeId) || null;

  private formatAttachmentLabel = (attachment: Attachment) =>
    `Attachment (${attachment.kind}): ${attachment.name} (${this.formatBytes(attachment.size)})`;

  private formatTextAttachment = (attachment: Attachment) => {
    const preview = (attachment.text || "").trim();
    const limited = this.limitText(preview, MAX_PROMPT_TEXT_CHARS);
    if (limited.text) {
      const suffix = attachment.textTruncated || limited.truncated ? "\n[truncated]" : "";
      return `${this.formatAttachmentLabel(attachment)}\n${limited.text}${suffix}`;
    }
    return this.formatAttachmentLabel(attachment);
  };

  private async loadAttachmentBlob(attachment: Attachment) {
    const source = attachment.dataUrl || attachment.transientUrl;
    if (!source) return null;
    try {
      const response = await fetch(source);
      if (!response.ok) return null;
      return await response.blob();
    } catch {
      return null;
    }
  }

  private async buildAttachmentParts(
    attachment: Attachment
  ): Promise<LanguageModelMessageContent[]> {
    if (attachment.kind === "text") {
      return [{ type: "text", value: this.formatTextAttachment(attachment) }];
    }
    if (attachment.kind === "audio") {
      const label = this.formatAttachmentLabel(attachment);
      const blob = await this.loadAttachmentBlob(attachment);
      if (!blob) {
        return [{ type: "text", value: `${label}\n[preview unavailable]` }];
      }
      const buffer = await blob.arrayBuffer();
      return [
        { type: "text", value: label },
        { type: "audio", value: buffer },
      ];
    }
    const label = this.formatAttachmentLabel(attachment);
    const blob = await this.loadAttachmentBlob(attachment);
    if (!blob) {
      return [{ type: "text", value: `${label}\n[preview unavailable]` }];
    }
    return [
      { type: "text", value: label },
      { type: "image", value: blob },
    ];
  }

  private async buildPromptMessages(history: History): Promise<LanguageModelMessage[]> {
    const messages: LanguageModelMessage[] = [];
    for (const message of history.messages) {
      const parts: LanguageModelMessageContent[] = [];
      const content = message.content?.trim();
      if (content) parts.push({ type: "text", value: content });
      if (message.attachments?.length) {
        for (const attachment of message.attachments) {
          const attachmentParts = await this.buildAttachmentParts(attachment);
          parts.push(...attachmentParts);
        }
      }
      if (parts.length > 0) {
        messages.push({ role: message.role, content: parts });
      }
    }
    return messages;
  }

  private collectModalities(history: History) {
    const modalities = new Set<LanguageModelMessageType>(["text"]);
    for (const message of history.messages) {
      for (const attachment of message.attachments ?? []) {
        if (attachment.kind === "image") {
          modalities.add("image");
        }
        if (attachment.kind === "audio") {
          modalities.add("audio");
        }
      }
    }
    return modalities;
  }

  private async buildChatPrompt(history: History) {
    const prompt = await this.buildPromptMessages(history);
    return { prompt, modalities: this.collectModalities(history) };
  }

  private buildSystemPrompt = () => {
    const template = this.state.settings.systemPrompt || "";
    return this.applyTemplate(template, {
      date: this.templateDate(),
      language: this.state.currentLang,
    })
      .trim();
  };

  private getPromptApiMaybe() {
    const w = window as Window & {
      ai?: { languageModel?: Pick<typeof LanguageModel, "availability" | "create"> };
    };
    if (w.ai?.languageModel) return w.ai.languageModel;
    if (typeof LanguageModel === "undefined") return null;
    return LanguageModel;
  }

  private getPromptApi() {
    const lm = this.getPromptApiMaybe();
    if (!lm) throw new Error("未检测到 Chrome Prompt API");
    return lm;
  }

  private scheduleAvailabilityCheck() {
    if (this.availabilityTimer) window.clearTimeout(this.availabilityTimer);
    this.availabilityTimer = window.setTimeout(() => void this.checkAvailability(), 1000);
  }

  private async checkAvailability() {
    if (!this.isChromeOnly()) {
      if (this.availabilityTimer) window.clearTimeout(this.availabilityTimer);
      this.availabilityTimer = null;
      this.setApiAvailability("chromeOnly");
      this.availabilityInFlight = false;
      return;
    }

    const lm = this.getPromptApiMaybe();
    if (!lm) {
      if (this.availabilityTimer) window.clearTimeout(this.availabilityTimer);
      this.availabilityTimer = null;
      this.setApiAvailability("needFlag");
      this.availabilityInFlight = false;
      return;
    }

    if (typeof lm.availability !== "function") {
      if (this.availabilityTimer) window.clearTimeout(this.availabilityTimer);
      this.availabilityTimer = null;
      this.setApiAvailability("ready");
      this.availabilityInFlight = false;
      return;
    }

    let availability: Availability;
    try {
      const expected = this.buildExpectedOptions(this.textOnlyModalities());
      availability = await lm.availability(expected);
    } catch {
      if (this.availabilityTimer) window.clearTimeout(this.availabilityTimer);
      this.availabilityTimer = null;
      this.setApiAvailability("needFlag");
      this.availabilityInFlight = false;
      return;
    }

    if (availability === "downloading") {
      this.setApiAvailability("downloading");
      this.scheduleAvailabilityCheck();
      return;
    }

    if (availability === "downloadable") {
      if (this.availabilityTimer) window.clearTimeout(this.availabilityTimer);
      this.availabilityTimer = null;
      this.setApiAvailability("downloadable");
      this.availabilityInFlight = false;
      return;
    }

    if (availability === "available") {
      if (this.availabilityTimer) window.clearTimeout(this.availabilityTimer);
      this.availabilityTimer = null;
      this.setApiAvailability("ready");
      this.availabilityInFlight = false;
      return;
    }

    if (availability === "unavailable") {
      if (this.availabilityTimer) window.clearTimeout(this.availabilityTimer);
      this.availabilityTimer = null;
      this.setApiAvailability("needFlag");
      this.availabilityInFlight = false;
      return;
    }

    if (this.availabilityTimer) window.clearTimeout(this.availabilityTimer);
    this.availabilityTimer = null;
    this.setApiAvailability("needFlag");
    this.availabilityInFlight = false;
  }

  private async createSession(modalities: Set<LanguageModelMessageType>) {
    const lm = this.getPromptApi();
    const expected = this.buildExpectedOptions(modalities);
    const availability =
      typeof lm.availability === "function" ? await lm.availability(expected) : "available";
    if (availability === "unavailable") throw new Error("Prompt API 不可用");
    const systemPrompt = this.buildSystemPrompt();
    const initialPrompts: [LanguageModelSystemMessage] | undefined = systemPrompt
      ? [{ role: "system", content: systemPrompt }]
      : undefined;
    return lm.create({
      temperature: 0.7,
      topK: 40,
      initialPrompts,
      ...expected,
    });
  }

  private readPromptContext(session: LanguageModel) {
    const legacySession = session as LanguageModel & {
      inputUsage?: number;
      inputQuota?: number;
    };
    // with old API compat
    const contextUsage =
      typeof session.contextUsage === "number" && Number.isFinite(session.contextUsage)
        ? session.contextUsage
        : typeof legacySession.inputUsage === "number" && Number.isFinite(legacySession.inputUsage)
          ? legacySession.inputUsage
        : null;
    const contextWindow =
      typeof session.contextWindow === "number" && Number.isFinite(session.contextWindow)
        ? session.contextWindow
        : typeof legacySession.inputQuota === "number" && Number.isFinite(legacySession.inputQuota)
          ? legacySession.inputQuota
        : null;
    return { contextUsage, contextWindow };
  }

  private syncActiveSessionContext(historyId: string | null = this.state.activeId) {
    if (!historyId) {
      this.setPromptContextState(null, null);
      return;
    }
    const entry = this.chatSessions.get(historyId);
    if (!entry) {
      this.setPromptContextState(null, null);
      return;
    }
    const { contextUsage, contextWindow } = this.readPromptContext(entry.session);
    this.setPromptContextState(contextUsage, contextWindow);
  }

  private updateActiveSessionContext(historyId: string, session: LanguageModel) {
    if (this.state.activeId !== historyId) return;
    const { contextUsage, contextWindow } = this.readPromptContext(session);
    this.setPromptContextState(contextUsage, contextWindow);
  }

  private destroySession(session: LanguageModel) {
    try {
      session.destroy();
    } catch {
      // ignore cleanup failures from the browser API
    }
  }

  private deleteChatSession(historyId: string) {
    const entry = this.chatSessions.get(historyId);
    if (!entry) return;
    this.chatSessions.delete(historyId);
    this.destroySession(entry.session);
    if (this.state.activeId === historyId) {
      this.setPromptContextState(null, null);
    }
  }

  private clearChatSessions() {
    if (this.chatSessions.size === 0) {
      this.setPromptContextState(null, null);
      return;
    }
    for (const { session } of this.chatSessions.values()) {
      this.destroySession(session);
    }
    this.chatSessions.clear();
    this.setPromptContextState(null, null);
  }

  private hasModalities = (
    owned: Set<LanguageModelMessageType>,
    needed: Set<LanguageModelMessageType>
  ) => {
    for (const modality of needed) {
      if (!owned.has(modality)) return false;
    }
    return true;
  };

  private async getChatSession(historyId: string, modalities: Set<LanguageModelMessageType>) {
    const existing = this.chatSessions.get(historyId);
    if (existing && this.hasModalities(existing.modalities, modalities)) {
      this.chatSessions.delete(historyId);
      this.chatSessions.set(historyId, existing);
      this.updateActiveSessionContext(historyId, existing.session);
      return existing.session;
    }
    const session = await this.createSession(modalities);
    this.chatSessions.set(historyId, { session, modalities: new Set(modalities) });
    if (existing) {
      this.destroySession(existing.session);
    }
    this.updateActiveSessionContext(historyId, session);
    if (this.chatSessions.size > this.maxChatSessions) {
      const oldestKey = this.chatSessions.keys().next().value;
      if (oldestKey) this.deleteChatSession(oldestKey);
    }
    return session;
  }

  stopStreaming = () => {
    const activeId = this.state.streamingId;
    if (!activeId) return;
    this.cancelStream(activeId);
  };

  private beginStreaming = (historyId: string) => {
    const token = { historyId, cancelled: false };
    this.streamToken = token;
    return token;
  };

  private cancelStream = (historyId: string) => {
    if (this.streamToken && this.streamToken.historyId === historyId) {
      this.streamToken.cancelled = true;
    }
    this.streamToken = null;
    this.deleteChatSession(historyId);
    this.setState((prev) => {
      if (prev.streamingId !== historyId) return prev;
      return { ...prev, streaming: false, streamingId: null, statusText: "" };
    });
  };

  private async readPromptStream(
    stream: ReadableStream<string>,
    onChunk: (chunk: string) => void,
    token?: { cancelled: boolean }
  ) {
    const reader = stream.getReader();
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (token?.cancelled) {
          await reader.cancel();
          break;
        }
        if (typeof value === "string") onChunk(value);
      }
    } finally {
      reader.releaseLock();
    }
  }

  private async streamAssistant(
    prompt: LanguageModelPrompt,
    historyId: string,
    token: { historyId: string; cancelled: boolean },
    modalities: Set<LanguageModelMessageType>
  ) {
    if (token.cancelled) return true;
    const session = await this.getChatSession(historyId, modalities);
    if (token.cancelled) return true;
    this.updateActiveSessionContext(historyId, session);
    try {
      if (session.promptStreaming) {
        let output = "";
        const stream = session.promptStreaming(prompt);
        await this.readPromptStream(
          stream,
          (chunk) => {
            if (token.cancelled) return;
            output += chunk;
            if (token.cancelled) return;
            this.updateLastAssistant(output, historyId);
          },
          token
        );
        return token.cancelled;
      }

      const output = await session.prompt(prompt);
      if (token.cancelled) return true;
      this.updateLastAssistant(output, historyId);
      return false;
    } finally {
      this.updateActiveSessionContext(historyId, session);
    }
  }

  private updateLastAssistant(content: string, historyId: string) {
    this.setState((prev) => {
      const history = prev.histories.find((h) => h.id === historyId);
      if (!history) return prev;
      const messages = [...history.messages];
      const lastIndex = messages.length - 1;
      if (lastIndex < 0 || messages[lastIndex].role !== "assistant") return prev;
      messages[lastIndex] = { ...messages[lastIndex], content };
      const histories = prev.histories.map((h) =>
        h.id === historyId ? { ...h, messages, updatedAt: Date.now() } : h
      );
      this.saveHistories(histories);
      return { ...prev, histories };
    });
  }

  private failAssistant(err: unknown, historyId: string) {
    const message = err instanceof Error ? err.message : String(err);
    this.updateLastAssistant(`${this.t("statusError")}${message}`, historyId);
  }

  private finishStreaming(historyId: string) {
    if (this.streamToken?.historyId === historyId) {
      this.streamToken = null;
    }
    this.setState((prev) => {
      if (prev.streamingId !== historyId) return prev;
      return { ...prev, streaming: false, streamingId: null, statusText: "" };
    });
  }

  private async maybeAutoTitle() {
    const history = this.getActive();
    if (!history || history.autoTitleDone) return;
    if (!this.state.settings.titleTemplate.trim()) return;

    const firstUser = history.messages.find((m) => m.role === "user" && m.content.trim());
    const firstAssistant = history.messages.find(
      (m) => m.role === "assistant" && m.content.trim()
    );
    if (!firstUser || !firstAssistant) return;
    if (history.name !== this.t("defaultTitle")) {
      this.markAutoTitleDone(history.id);
      return;
    }

    let session: LanguageModel | null = null;
    try {
      session = await this.createSession(this.textOnlyModalities());
      const prompt = this.applyTemplate(this.state.settings.titleTemplate, {
        date: this.templateDate(),
        language: this.state.currentLang,
        user: firstUser.content,
        assistant: firstAssistant.content,
      });

      if (session.promptStreaming) {
        let output = "";
        const stream = session.promptStreaming(prompt);
        await this.readPromptStream(stream, (chunk) => {
          output += chunk;
          const clean = output.replace(/[\r\n]+/g, " ").trim().slice(0, 24);
          if (clean) this.updateHistoryTitle(history.id, clean, true);
        });
      } else {
        const title = await session.prompt(prompt);
        const clean = title.replace(/[\r\n]+/g, " ").trim().slice(0, 24);
        if (clean) this.updateHistoryTitle(history.id, clean, false);
      }
    } catch {
      // ignore auto-title failures
    } finally {
      if (session) this.destroySession(session);
      this.markAutoTitleDone(history.id);
    }
  }

  private updateHistoryTitle(id: string, name: string, notify: boolean) {
    this.setState((prev) => {
      const histories = prev.histories.map((h) =>
        h.id === id ? { ...h, name, updatedAt: Date.now() } : h
      );
      this.saveHistories(histories);
      return notify ? { ...prev, histories } : { ...prev, histories };
    });
  }

  private markAutoTitleDone(id: string) {
    this.setState((prev) => {
      const histories = prev.histories.map((h) =>
        h.id === id ? { ...h, autoTitleDone: true } : h
      );
      this.saveHistories(histories);
      return { ...prev, histories };
    });
  }
}

export const chatViewModel = new ChatViewModel();
