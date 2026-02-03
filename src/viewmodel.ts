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
    defaultTitle: "新对话",
    rename: "重命名",
    delete: "删除",
    send: "发送",
    stop: "停止",
    uploadFile: "上传文件",
    attachPhoto: "拍照",
    attachVideo: "拍视频",
    attachments: "附件",
    remove: "移除",
    attachmentPreviewUnavailable: "预览不可用",
    attachmentTemp: "预览仅当前会话可用",
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
    locale: "zh-CN",
  },
  "en-US": {
    appTitle: "Local Model Chat (Chrome Prompt API)",
    brandTitle: "Local Model Chat",
    brandSub: "Chrome Prompt API",
    language: "Language",
    newChat: "New Chat",
    defaultTitle: "New Chat",
    rename: "Rename",
    delete: "Delete",
    send: "Send",
    stop: "Stop",
    uploadFile: "Upload",
    attachPhoto: "Photo",
    attachVideo: "Video",
    attachments: "Attachments",
    remove: "Remove",
    attachmentPreviewUnavailable: "Preview unavailable",
    attachmentTemp: "Preview available this session only",
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
    locale: "en-US",
  },
} as const;

type Role = "user" | "assistant";
type SendShortcut = "ctrlEnter" | "shiftEnter" | "enter";
export type ThemeMode = "system" | "light" | "dark";

export type AttachmentKind = "text" | "image" | "video";

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
  settings: Settings;
  currentLang: keyof typeof I18N;
  renameTargetId: string | null;
  renameDraft: string;
  renameSource: RenameSource;
  composerAttachments: Attachment[];
};

type Listener = () => void;

type PromptTextPart = { type: "text"; value: string };
type PromptImagePart = { type: "image"; value: Blob };
type PromptAudioPart = { type: "audio"; value: Blob };
type PromptPart = PromptTextPart | PromptImagePart | PromptAudioPart;
type PromptMessage = { role: Role; content: PromptPart[] };
type PromptInput = string | PromptMessage[];

type InitialPrompt = { role: "system"; content: string };
type ExpectedText = { type: "text"; languages?: string[] };
type ExpectedInput = ExpectedText | { type: "image" } | { type: "audio" };
type ExpectedOutput = ExpectedText;

type PromptSession = {
  prompt: (input: PromptInput) => Promise<string>;
  promptStreaming?: (input: PromptInput) => AsyncIterable<string>;
};

type PromptCreateOptions = {
  temperature: number;
  topK: number;
  initialPrompts?: InitialPrompt[];
  expectedInputs?: ExpectedInput[];
  expectedOutputs?: ExpectedOutput[];
  monitor?: (monitor: EventTarget) => void;
};

type PromptAPI = {
  availability?: (options?: Pick<PromptCreateOptions, "expectedInputs" | "expectedOutputs">) => Promise<
    "no" | "available" | "downloadable" | "downloading"
  >;
  create: (options: PromptCreateOptions) => Promise<PromptSession>;
};


type ApiAvailability =
  | "unknown"
  | "chromeOnly"
  | "needFlag"
  | "downloadable"
  | "downloading"
  | "ready";

type PromptModality = "text" | "image" | "audio";
type PromptSessionInfo = { session: PromptSession; modalities: Set<PromptModality> };

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
  private chatSessions = new Map<string, PromptSessionInfo>();
  private readonly maxChatSessions = 8;
  private availabilityTimer: number | null = null;
  private availabilityInFlight = false;
  private downloadInFlight = false;
  private streamToken: { historyId: string; cancelled: boolean } | null = null;
  private state: State;

  constructor() {
    const currentLang = this.initLanguage();
    const settings = this.loadSettings(currentLang);
    const histories = this.loadHistories();
    const activeId = histories[0]?.id ?? null;

    this.state = {
      histories: histories.length > 0 ? histories : [this.createHistory(currentLang)],
      activeId: histories.length > 0 ? activeId : null,
      streaming: false,
      streamingId: null,
      editingIndex: null,
      editDraft: "",
      statusText: "",
      apiStatusText: "",
      apiAvailability: "unknown",
      downloadProgress: null,
      settings,
      currentLang,
      renameTargetId: null,
      renameDraft: "",
      renameSource: null,
      composerAttachments: [],
    };

    if (this.state.histories.length === 1 && !activeId) {
      this.state.activeId = this.state.histories[0].id;
    }
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

    try {
      await this.createSession(this.textOnlyModalities());
      this.setApiAvailability("ready");
      this.availabilityInFlight = false;
    } catch {
      await this.checkAvailability();
      if (this.state.apiAvailability !== "downloading") {
        this.availabilityInFlight = false;
      }
    }
  };

  startDownloadPromptApi = async () => {
    if (this.downloadInFlight) return;
    this.downloadInFlight = true;
    this.setApiAvailability("downloading");
    this.setState((prev) => ({ ...prev, downloadProgress: 0 }));

    try {
      const lm = this.getPromptApi();
      const expected = this.buildExpectedOptions(this.textOnlyModalities());
      await lm.create({
        temperature: 0.7,
        topK: 40,
        ...expected,
        monitor: (monitor) => {
          monitor.addEventListener?.("downloadprogress", (event) => {
            const loaded = (event as { loaded?: number }).loaded;
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

  private buildExpectedInputs = (modalities: Set<PromptModality>): ExpectedInput[] => {
    const languages = this.getPromptLanguages();
    const inputs: ExpectedInput[] = [
      languages ? { type: "text", languages } : { type: "text" },
    ];
    if (modalities.has("image")) inputs.push({ type: "image" });
    if (modalities.has("audio")) inputs.push({ type: "audio" });
    return inputs;
  };

  private buildExpectedOutputs = (): ExpectedOutput[] => {
    const languages = this.getPromptLanguages();
    return [languages ? { type: "text", languages } : { type: "text" }];
  };

  private buildExpectedOptions = (modalities: Set<PromptModality>) => ({
    expectedInputs: this.buildExpectedInputs(modalities),
    expectedOutputs: this.buildExpectedOutputs(),
  });

  private textOnlyModalities = () => new Set<PromptModality>(["text"]);

  private templateDate = () => this.formatDate(Date.now());

  private applyTemplate = (template: string, vars: Record<string, string>) =>
    Object.keys(vars).reduce((acc, key) => {
      return acc.replaceAll(`{${key}}`, vars[key] ?? "");
    }, template || "");

  private defaultSettings = (lang: keyof typeof I18N): Settings => ({
    sendShortcut: "ctrlEnter",
    theme: "system",
    systemPrompt: "",
    titleTemplate: TITLE_PROMPT,
    sidebarWidth: SIDEBAR_WIDTH_DEFAULT,
  });

  getTitlePrompt = () => TITLE_PROMPT;

  private loadSettings(lang: keyof typeof I18N) {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return this.defaultSettings(lang);
    try {
      const parsed = JSON.parse(raw) as Partial<Settings & { chatTemplate?: string }>;
      const next = {
        ...this.defaultSettings(lang),
        ...parsed,
        systemPrompt: parsed.systemPrompt ?? parsed.chatTemplate ?? "",
      };
      return this.sanitizeSettings(next);
    } catch {
      return this.defaultSettings(lang);
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
        ...this.defaultSettings(this.state.currentLang),
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
        attachments: message.attachments?.map((attachment) => {
          const { transientUrl, ...rest } = attachment;
          return rest;
        }),
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
    this.chatSessions.clear();
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
      };
    });
  };

  setActive = (id: string) => {
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
    }));
  };

  deleteActive = () => {
    const activeId = this.state.activeId;
    if (activeId) {
      if (this.state.streamingId === activeId) {
        this.cancelStream(activeId);
      }
      this.chatSessions.delete(activeId);
    }
    const activeHistory = this.getActive();
    if (activeHistory) {
      this.revokeAttachments(
        activeHistory.messages.flatMap((message) => message.attachments ?? [])
      );
    }
    this.revokeAttachments(this.state.composerAttachments);
    this.setState((prev) => {
      if (!prev.activeId) return prev;
      let histories = prev.histories.filter((h) => h.id !== prev.activeId);
      let activeId = histories[0]?.id ?? null;
      if (!activeId) {
        const next = this.createHistory(prev.currentLang);
        histories = [next];
        activeId = next.id;
      }
      this.saveHistories(histories);
      return { ...prev, histories, activeId, composerAttachments: [] };
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
    this.setState((prev) => {
      if (prev.settings.systemPrompt !== sanitized.systemPrompt) {
        this.chatSessions.clear();
      }
      return { ...prev, settings: sanitized };
    });
  };

  updateSettingsField = (patch: Partial<Settings>) => {
    this.setState((prev) => {
      const next = this.sanitizeSettings({ ...prev.settings, ...patch });
      this.persistSettings(next);
      if (prev.settings.systemPrompt !== next.systemPrompt) {
        this.chatSessions.clear();
      }
      return { ...prev, settings: next };
    });
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
    if (type.startsWith("video/")) return "video";
    const name = file.name.toLowerCase();
    if (/\.(txt|md|csv|json|yaml|yml|log)$/.test(name)) return "text";
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
      composerAttachments: prev.composerAttachments.filter((item) => item.id !== id),
    }));
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
      return { ...prev, histories };
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

  private async buildAttachmentParts(attachment: Attachment): Promise<PromptPart[]> {
    if (attachment.kind === "text") {
      return [{ type: "text", value: this.formatTextAttachment(attachment) }];
    }
    if (attachment.kind === "video") {
      return [{ type: "text", value: this.formatAttachmentLabel(attachment) }];
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

  private async buildPromptMessages(history: History): Promise<PromptMessage[]> {
    const messages: PromptMessage[] = [];
    for (const message of history.messages) {
      const parts: PromptPart[] = [];
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
    const modalities = new Set<PromptModality>(["text"]);
    for (const message of history.messages) {
      for (const attachment of message.attachments ?? []) {
        if (attachment.kind === "image") {
          modalities.add("image");
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
      .replaceAll("{history}", "")
      .trim();
  };

  private getPromptApiMaybe() {
    return (
      (window as unknown as { ai?: { languageModel?: PromptAPI } }).ai?.languageModel ||
      (window as unknown as { LanguageModel?: PromptAPI }).LanguageModel ||
      null
    );
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

    let availability: string;
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

    if (this.availabilityTimer) window.clearTimeout(this.availabilityTimer);
    this.availabilityTimer = null;
    this.setApiAvailability("needFlag");
    this.availabilityInFlight = false;
  }

  private async createSession(modalities: Set<PromptModality>) {
    const lm = this.getPromptApi();
    const expected = this.buildExpectedOptions(modalities);
    const availability =
      typeof lm.availability === "function" ? await lm.availability(expected) : "available";
    if (availability === "no") throw new Error("Prompt API 不可用");
    const systemPrompt = this.buildSystemPrompt();
    const initialPrompts = systemPrompt ? [{ role: "system", content: systemPrompt }] : undefined;
    return lm.create({
      temperature: 0.7,
      topK: 40,
      initialPrompts,
      ...expected,
    });
  }

  private hasModalities = (owned: Set<PromptModality>, needed: Set<PromptModality>) => {
    for (const modality of needed) {
      if (!owned.has(modality)) return false;
    }
    return true;
  };

  private async getChatSession(historyId: string, modalities: Set<PromptModality>) {
    const existing = this.chatSessions.get(historyId);
    if (existing && this.hasModalities(existing.modalities, modalities)) {
      this.chatSessions.delete(historyId);
      this.chatSessions.set(historyId, existing);
      return existing.session;
    }
    const session = await this.createSession(modalities);
    this.chatSessions.set(historyId, { session, modalities: new Set(modalities) });
    if (this.chatSessions.size > this.maxChatSessions) {
      const oldestKey = this.chatSessions.keys().next().value as string | undefined;
      if (oldestKey) this.chatSessions.delete(oldestKey);
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
    this.chatSessions.delete(historyId);
    this.setState((prev) => {
      if (prev.streamingId !== historyId) return prev;
      return { ...prev, streaming: false, streamingId: null, statusText: "" };
    });
  };

  private async streamAssistant(
    prompt: PromptInput,
    historyId: string,
    token: { historyId: string; cancelled: boolean },
    modalities: Set<PromptModality>
  ) {
    if (token.cancelled) return true;
    const session = await this.getChatSession(historyId, modalities);
    if (token.cancelled) return true;
    if (session.promptStreaming) {
      let output = "";
      for await (const chunk of session.promptStreaming(prompt)) {
        if (token.cancelled) break;
        output += chunk;
        if (token.cancelled) break;
        this.updateLastAssistant(output, historyId);
      }
      return token.cancelled;
    } else {
      const output = await session.prompt(prompt);
      if (token.cancelled) return true;
      this.updateLastAssistant(output, historyId);
      return false;
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

    try {
      const session = await this.createSession(this.textOnlyModalities());
      const prompt = this.applyTemplate(this.state.settings.titleTemplate, {
        date: this.templateDate(),
        language: this.state.currentLang,
        user: firstUser.content,
        assistant: firstAssistant.content,
      });

      if (session.promptStreaming) {
        let output = "";
        for await (const chunk of session.promptStreaming(prompt)) {
          output += chunk;
          const clean = output.replace(/[\r\n]+/g, " ").trim().slice(0, 24);
          if (clean) this.updateHistoryTitle(history.id, clean, true);
        }
      } else {
        const title = await session.prompt(prompt);
        const clean = title.replace(/[\r\n]+/g, " ").trim().slice(0, 24);
        if (clean) this.updateHistoryTitle(history.id, clean, false);
      }
    } catch {
      // ignore auto-title failures
    } finally {
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
