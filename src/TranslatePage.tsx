import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowLeftRight, Check, ChevronDown, Copy, Trash2 } from "lucide-react";
import {
  translateViewModel,
  TranslateI18N,
  type LanguageOption,
  type TranslateLang,
} from "./translateViewModel";
import { chatViewModel } from "./viewmodel";

type LanguageSelectProps = {
  label: string;
  value: string;
  options: LanguageOption[];
  placeholder: string;
  lang: TranslateLang;
  onChange: (code: string) => void;
};

const LanguageSelect = ({
  label,
  value,
  options,
  placeholder,
  lang,
  onChange,
}: LanguageSelectProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (containerRef.current.contains(event.target as Node)) return;
      setOpen(false);
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return options;
    return options.filter((option) => {
      const labelText = translateViewModel.formatLanguageLabel(option.code, lang).toLowerCase();
      const codeText = option.code.toLowerCase();
      return labelText.includes(keyword) || codeText.includes(keyword);
    });
  }, [options, query, lang]);

  const selectedLabel = translateViewModel.formatLanguageDisplay(value, lang);

  return (
    <div className="language-select" ref={containerRef}>
      <label>{label}</label>
      <button
        className="language-select-trigger"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span className="language-select-value">{selectedLabel}</span>
        <ChevronDown aria-hidden="true" />
      </button>
      {open ? (
        <div className="language-select-popover">
          <input
            ref={inputRef}
            className="language-select-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            onKeyDown={(event) => {
              if (event.key === "Escape") setOpen(false);
            }}
          />
          <div className="language-select-list">
            {filtered.length === 0 ? (
              <div className="language-select-empty">{translateViewModel.t("noResults")}</div>
            ) : (
              filtered.map((option) => {
                const optionLabel = translateViewModel.formatLanguageLabel(option.code, lang);
                const isSelected = option.code === value;
                return (
                  <button
                    key={option.code}
                    type="button"
                    className={`language-select-option ${isSelected ? "selected" : ""}`}
                    onClick={() => {
                      onChange(option.code);
                      setOpen(false);
                    }}
                  >
                    <span className="language-select-option-name">{optionLabel}</span>
                    <span className="language-select-option-code">{option.code}</span>
                    {isSelected ? <Check aria-hidden="true" /> : null}
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const TranslatePage = () => {
  const state = useSyncExternalStore(
    translateViewModel.subscribe,
    translateViewModel.getSnapshot
  );
  const [copyStatus, setCopyStatus] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    translateViewModel.startAvailabilityCheck();
    return () => translateViewModel.cancelInFlight();
  }, []);

  useEffect(() => {
    const lang = state.currentLang === "zh-CN" ? "zh-Hans" : "en";
    document.documentElement.lang = lang;
    document.title = translateViewModel.t("title");
  }, [state.currentLang]);

  const sourceOptions = useMemo(
    () => translateViewModel.getLanguageOptions(true),
    [state.currentLang]
  );
  const targetOptions = useMemo(
    () => translateViewModel.getLanguageOptions(false),
    [state.currentLang]
  );

  const detectedLabel = state.detectedLang
    ? `${translateViewModel.formatLanguageLabel(state.detectedLang)} (${state.detectedLang})`
    : "";

  useEffect(() => {
    if (!copyStatus) return;
    const timer = window.setTimeout(() => setCopyStatus(null), 1600);
    return () => window.clearTimeout(timer);
  }, [copyStatus]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(state.outputText || "");
      setCopyStatus("success");
    } catch {
      setCopyStatus("error");
    }
  };

  const handleLanguageChange = (lang: TranslateLang) => {
    translateViewModel.setLanguage(lang);
    chatViewModel.setLanguage(lang);
  };

  return (
    <div className="translate-page">
      <header className="translate-header">
        <div>
          <div className="translate-title">{translateViewModel.t("title")}</div>
          <div className="translate-subtitle">{translateViewModel.t("subtitle")}</div>
        </div>
        <div className="translate-header-actions">
          <div className="lang-switch">
            <label htmlFor="translate-lang">{translateViewModel.t("language")}</label>
            <select
              id="translate-lang"
              value={state.currentLang}
              onChange={(event) =>
                handleLanguageChange(event.target.value as keyof typeof TranslateI18N)
              }
            >
              {(Object.keys(TranslateI18N) as TranslateLang[]).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
          <a className="btn" href="../">
            <ArrowLeft aria-hidden="true" />
            <span>{translateViewModel.t("backToChat")}</span>
          </a>
        </div>
      </header>

      <section className="translate-controls">
        <LanguageSelect
          label={translateViewModel.t("sourceLanguage")}
          value={state.sourceLang}
          options={sourceOptions}
          placeholder={translateViewModel.t("languageSearchPlaceholder")}
          lang={state.currentLang}
          onChange={(code) => translateViewModel.setSourceLang(code)}
        />

        <button
          className="icon-btn"
          type="button"
          title={translateViewModel.t("swap")}
          aria-label={translateViewModel.t("swap")}
          onClick={() => translateViewModel.swapLanguages()}
        >
          <ArrowLeftRight aria-hidden="true" />
        </button>

        <LanguageSelect
          label={translateViewModel.t("targetLanguage")}
          value={state.targetLang}
          options={targetOptions}
          placeholder={translateViewModel.t("languageSearchPlaceholder")}
          lang={state.currentLang}
          onChange={(code) => translateViewModel.setTargetLang(code)}
        />
      </section>

      <section className="translate-panels">
        <div className="translate-panel">
          <div className="translate-panel-header">
            <span>{translateViewModel.t("sourceLanguage")}</span>
            <div className="translate-panel-actions">
              {detectedLabel ? (
                <span className="translate-detected">
                  {translateViewModel.t("detectedLanguage")}: {detectedLabel}
                </span>
              ) : null}
              <button
                className="btn"
                type="button"
                onClick={() => translateViewModel.clearInput()}
                disabled={!state.inputText.trim()}
              >
                <Trash2 aria-hidden="true" />
                <span>{translateViewModel.t("clearInput")}</span>
              </button>
            </div>
          </div>
          <textarea
            rows={10}
            value={state.inputText}
            placeholder={translateViewModel.t("inputPlaceholder")}
            onChange={(event) => translateViewModel.setInputText(event.target.value)}
          ></textarea>
        </div>

        <div className="translate-panel">
          <div className="translate-panel-header">
            <span>{translateViewModel.t("targetLanguage")}</span>
            <div className="translate-output-actions">
              <button className="btn" onClick={handleCopy} disabled={!state.outputText}>
                <Copy aria-hidden="true" />
                <span>{translateViewModel.t("copy")}</span>
              </button>
              {copyStatus ? (
                <span className="translate-copy-status">
                  {translateViewModel.t(copyStatus === "success" ? "copied" : "copyFailed")}
                </span>
              ) : null}
            </div>
          </div>
          <div className="translate-output">
            {state.outputText || (
              <span className="translate-output-placeholder">
                {translateViewModel.t("outputPlaceholder")}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="translate-status">
        {state.statusText ? <div className="translate-status-row">{state.statusText}</div> : null}
        {state.detectorStatusText ? (
          <div className="translate-status-row">{state.detectorStatusText}</div>
        ) : null}
        {state.apiStatusText ? (
          <div className="translate-status-row">{state.apiStatusText}</div>
        ) : null}
        {state.apiAvailability === "downloadable" ? (
          <div className="translate-status-actions">
            <button className="btn primary" onClick={() => void translateViewModel.startDownloadTranslator()}>
              {translateViewModel.t("apiDownloadNow")}
            </button>
            <button className="btn" onClick={() => void translateViewModel.forceUseTranslator()}>
              {translateViewModel.t("apiForceUse")}
            </button>
          </div>
        ) : null}
        {state.apiAvailability === "downloading" && state.downloadProgress !== null ? (
          <div className="translate-progress">
            <div className="translate-progress-track">
              <div
                className="translate-progress-bar"
                style={{ width: `${Math.round(state.downloadProgress * 100)}%` }}
              ></div>
            </div>
            <div className="translate-progress-label">
              {translateViewModel.t("apiDownloadProgress")}:{" "}
              {Math.round(state.downloadProgress * 100)}%
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default TranslatePage;
