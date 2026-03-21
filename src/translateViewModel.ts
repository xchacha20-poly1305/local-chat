const LANG_KEY = "local-chat-language";
const TRANSLATE_DEBOUNCE_MS = 500;
const MAX_TRANSLATORS = 4;

export const TranslateI18N = {
  "zh-CN": {
    title: "本地翻译",
    subtitle: "Chrome Translation API",
    backToChat: "返回聊天",
    language: "语言",
    sourceLanguage: "源语言",
    targetLanguage: "目标语言",
    autoDetect: "自动检测",
    swap: "互换",
    inputPlaceholder: "输入文本后自动翻译",
    outputPlaceholder: "翻译结果",
    copy: "复制结果",
    copied: "已复制",
    copyFailed: "复制失败",
    clearInput: "清空",
    statusTranslating: "翻译中...",
    statusDetecting: "检测语言...",
    statusError: "发生错误：",
    detectedLanguage: "检测到",
    apiChromeOnly: "仅支持 Chrome 浏览器，请使用 Chrome 运行此应用。",
    apiUnavailable: "Translation API 不可用，请检查 Chrome 设置。",
    apiDownloadable: "Translation API 可下载，请等待组件下载完成。",
    apiDownloading: "Translation API 正在下载中...",
    apiDownloadProgress: "下载进度",
    apiDownloadNow: "立即下载",
    apiForceUse: "强制使用",
    detectorUnavailable: "语言检测不可用，请手动选择源语言。",
    languageSearchPlaceholder: "搜索语言或输入代码",
    noResults: "没有匹配语言",
    locale: "zh-CN",
  },
  "en-US": {
    title: "Local Translation",
    subtitle: "Chrome Translation API",
    backToChat: "Back to Chat",
    language: "Language",
    sourceLanguage: "Source",
    targetLanguage: "Target",
    autoDetect: "Auto Detect",
    swap: "Swap",
    inputPlaceholder: "Type text to translate automatically",
    outputPlaceholder: "Translation output",
    copy: "Copy output",
    copied: "Copied",
    copyFailed: "Copy failed",
    clearInput: "Clear",
    statusTranslating: "Translating...",
    statusDetecting: "Detecting language...",
    statusError: "Error: ",
    detectedLanguage: "Detected",
    apiChromeOnly: "This app only supports Chrome. Please use Chrome.",
    apiUnavailable: "Translation API unavailable. Check Chrome settings.",
    apiDownloadable: "Translation API is downloadable. Please wait for download.",
    apiDownloading: "Translation API is downloading...",
    apiDownloadProgress: "Download progress",
    apiDownloadNow: "Download now",
    apiForceUse: "Force use",
    detectorUnavailable: "Language detection unavailable. Select a source language.",
    languageSearchPlaceholder: "Search languages or enter code",
    noResults: "No matching languages",
    locale: "en-US",
  },
} as const;

const hasTranslateLang = (value: string): value is TranslateLang =>
  Object.hasOwn(TranslateI18N, value);

export type TranslateLang = keyof typeof TranslateI18N;

export type LanguageOption = {
  code: string;
  labels: Record<TranslateLang, string>;
};

const AUTO_OPTION: LanguageOption = {
  code: "auto",
  labels: {
    "zh-CN": "自动检测",
    "en-US": "Auto Detect",
  },
};

const BASE_LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: "en",
    labels: { "zh-CN": "英语", "en-US": "English" },
  },
  {
    code: "zh-Hans",
    labels: { "zh-CN": "简体中文", "en-US": "Chinese (Simplified)" },
  },
  {
    code: "zh-Hant",
    labels: { "zh-CN": "繁体中文", "en-US": "Chinese (Traditional)" },
  },
  {
    code: "ja",
    labels: { "zh-CN": "日语", "en-US": "Japanese" },
  },
  {
    code: "ko",
    labels: { "zh-CN": "韩语", "en-US": "Korean" },
  },
  {
    code: "fr",
    labels: { "zh-CN": "法语", "en-US": "French" },
  },
  {
    code: "de",
    labels: { "zh-CN": "德语", "en-US": "German" },
  },
  {
    code: "es",
    labels: { "zh-CN": "西班牙语", "en-US": "Spanish" },
  },
  {
    code: "it",
    labels: { "zh-CN": "意大利语", "en-US": "Italian" },
  },
  {
    code: "pt",
    labels: { "zh-CN": "葡萄牙语", "en-US": "Portuguese" },
  },
  {
    code: "ru",
    labels: { "zh-CN": "俄语", "en-US": "Russian" },
  },
  {
    code: "ar",
    labels: { "zh-CN": "阿拉伯语", "en-US": "Arabic" },
  },
  {
    code: "hi",
    labels: { "zh-CN": "印地语", "en-US": "Hindi" },
  },
  {
    code: "id",
    labels: { "zh-CN": "印尼语", "en-US": "Indonesian" },
  },
  {
    code: "vi",
    labels: { "zh-CN": "越南语", "en-US": "Vietnamese" },
  },
  {
    code: "th",
    labels: { "zh-CN": "泰语", "en-US": "Thai" },
  },
  {
    code: "tr",
    labels: { "zh-CN": "土耳其语", "en-US": "Turkish" },
  },
  {
    code: "nl",
    labels: { "zh-CN": "荷兰语", "en-US": "Dutch" },
  },
  {
    code: "pl",
    labels: { "zh-CN": "波兰语", "en-US": "Polish" },
  },
];

const ALL_LANGUAGE_OPTIONS = [AUTO_OPTION, ...BASE_LANGUAGE_OPTIONS];
const LANGUAGE_MAP = new Map(ALL_LANGUAGE_OPTIONS.map((option) => [option.code, option]));

type Listener = () => void;

type ApiAvailability = Availability | "unknown" | "chromeOnly";
type TargetLangMode = "auto" | "manual";

export type TranslateState = {
  inputText: string;
  outputText: string;
  sourceLang: string;
  targetLang: string;
  targetLangMode: TargetLangMode;
  detectedLang: string | null;
  translating: boolean;
  statusText: string;
  apiStatusText: string;
  detectorStatusText: string;
  apiAvailability: ApiAvailability;
  detectorAvailability: ApiAvailability;
  downloadProgress: number | null;
  currentLang: TranslateLang;
};

export class TranslateViewModel {
  private listeners = new Set<Listener>();
  private translatorCache = new Map<string, Translator>();
  private detector: LanguageDetector | null = null;
  private translateTimer: number | null = null;
  private abortController: AbortController | null = null;
  private activeToken: { id: number; cancelled: boolean } | null = null;
  private nextTokenId = 0;
  private availabilityInFlight = false;
  private downloadInFlight = false;
  private state: TranslateState;

  constructor() {
    const currentLang = this.initLanguage();
    const sourceLang = AUTO_OPTION.code;
    const targetLang = this.defaultTargetForLang(currentLang);
    this.state = {
      inputText: "",
      outputText: "",
      sourceLang,
      targetLang,
      targetLangMode: "auto",
      detectedLang: null,
      translating: false,
      statusText: "",
      apiStatusText: "",
      detectorStatusText: "",
      apiAvailability: "unknown",
      detectorAvailability: "unknown",
      downloadProgress: null,
      currentLang,
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

  private setState(updater: (prev: TranslateState) => TranslateState) {
    this.state = updater(this.state);
    this.emit();
  }

  t = (key: keyof (typeof TranslateI18N)["en-US"]) => {
    const { currentLang } = this.state;
    return TranslateI18N[currentLang][key];
  };

  private initLanguage(): TranslateLang {
    const saved = localStorage.getItem(LANG_KEY) as TranslateLang | null;
    if (saved !== null && hasTranslateLang(saved)) return saved;
    const browserLang = navigator.language.toLowerCase();
    const match = (Object.keys(TranslateI18N) as TranslateLang[]).find(
      (key) => key.toLowerCase() === browserLang || key.toLowerCase().startsWith(browserLang)
    );
    return match ?? "en-US";
  }

  setLanguage = (lang: TranslateLang) => {
    const prevState = this.state;
    const nextTarget =
      prevState.targetLangMode === "auto"
        ? this.resolveAutoTargetLang(
            this.getEffectiveSourceLang(prevState, prevState.detectedLang),
            lang
          )
        : prevState.targetLang;
    localStorage.setItem(LANG_KEY, lang);
    this.setState((prev) => ({
      ...prev,
      currentLang: lang,
      targetLang: nextTarget,
      apiStatusText: this.formatApiStatusText(prev.apiAvailability, lang),
      detectorStatusText: this.formatDetectorStatusText(prev.detectorAvailability, lang),
    }));
    if (nextTarget !== prevState.targetLang) {
      void this.checkAvailability();
      this.scheduleTranslate();
    }
  };

  getLanguageOptions = (includeAuto: boolean) =>
    includeAuto ? ALL_LANGUAGE_OPTIONS : BASE_LANGUAGE_OPTIONS;

  formatLanguageLabel = (code: string, lang: TranslateLang = this.state.currentLang) => {
    const option = LANGUAGE_MAP.get(code);
    if (!option) return code;
    return option.labels[lang] || option.labels["en-US"] || code;
  };

  formatLanguageDisplay = (code: string, lang: TranslateLang = this.state.currentLang) => {
    const option = LANGUAGE_MAP.get(code);
    if (!option) return code;
    const label = option.labels[lang] || option.labels["en-US"] || code;
    return `${label} (${option.code})`;
  };

  setSourceLang = (value: string) => {
    if (!value) return;
    const next = value === AUTO_OPTION.code ? AUTO_OPTION.code : value;
    const prevSource = this.state.sourceLang;
    const prevState = this.state;
    this.setState((prev) => ({
      ...prev,
      sourceLang: next,
      targetLang:
        prev.targetLangMode === "auto"
          ? this.resolveAutoTargetLang(
              next === AUTO_OPTION.code ? prev.detectedLang : next,
              prev.currentLang
            )
          : prev.targetLang,
      statusText: "",
      detectedLang: next === AUTO_OPTION.code ? prev.detectedLang : null,
    }));
    if (
      next !== prevSource ||
      (prevState.targetLangMode === "auto" &&
        this.state.targetLang !== prevState.targetLang)
    ) {
      void this.checkAvailability();
      this.scheduleTranslate();
    }
  };

  setTargetLang = (value: string) => {
    if (!value || value === AUTO_OPTION.code) return;
    const prevTarget = this.state.targetLang;
    const prevMode = this.state.targetLangMode;
    this.setState((prev) => ({
      ...prev,
      targetLang: value,
      targetLangMode: "manual",
      statusText: "",
    }));
    if (value !== prevTarget || prevMode !== "manual") {
      void this.checkAvailability();
      this.scheduleTranslate();
    }
  };

  swapLanguages = () => {
    this.setState((prev) => {
      const inferredSource =
        prev.sourceLang === AUTO_OPTION.code ? prev.detectedLang : prev.sourceLang;
      const nextTarget = inferredSource ?? this.defaultTargetForLang(prev.currentLang);
      const nextSource = prev.targetLang;
      return {
        ...prev,
        sourceLang: nextSource,
        targetLang: nextTarget,
        targetLangMode: "manual",
        statusText: "",
        detectedLang: null,
      };
    });
    void this.checkAvailability();
    this.scheduleTranslate();
  };

  setInputText = (value: string) => {
    this.setState((prev) => ({ ...prev, inputText: value, statusText: "" }));
    this.scheduleTranslate();
  };

  clearOutput = () => {
    this.cancelInFlight();
    this.setState((prev) => ({
      ...prev,
      outputText: "",
      targetLang:
        prev.targetLangMode === "auto"
          ? this.resolveAutoTargetLang(this.getEffectiveSourceLang(prev, null), prev.currentLang)
          : prev.targetLang,
      statusText: "",
      translating: false,
      detectedLang: null,
    }));
  };

  clearInput = () => {
    this.cancelInFlight();
    this.setState((prev) => ({
      ...prev,
      inputText: "",
      outputText: "",
      targetLang:
        prev.targetLangMode === "auto"
          ? this.resolveAutoTargetLang(this.getEffectiveSourceLang(prev, null), prev.currentLang)
          : prev.targetLang,
      statusText: "",
      translating: false,
      detectedLang: null,
    }));
  };

  private scheduleTranslate() {
    if (this.translateTimer) window.clearTimeout(this.translateTimer);
    const text = this.state.inputText.trim();
    if (!text) {
      this.clearOutput();
      return;
    }
    this.translateTimer = window.setTimeout(() => {
      void this.translateNow();
    }, TRANSLATE_DEBOUNCE_MS);
  }

  private beginRequest() {
    if (this.activeToken) this.activeToken.cancelled = true;
    const token = { id: (this.nextTokenId += 1), cancelled: false };
    this.activeToken = token;
    return token;
  }

  private isTokenActive(token: { id: number; cancelled: boolean }) {
    return this.activeToken?.id === token.id && !token.cancelled;
  }

  cancelInFlight = () => {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    if (this.activeToken) this.activeToken.cancelled = true;
  };

  startAvailabilityCheck = () => {
    if (this.availabilityInFlight) return;
    this.availabilityInFlight = true;
    void this.checkAvailability();
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

  private setDetectorAvailability(status: ApiAvailability) {
    this.setState((prev) => ({
      ...prev,
      detectorAvailability: status,
      detectorStatusText: this.formatDetectorStatusText(status, prev.currentLang),
    }));
  }

  private formatApiStatusText(status: ApiAvailability, lang: TranslateLang) {
    if (status === "chromeOnly") return TranslateI18N[lang].apiChromeOnly;
    if (status === "downloadable") return TranslateI18N[lang].apiDownloadable;
    if (status === "downloading") return TranslateI18N[lang].apiDownloading;
    if (status === "unavailable") return TranslateI18N[lang].apiUnavailable;
    return "";
  }

  private formatDetectorStatusText(status: ApiAvailability, lang: TranslateLang) {
    if (status === "chromeOnly") return TranslateI18N[lang].apiChromeOnly;
    if (status === "unavailable") return TranslateI18N[lang].detectorUnavailable;
    return "";
  }

  private isChromeOnly = () => {
    const ua = navigator.userAgent || "";
    const isChrome = /Chrome\//.test(ua);
    const isEdge = /Edg\//.test(ua);
    const isOpera = /OPR\//.test(ua);
    return isChrome && !isEdge && !isOpera;
  };

  private getTranslatorApiMaybe() {
    const w = window as Window & {
      ai?: { translator?: typeof Translator };
    };
    if (w.ai?.translator) return w.ai.translator;
    if (typeof Translator === "undefined") return null;
    return Translator;
  }

  private getDetectorApiMaybe() {
    const w = window as Window & {
      ai?: { languageDetector?: typeof LanguageDetector };
    };
    if (w.ai?.languageDetector) return w.ai.languageDetector;
    if (typeof LanguageDetector === "undefined") return null;
    return LanguageDetector;
  }

  private async checkAvailability() {
    if (!this.isChromeOnly()) {
      this.setApiAvailability("chromeOnly");
      this.setDetectorAvailability("chromeOnly");
      this.availabilityInFlight = false;
      return;
    }

    const translatorApi = this.getTranslatorApiMaybe();
    if (!translatorApi) {
      this.setApiAvailability("unavailable");
    } else {
      try {
        const source =
          this.state.sourceLang === AUTO_OPTION.code
            ? this.state.detectedLang ?? "en"
            : this.state.sourceLang;
        const availability = await translatorApi.availability({
          sourceLanguage: source,
          targetLanguage: this.state.targetLang,
        });
        this.setApiAvailability(availability);
      } catch {
        this.setApiAvailability("unavailable");
      }
    }

    const detectorApi = this.getDetectorApiMaybe();
    if (!detectorApi) {
      this.setDetectorAvailability("unavailable");
    } else {
      try {
        const availability = await detectorApi.availability();
        this.setDetectorAvailability(availability);
      } catch {
        this.setDetectorAvailability("unavailable");
      }
    }

    this.availabilityInFlight = false;
  }

  forceUseTranslator = async () => {
    try {
      const translator = await this.createTranslator(
        this.state.sourceLang === AUTO_OPTION.code ? "en" : this.state.sourceLang,
        this.state.targetLang
      );
      translator.destroy();
      this.setApiAvailability("available");
    } catch {
      this.setApiAvailability("unavailable");
    }
  };

  startDownloadTranslator = async () => {
    if (this.downloadInFlight) return;
    this.downloadInFlight = true;
    this.setApiAvailability("downloading");
    this.setState((prev) => ({ ...prev, downloadProgress: 0 }));
    try {
      const translatorApi = this.getTranslatorApiMaybe();
      if (!translatorApi) throw new Error("Translation API unavailable");
      const translator = await translatorApi.create({
        sourceLanguage:
          this.state.sourceLang === AUTO_OPTION.code ? "en" : this.state.sourceLang,
        targetLanguage: this.state.targetLang,
        monitor: (monitor) => {
          monitor.addEventListener("downloadprogress", (event) => {
            const loaded = event.loaded;
            if (typeof loaded !== "number") return;
            const progress = Math.max(0, Math.min(1, loaded));
            this.setState((prev) => ({ ...prev, downloadProgress: progress }));
          });
        },
      });
      translator.destroy();
      this.setApiAvailability("available");
      this.setState((prev) => ({ ...prev, downloadProgress: null }));
    } catch {
      await this.checkAvailability();
      this.setState((prev) => ({ ...prev, downloadProgress: null }));
    } finally {
      this.downloadInFlight = false;
    }
  };

  private async getDetector() {
    if (this.detector) return this.detector;
    const api = this.getDetectorApiMaybe();
    if (!api) throw new Error(this.t("detectorUnavailable"));
    const detector = await api.create();
    this.detector = detector;
    return detector;
  }

  private async detectLanguage(input: string, signal?: AbortSignal) {
    const detector = await this.getDetector();
    const result = await detector.detect(input, { signal });
    if (result.length === 0) return null;
    const sorted = [...result].sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0));
    return sorted[0].detectedLanguage;
  }

  private async createTranslator(source: string, target: string) {
    const api = this.getTranslatorApiMaybe();
    if (!api) throw new Error(this.t("apiUnavailable"));
    return api.create({ sourceLanguage: source, targetLanguage: target });
  }

  private async getTranslator(source: string, target: string) {
    const key = `${source}|${target}`;
    const existing = this.translatorCache.get(key);
    if (existing) return existing;
    const translator = await this.createTranslator(source, target);
    this.translatorCache.set(key, translator);
    if (this.translatorCache.size > MAX_TRANSLATORS) {
      const oldestKey = this.translatorCache.keys().next().value;
      if (oldestKey) {
        const oldest = this.translatorCache.get(oldestKey);
        oldest?.destroy();
        this.translatorCache.delete(oldestKey);
      }
    }
    return translator;
  }

  private getLanguageBase(code: string) {
    const base = code.trim().toLowerCase().split("-")[0] || "";
    if (base === "cmn" || base === "yue" || base === "wuu") return "zh";
    if (base === "iw") return "he";
    if (base === "in") return "id";
    if (base === "ji") return "yi";
    return base;
  }

  private getLanguageScript(code: string) {
    const parts = code
      .trim()
      .toLowerCase()
      .split("-")
      .filter(Boolean);
    const explicitScript = parts.find((part, index) => index > 0 && part.length === 4) ?? null;
    if (explicitScript) return explicitScript;
    if (this.getLanguageBase(code) !== "zh") return null;
    const region = parts.find((part, index) => index > 0 && part.length === 2) ?? null;
    if (region === "cn" || region === "sg" || region === "my") return "hans";
    if (region === "tw" || region === "hk" || region === "mo") return "hant";
    return null;
  }

  private isSameLanguage(codeA: string, codeB: string) {
    const baseA = this.getLanguageBase(codeA);
    const baseB = this.getLanguageBase(codeB);
    if (!baseA || !baseB || baseA !== baseB) return false;
    const scriptA = this.getLanguageScript(codeA);
    const scriptB = this.getLanguageScript(codeB);
    if (scriptA && scriptB) return scriptA === scriptB;
    return true;
  }

  private getCounterpartTarget(lang: TranslateLang) {
    return lang === "zh-CN" ? "en" : "zh-Hans";
  }

  private getEffectiveSourceLang(
    state: Pick<TranslateState, "sourceLang" | "detectedLang">,
    detectedOverride: string | null
  ) {
    if (state.sourceLang === AUTO_OPTION.code) return detectedOverride ?? null;
    return state.sourceLang;
  }

  private resolveAutoTargetLang(source: string | null, lang: TranslateLang) {
    const defaultTarget = this.defaultTargetForLang(lang);
    if (!source) return defaultTarget;
    const candidates = [defaultTarget];
    if (this.getLanguageBase(source) === "zh" && this.getLanguageScript(source) === "hant") {
      candidates.push("zh-Hans");
    }
    candidates.push(this.getCounterpartTarget(lang));

    const next = candidates.find((candidate, index) => {
      if (candidates.indexOf(candidate) !== index) return false;
      return !this.isSameLanguage(source, candidate);
    });
    return next ?? defaultTarget;
  }

  private async translateNow() {
    const input = this.state.inputText.trim();
    if (!input) {
      this.clearOutput();
      return;
    }

    this.cancelInFlight();
    const token = this.beginRequest();
    const abortController = new AbortController();
    this.abortController = abortController;

    this.setState((prev) => ({
      ...prev,
      translating: true,
      statusText: prev.sourceLang === AUTO_OPTION.code ? this.t("statusDetecting") : this.t("statusTranslating"),
      outputText: "",
      detectedLang: prev.sourceLang === AUTO_OPTION.code ? prev.detectedLang : null,
    }));

    try {
      let sourceLang = this.state.sourceLang;
      const wasAutoSource = sourceLang === AUTO_OPTION.code;
      let detectedLang = this.state.detectedLang;
      let targetLang = this.state.targetLang;
      if (sourceLang === AUTO_OPTION.code) {
        if (this.state.detectorAvailability === "unavailable" || this.state.detectorAvailability === "chromeOnly") {
          throw new Error(this.t("detectorUnavailable"));
        }
        const detected = await this.detectLanguage(input, abortController.signal);
        if (!this.isTokenActive(token)) return;
        if (!detected) throw new Error(this.t("detectorUnavailable"));
        sourceLang = detected;
        detectedLang = detected;
      }

      if (this.state.targetLangMode === "auto") {
        const prevTargetLang = targetLang;
        const nextAutoTarget = this.resolveAutoTargetLang(
          this.getEffectiveSourceLang(this.state, detectedLang),
          this.state.currentLang
        );
        if (nextAutoTarget !== targetLang) {
          targetLang = nextAutoTarget;
        }
        this.setState((prev) => ({
          ...prev,
          detectedLang,
          targetLang,
          statusText: this.t("statusTranslating"),
        }));
        if (targetLang !== prevTargetLang) {
          void this.checkAvailability();
        }
      } else if (wasAutoSource) {
        this.setState((prev) => ({
          ...prev,
          detectedLang,
          statusText: this.t("statusTranslating"),
        }));
      }

      if (!this.isTokenActive(token)) return;

      if (this.isSameLanguage(sourceLang, targetLang)) {
        this.setState((prev) => ({
          ...prev,
          outputText: input,
          translating: false,
          statusText: "",
        }));
        return;
      }

      const translator = await this.getTranslator(sourceLang, targetLang);
      if (!this.isTokenActive(token)) return;
      const translateStreaming = Reflect.get(translator, "translateStreaming");
      if (typeof translateStreaming === "function") {
        const stream = translateStreaming.call(translator, input, {
          signal: abortController.signal,
        });
        await this.readStream(
          stream,
          (chunk) => {
            if (!this.isTokenActive(token)) return;
            this.setState((prev) => ({
              ...prev,
              outputText: `${prev.outputText}${chunk}`,
            }));
          },
          token,
          abortController.signal
        );
      } else {
        const output = await translator.translate(input, { signal: abortController.signal });
        if (!this.isTokenActive(token)) return;
        this.setState((prev) => ({ ...prev, outputText: output }));
      }
      if (!this.isTokenActive(token)) return;
      this.setState((prev) => ({
        ...prev,
        translating: false,
        statusText: "",
      }));
    } catch (err) {
      if (!this.isTokenActive(token)) return;
      const message = err instanceof Error ? err.message : String(err);
      this.setState((prev) => ({
        ...prev,
        translating: false,
        statusText: `${this.t("statusError")}${message}`,
      }));
    } finally {
      if (this.activeToken?.id === token.id) {
        this.activeToken = null;
      }
    }
  }

  private async readStream(
    stream: ReadableStream<string>,
    onChunk: (chunk: string) => void,
    token: { id: number; cancelled: boolean },
    signal?: AbortSignal
  ) {
    const reader = stream.getReader();
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (signal?.aborted || token.cancelled) {
          await reader.cancel();
          break;
        }
        if (typeof value === "string") onChunk(value);
      }
    } finally {
      reader.releaseLock();
    }
  }

  private defaultTargetForLang(lang: TranslateLang) {
    return lang === "zh-CN" ? "zh-Hans" : "en";
  }
}

export const translateViewModel = new TranslateViewModel();
