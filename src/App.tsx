import { memo, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type {
  CSSProperties,
  ClipboardEvent,
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import {
  Camera,
  Circle,
  Check,
  Copy,
  Paperclip,
  Pencil,
  RefreshCw,
  RotateCcw,
  Square,
  Trash2,
  Mic,
  X,
} from "lucide-react";
import { chatViewModel, I18N, renderMarkdown } from "./viewmodel";
import type { Attachment, Message } from "./viewmodel";
import CustomSelect from "./CustomSelect";

type ChatMessageProps = {
  msg: Message;
  index: number;
  isEditing: boolean;
  editDraft: string;
  lang: keyof typeof I18N;
  showRegenerate: boolean;
  onCopy: (success: boolean) => void;
};

type AttachmentCardProps = {
  attachment: Attachment;
  compact?: boolean;
  onRemove?: () => void;
};

const getAttachmentPreviewUrl = (attachment: Attachment) =>
  attachment.dataUrl ?? attachment.transientUrl ?? "";

const AttachmentCard = ({ attachment, compact = false, onRemove }: AttachmentCardProps) => {
  const previewUrl = getAttachmentPreviewUrl(attachment);
  const sizeLabel = chatViewModel.formatBytes(attachment.size);
  const showTempNote = Boolean(attachment.transientUrl && !attachment.dataUrl);
  const textPreview = attachment.text?.trim() ?? "";
  const canPreview = Boolean(previewUrl) && attachment.kind === "image";
  const previewLabel = chatViewModel.t("openPreview");
  const handlePreview = () => {
    if (!canPreview) return;
    chatViewModel.openAttachmentPreview(attachment);
  };
  const handlePreviewKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!canPreview) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handlePreview();
    }
  };
  return (
    <div className={`attachment ${compact ? "compact" : ""} kind-${attachment.kind}`}>
      <div className="attachment-head">
        <div className="attachment-name">{attachment.name}</div>
        <div className="attachment-size">{sizeLabel}</div>
      </div>
      {attachment.kind === "text" ? (
        <pre className="attachment-text">
          {textPreview || chatViewModel.t("attachmentPreviewUnavailable")}
        </pre>
      ) : null}
      {attachment.kind === "image" ? (
        previewUrl ? (
          <div
            className={`attachment-media ${canPreview ? "interactive" : ""}`}
            onClick={handlePreview}
            onKeyDown={handlePreviewKeyDown}
            role={canPreview ? "button" : undefined}
            tabIndex={canPreview ? 0 : -1}
            title={canPreview ? previewLabel : undefined}
            aria-label={canPreview ? previewLabel : undefined}
          >
            <img src={previewUrl} alt={attachment.name} loading="lazy" />
          </div>
        ) : (
          <div className="attachment-placeholder">
            {chatViewModel.t("attachmentPreviewUnavailable")}
          </div>
        )
      ) : null}
      {attachment.kind === "audio" ? (
        previewUrl ? (
          <audio src={previewUrl} controls preload="metadata" />
        ) : (
          <div className="attachment-placeholder">
            {chatViewModel.t("attachmentPreviewUnavailable")}
          </div>
        )
      ) : null}
      {showTempNote ? (
        <div className="attachment-note">{chatViewModel.t("attachmentTemp")}</div>
      ) : null}
      {onRemove ? (
        <button
          className="attachment-remove"
          title={chatViewModel.t("remove")}
          onClick={onRemove}
        >
          <X aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
};

const ChatMessage = memo(
  ({ msg, index, isEditing, editDraft, lang, showRegenerate, onCopy }: ChatMessageProps) => {
  const labels = useMemo(
    () => ({
      confirm: chatViewModel.t("confirm"),
      cancel: chatViewModel.t("cancel"),
      rename: chatViewModel.t("rename"),
      delete: chatViewModel.t("delete"),
      copy: chatViewModel.t("copy"),
      regenerate: chatViewModel.t("regenerate"),
    }),
    [lang]
  );
  const html = useMemo(() => renderMarkdown(msg.content || ""), [msg.content]);
  const roleLabel =
    msg.role === "user" ? chatViewModel.t("roleUser") : chatViewModel.t("roleAssistant");
  const timeLabel = chatViewModel.formatTime(msg.ts);
  return (
    <div className={`message ${msg.role}`}>
      <div className="message-meta">
        <span className="message-role">{roleLabel}</span>
        <span className="message-time">{timeLabel}</span>
      </div>
      <div className="message-actions">
        {isEditing ? (
          <>
            <button
              className="edit-confirm"
              title={labels.confirm}
              onClick={() => chatViewModel.saveEdit()}
            >
              <Check aria-hidden="true" />
            </button>
            <button
              className="edit-cancel"
              title={labels.cancel}
              onClick={() => chatViewModel.closeEdit()}
            >
              <X aria-hidden="true" />
            </button>
            {msg.role === "user" ? (
              <button
                className="edit-resend"
                title={chatViewModel.t("resend")}
                onClick={() => void chatViewModel.resendFrom(index)}
              >
                <RotateCcw aria-hidden="true" />
              </button>
            ) : null}
          </>
        ) : (
          <>
            {showRegenerate ? (
              <button
                className="regen-btn"
                title={labels.regenerate}
                onClick={() =>
                  msg.role === "assistant"
                    ? void chatViewModel.regenerateFromAssistant(index)
                    : void chatViewModel.regenerateFromUser(index)
                }
              >
                <RefreshCw aria-hidden="true" />
              </button>
            ) : null}
            <button
              className="copy-btn"
              title={labels.copy}
              onClick={() => {
                void (async () => {
                  try {
                    await navigator.clipboard.writeText(msg.content || "");
                    onCopy(true);
                  } catch {
                    onCopy(false);
                  }
                })();
              }}
            >
              <Copy aria-hidden="true" />
            </button>
            <button
              className="edit-btn"
              title={labels.rename}
              onClick={() => chatViewModel.openEdit(index)}
            >
              <Pencil aria-hidden="true" />
            </button>
            <button
              className="delete-btn"
              title={labels.delete}
              onClick={() => chatViewModel.deleteMessage(index)}
            >
              <Trash2 aria-hidden="true" />
            </button>
          </>
        )}
      </div>
      {isEditing ? (
        <textarea
          className="edit-textarea"
          value={editDraft}
          onChange={(event) => chatViewModel.updateEditDraft(event.target.value)}
          onKeyDown={(event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
              chatViewModel.saveEdit();
            }
            if (event.key === "Escape") {
              chatViewModel.closeEdit();
            }
          }}
          autoFocus
        />
      ) : (
        <div className="message-content" dangerouslySetInnerHTML={{ __html: html }}></div>
      )}
      {msg.attachments && msg.attachments.length > 0 ? (
        <div className="message-attachments">
          {msg.attachments.map((attachment) => (
            <AttachmentCard key={attachment.id} attachment={attachment} />
          ))}
        </div>
      ) : null}
    </div>
  );
  }
);

type SettingsDraft = {
  sendShortcut: "ctrlEnter" | "shiftEnter" | "enter";
  theme: "system" | "light" | "dark";
  systemPrompt: string;
  titleTemplate: string;
  sidebarWidth: number;
};

const SETTINGS_DIALOG_CLOSE_MS = 240;
const hasUnsavedSettingsChanges = (draft: SettingsDraft, saved: SettingsDraft) =>
  draft.sendShortcut !== saved.sendShortcut ||
  draft.theme !== saved.theme ||
  draft.systemPrompt !== saved.systemPrompt ||
  draft.titleTemplate !== saved.titleTemplate;

const App = () => {
  const state = useSyncExternalStore(chatViewModel.subscribe, chatViewModel.getSnapshot);
  const active = state.histories.find((h) => h.id === state.activeId) ?? null;
  const promptContextLabel = useMemo(() => {
    if (state.promptContextUsage === null || state.promptContextWindow === null) {
      return "--";
    }
    const locale = I18N[state.currentLang].locale;
    const formatter = new Intl.NumberFormat(locale);
    const percent =
      state.promptContextWindow > 0
        ? Math.round((state.promptContextUsage / state.promptContextWindow) * 100)
        : 0;
    return `${formatter.format(state.promptContextUsage)} / ${formatter.format(state.promptContextWindow)} (${percent}%)`;
  }, [state.currentLang, state.promptContextUsage, state.promptContextWindow]);
  const lastNonAssistantIndex = (() => {
    if (!active) return -1;
    for (let i = active.messages.length - 1; i >= 0; i -= 1) {
      if (active.messages[i].role !== "assistant") return i;
    }
    return -1;
  })();
  const chatRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const exportDialogRef = useRef<HTMLDialogElement | null>(null);
  const apiDialogRef = useRef<HTMLDialogElement | null>(null);
  const previewDialogRef = useRef<HTMLDialogElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const suppressRenameBlurRef = useRef(false);
  const resizeRef = useRef({ startX: 0, startWidth: 0, active: false });
  const autoScrollRef = useRef(true);
  const lastActiveIdRef = useRef<string | null>(null);
  const [draftSettings, setDraftSettings] = useState<SettingsDraft>(state.settings);
  const [exportSelection, setExportSelection] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<"json" | "md" | "txt">("json");
  const [importStatus, setImportStatus] = useState<string>("");
  const [backupStatus, setBackupStatus] = useState<string>("");
  const [toast, setToast] = useState<{ message: string; tone?: "success" | "error" } | null>(
    null
  );
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const settingsCloseTimerRef = useRef<number | null>(null);

  const appStyle = useMemo(
    () => ({ "--sidebar-width": `${state.settings.sidebarWidth}px` } as CSSProperties),
    [state.settings.sidebarWidth]
  );

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      if (!resizeRef.current.active) return;
      const delta = event.clientX - resizeRef.current.startX;
      chatViewModel.setSidebarWidth(resizeRef.current.startWidth + delta);
    };

    const handleUp = () => {
      if (!resizeRef.current.active) return;
      resizeRef.current.active = false;
      document.body.classList.remove("resizing");
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
      document.body.classList.remove("resizing");
    };
  }, []);

  const startResize = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    resizeRef.current = {
      startX: event.clientX,
      startWidth: state.settings.sidebarWidth,
      active: true,
    };
    document.body.classList.add("resizing");
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  useEffect(() => {
    const lang = state.currentLang === "zh-CN" ? "zh-Hans" : "en";
    document.documentElement.lang = lang;
    document.title = chatViewModel.t("appTitle");
  }, [state.currentLang]);

  useEffect(() => {
    chatViewModel.startAvailabilityCheck();
  }, []);

  useEffect(() => {
    const dialog = apiDialogRef.current;
    if (!dialog) return;
    if (state.apiStatusText) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [state.apiStatusText]);

  useEffect(() => {
    const dialog = previewDialogRef.current;
    if (!dialog) return;
    if (state.previewAttachment) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [state.previewAttachment]);

  useEffect(() => {
    const root = document.documentElement;
    const mode = state.settings.theme;
    if (mode === "system") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", mode);
    }
  }, [state.settings.theme]);

  useEffect(() => {
    document.body.classList.add("page-chat");
    return () => {
      document.body.classList.remove("page-chat");
    };
  }, []);

  useEffect(() => {
    const node = chatRef.current;
    if (!node) return;
    const threshold = 64;
    const handleScroll = () => {
      const distance = node.scrollHeight - node.scrollTop - node.clientHeight;
      autoScrollRef.current = distance <= threshold;
    };
    handleScroll();
    node.addEventListener("scroll", handleScroll, { passive: true });
    return () => node.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const node = chatRef.current;
    if (!node || !active) return;
    const isNewChat = lastActiveIdRef.current !== active.id;
    if (isNewChat) {
      lastActiveIdRef.current = active.id;
      autoScrollRef.current = true;
    }
    if (!autoScrollRef.current) return;
    node.scrollTop = node.scrollHeight;
  }, [active?.id, active?.messages.length, active?.messages.at(-1)?.content]);

  const historyGroups = useMemo(() => {
    const groups: Array<{ date: string; items: typeof state.histories }> = [];
    let lastDate: string | null = null;
    state.histories.forEach((history) => {
      const dateKey = chatViewModel.formatDate(history.updatedAt);
      if (dateKey !== lastDate) {
        groups.push({ date: dateKey, items: [] });
        lastDate = dateKey;
      }
      groups[groups.length - 1].items.push(history);
    });
    return groups;
  }, [state.histories, state.currentLang]);

  const uiLanguageOptions = useMemo(
    () => [
      {
        value: "zh-CN",
        label: "简体中文",
      },
      {
        value: "en-US",
        label: "English",
      },
    ],
    []
  );

  const themeOptions = useMemo(
    () => [
      { value: "system", label: chatViewModel.t("themeSystem") },
      { value: "light", label: chatViewModel.t("themeLight") },
      { value: "dark", label: chatViewModel.t("themeDark") },
    ],
    [state.currentLang]
  );

  const sendShortcutOptions = useMemo(
    () => [
      { value: "ctrlEnter", label: "Ctrl/⌘ + Enter" },
      { value: "shiftEnter", label: "Shift + Enter" },
      { value: "enter", label: "Enter" },
    ],
    []
  );

  const exportFormatOptions = useMemo(
    () => [
      { value: "json", label: chatViewModel.t("exportFormatJson"), badge: "JSON" },
      { value: "md", label: chatViewModel.t("exportFormatMd"), badge: "MD" },
      { value: "txt", label: chatViewModel.t("exportFormatTxt"), badge: "TXT" },
    ],
    [state.currentLang]
  );

  const openSettings = () => {
    setDraftSettings(state.settings);
    setImportStatus("");
    setBackupStatus("");
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (settingsCloseTimerRef.current) {
      window.clearTimeout(settingsCloseTimerRef.current);
      settingsCloseTimerRef.current = null;
    }
    dialog.classList.remove("is-closing");
    if (!dialog.open) {
      dialog.showModal();
    }
  };

  const closeSettings = () => {
    const dialog = dialogRef.current;
    if (!dialog || !dialog.open) return;
    if (hasUnsavedSettingsChanges(draftSettings, state.settings)) {
      const confirmed = window.confirm(chatViewModel.t("settingsUnsavedConfirm"));
      if (!confirmed) return;
    }
    if (settingsCloseTimerRef.current) {
      window.clearTimeout(settingsCloseTimerRef.current);
      settingsCloseTimerRef.current = null;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dialog.classList.remove("is-closing");
      dialog.close();
      return;
    }
    dialog.classList.add("is-closing");
    settingsCloseTimerRef.current = window.setTimeout(() => {
      dialog.classList.remove("is-closing");
      if (dialog.open) dialog.close();
      settingsCloseTimerRef.current = null;
    }, SETTINGS_DIALOG_CLOSE_MS);
  };

  useEffect(() => {
    return () => {
      if (settingsCloseTimerRef.current) {
        window.clearTimeout(settingsCloseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 1800);
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, [toast]);

  const showToast = (message: string, tone?: "success" | "error") => {
    setToast({ message, tone });
  };

  const previewAttachment = state.previewAttachment;
  const previewUrl = previewAttachment ? getAttachmentPreviewUrl(previewAttachment) : "";
  const closePreview = () => chatViewModel.closeAttachmentPreview();
  const isRecording = state.recording;
  const activeMessageCount = active?.messages.length ?? 0;
  const activeAttachmentCount =
    active?.messages.reduce((count, message) => count + (message.attachments?.length ?? 0), 0) ?? 0;
  const hasMessages = activeMessageCount > 0;

  const saveSettings = () => {
    const titleTemplate = draftSettings.titleTemplate.trim();
    chatViewModel.updateSettings({
      ...draftSettings,
      titleTemplate: titleTemplate.length > 0 ? titleTemplate : chatViewModel.getTitlePrompt(),
    });
    closeSettings();
  };

  const openExportDialog = () => {
    const dialog = exportDialogRef.current;
    if (!dialog) return;
    dialog.showModal();
  };

  const closeExportDialog = () => {
    const dialog = exportDialogRef.current;
    if (!dialog) return;
    dialog.close();
  };

  const downloadFile = (file: { filename: string; mime: string; content: string }) => {
    const blob = new Blob([file.content], { type: file.mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleBackupSettings = () => {
    downloadFile(chatViewModel.exportSettingsBundle());
  };

  const handleBackupToClipboard = async () => {
    try {
      const bundle = chatViewModel.exportSettingsBundle();
      await navigator.clipboard.writeText(bundle.content);
      setBackupStatus("");
    } catch {
      setBackupStatus(chatViewModel.t("clipboardUnavailable"));
    }
  };

  const handleImportSettings = async (file: File) => {
    const text = await file.text();
    const result = chatViewModel.importSettingsBundle(text);
    if (result.ok) {
      setDraftSettings(chatViewModel.getSnapshot().settings);
      setImportStatus("");
    } else {
      setImportStatus(result.error ?? "Import failed.");
    }
  };

  const handleImportFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const result = chatViewModel.importSettingsBundle(text);
      if (result.ok) {
        setDraftSettings(chatViewModel.getSnapshot().settings);
        setImportStatus("");
      } else {
        setImportStatus(result.error ?? "Import failed.");
      }
    } catch {
      setImportStatus(chatViewModel.t("clipboardUnavailable"));
    }
  };

  const handleExportChats = () => {
    const file = chatViewModel.exportHistoriesBundle(exportSelection, exportFormat);
    downloadFile(file);
  };

  const toggleExportSelection = (id: string) => {
    setExportSelection((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    setExportSelection((prev) => prev.filter((id) => state.histories.some((h) => h.id === id)));
  }, [state.histories]);

  const handleSend = async () => {
    if (!inputRef.current) return;
    const text = inputRef.current.value;
    if (!text.trim() && state.composerAttachments.length === 0) return;
    inputRef.current.value = "";
    await chatViewModel.sendMessage(text);
  };
  const handleStop = () => {
    chatViewModel.stopStreaming();
  };

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const onInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter") return;
    const shortcut = state.settings.sendShortcut;
    const ctrl = event.ctrlKey || event.metaKey;
    const shift = event.shiftKey;
    const shouldSend =
      (shortcut === "ctrlEnter" && ctrl) ||
      (shortcut === "shiftEnter" && shift) ||
      (shortcut === "enter" && !ctrl && !shift);
    if (shouldSend) {
      event.preventDefault();
      void handleSend();
    }
  };

  const onInputPaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    const { items } = event.clipboardData;
    if (items.length === 0) return;
    const files: File[] = [];
    for (const item of Array.from(items)) {
      if (item.kind !== "file") continue;
      const file = item.getAsFile();
      if (file) files.push(file);
    }
    if (files.length === 0) return;
    event.preventDefault();
    void chatViewModel.addAttachmentsFromFiles(files);
  };

  const renameInputHandlers = {
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") chatViewModel.commitRename();
      if (event.key === "Escape") chatViewModel.cancelRename();
    },
    onBlur: () => {
      if (suppressRenameBlurRef.current) {
        suppressRenameBlurRef.current = false;
        return;
      }
      chatViewModel.commitRename();
    },
  };

  return (
    <>
      <div className="app" style={appStyle}>
        <div className="app-ambient" aria-hidden="true">
          <span className="ambient-orb ambient-orb-a"></span>
          <span className="ambient-orb ambient-orb-b"></span>
          <span className="ambient-orb ambient-orb-c"></span>
          <span className="ambient-grid"></span>
        </div>
        <aside className="sidebar">
          <div className="sidebar-panel brand-panel">
            <div className="brand">
              <div className="brand-title">{chatViewModel.t("brandTitle")}</div>
              <div className="brand-sub">{chatViewModel.t("brandSub")}</div>
            </div>
          </div>
          <div className="sidebar-panel controls-panel">
            <CustomSelect
              id="lang-select"
              label={chatViewModel.t("language")}
              value={state.currentLang}
              options={uiLanguageOptions}
              onChange={(value) => chatViewModel.setLanguage(value as keyof typeof I18N)}
            />
            <div className="actions">
              <button className="btn primary" onClick={() => chatViewModel.newChat()}>
                {chatViewModel.t("newChat")}
              </button>
              <a className="btn" href="./translate/">
                {chatViewModel.t("translate")}
              </a>
              <button className="btn" onClick={openSettings}>
                {chatViewModel.t("settings")}
              </button>
            </div>
          </div>
          <div className="sidebar-panel history-panel">
            <div className="sidebar-panel-header">
              <span>{chatViewModel.t("historyCount")}</span>
              <strong>{state.histories.length}</strong>
            </div>
            <div className="history">
              {historyGroups.map((group) => (
                <div key={group.date} className="history-group">
                  <div className="history-date">{group.date}</div>
                  <div className="history-divider"></div>
                  {group.items.map((history) => {
                    const isActive = history.id === state.activeId;
                    const isRenaming =
                      state.renameSource === "history" && state.renameTargetId === history.id;
                    return (
                      <div
                        key={history.id}
                        className={`history-item ${isActive ? "active" : ""}`}
                        onClick={() => chatViewModel.setActive(history.id)}
                      >
                        <div className="history-title">
                          {isRenaming ? (
                            <input
                              className="rename-input"
                              value={state.renameDraft}
                              onChange={(event) =>
                                chatViewModel.updateRenameDraft(event.target.value)
                              }
                              onClick={(event) => event.stopPropagation()}
                              {...renameInputHandlers}
                              autoFocus
                            />
                          ) : (
                            history.name
                          )}
                        </div>
                        <div className="history-actions">
                          {isRenaming ? (
                            <>
                              <button
                                className="history-confirm"
                                title={chatViewModel.t("confirm")}
                                onMouseDown={() => {
                                  suppressRenameBlurRef.current = true;
                                }}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  chatViewModel.commitRename();
                                }}
                              >
                                <Check aria-hidden="true" />
                              </button>
                              <button
                                className="history-cancel"
                                title={chatViewModel.t("cancel")}
                                onMouseDown={() => {
                                  suppressRenameBlurRef.current = true;
                                }}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  chatViewModel.cancelRename();
                                }}
                              >
                                <X aria-hidden="true" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="history-rename"
                                title={chatViewModel.t("rename")}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  chatViewModel.beginRenameHistory(history.id);
                                }}
                              >
                                <Pencil aria-hidden="true" />
                              </button>
                              <button
                                className="history-delete"
                                title={chatViewModel.t("delete")}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  chatViewModel.deleteHistory(history.id);
                                }}
                              >
                                <Trash2 aria-hidden="true" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div
          className="sidebar-resizer"
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize sidebar"
          onPointerDown={startResize}
        ></div>

        <main className="main">
          <div className="main-shell">
            <header className="topbar">
              <div className="title-wrap">
                <div className="title" id="current-title">
                  {state.renameSource === "topbar" && state.renameTargetId === active?.id ? (
                    <input
                      className="rename-input"
                      value={state.renameDraft}
                      onChange={(event) => chatViewModel.updateRenameDraft(event.target.value)}
                      {...renameInputHandlers}
                      autoFocus
                    />
                  ) : (
                    active ? active.name : chatViewModel.t("defaultTitle")
                  )}
                </div>
                <div className="title-meta">
                  {active ? (
                    <>
                      <span className="meta-pill">
                        {chatViewModel.t("topbarContext")} {promptContextLabel}
                      </span>
                      {activeAttachmentCount > 0 ? (
                        <span className="meta-pill">
                          {chatViewModel.t("topbarAttachments")} {activeAttachmentCount}
                        </span>
                      ) : null}
                      <span className="meta-pill subtle">
                        {chatViewModel.t("topbarUpdated")} {chatViewModel.formatTime(active.updatedAt)}
                      </span>
                    </>
                  ) : (
                    <span className="meta-pill subtle">
                      {chatViewModel.t("historyCount")} {state.histories.length}
                    </span>
                  )}
                </div>
              </div>
              <div className="topbar-actions">
                {active
                  ? state.renameSource === "topbar" && state.renameTargetId === active.id
                    ? (
                        <>
                          <button
                            className="icon-btn success"
                            title={chatViewModel.t("confirm")}
                            onMouseDown={() => {
                              suppressRenameBlurRef.current = true;
                            }}
                            onClick={() => chatViewModel.commitRename()}
                          >
                            <Check aria-hidden="true" />
                          </button>
                          <button
                            className="icon-btn danger"
                            title={chatViewModel.t("cancel")}
                            onMouseDown={() => {
                              suppressRenameBlurRef.current = true;
                            }}
                            onClick={() => chatViewModel.cancelRename()}
                          >
                            <X aria-hidden="true" />
                          </button>
                        </>
                      )
                    : (
                        <>
                          <button
                            className="icon-btn"
                            title={chatViewModel.t("rename")}
                            onClick={() => chatViewModel.beginRenameTopbar()}
                          >
                            <Pencil aria-hidden="true" />
                          </button>
                          <button
                            className="icon-btn danger"
                            title={chatViewModel.t("delete")}
                            onClick={() => chatViewModel.deleteActive()}
                          >
                            <Trash2 aria-hidden="true" />
                          </button>
                        </>
                      )
                  : null}
              </div>
            </header>

            <section className="chat" id="chat" ref={chatRef}>
              <div className="chat-stage">
                {hasMessages ? (
                  <div className="chat-stack">
                    {active?.messages.map((msg, index) => {
                      const isEditing = state.editingIndex === index;
                      const showRegenerate =
                        !state.streaming &&
                        (msg.role === "assistant" || index === lastNonAssistantIndex);
                      return (
                        <ChatMessage
                          key={`${msg.ts}-${index}`}
                          msg={msg}
                          index={index}
                          isEditing={isEditing}
                          editDraft={isEditing ? state.editDraft : ""}
                          lang={state.currentLang}
                          showRegenerate={showRegenerate}
                          onCopy={(success) => {
                            showToast(
                              chatViewModel.t(success ? "toastCopied" : "toastCopyFailed"),
                              success ? "success" : "error"
                            );
                          }}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="chat-empty">
                    <div className="chat-empty-badge">{chatViewModel.t("brandSub")}</div>
                    <h2>{chatViewModel.t("emptyTitle")}</h2>
                    <p>{chatViewModel.t("emptyBody")}</p>
                    <div className="chat-empty-cues">
                      <span>{chatViewModel.t("uploadFile")}</span>
                      <span>{chatViewModel.t("attachPhoto")}</span>
                      <span>{chatViewModel.t("attachAudio")}</span>
                    </div>
                    <div className="chat-empty-actions">
                      {!active ? (
                        <button className="btn primary" onClick={() => chatViewModel.newChat()}>
                          {chatViewModel.t("newChat")}
                        </button>
                      ) : null}
                      <a className="btn" href="./translate/">
                        {chatViewModel.t("translate")}
                      </a>
                    </div>
                    <div className="chat-empty-note">{chatViewModel.t("emptyPrivacy")}</div>
                  </div>
                )}
              </div>
            </section>

            <footer className="composer">
              <div className="composer-head">
                <div className="composer-hint">{chatViewModel.t("composerHint")}</div>
                {state.composerAttachments.length > 0 ? (
                  <div className="composer-count">
                    {chatViewModel.t("attachments")} {state.composerAttachments.length}
                  </div>
                ) : null}
              </div>
              <div className="composer-input">
                <textarea
                  id="input"
                  ref={inputRef}
                  placeholder={chatViewModel.t("inputPlaceholder")}
                  rows={2}
                  onKeyDown={onInputKeyDown}
                  onPaste={onInputPaste}
                ></textarea>
                {state.composerAttachments.length > 0 ? (
                  <div className="composer-attachments">
                    {state.composerAttachments.map((attachment) => (
                      <AttachmentCard
                        key={attachment.id}
                        attachment={attachment}
                        compact
                        onRemove={() => chatViewModel.removeComposerAttachment(attachment.id)}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="composer-actions">
                <div className="composer-tools">
                  <button
                    className="icon-btn"
                    title={chatViewModel.t("uploadFile")}
                    aria-label={chatViewModel.t("uploadFile")}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={state.streaming}
                  >
                    <Paperclip aria-hidden="true" />
                  </button>
                  <button
                    className="icon-btn"
                    title={chatViewModel.t("attachPhoto")}
                    aria-label={chatViewModel.t("attachPhoto")}
                    onClick={() => photoInputRef.current?.click()}
                    disabled={state.streaming}
                  >
                    <Camera aria-hidden="true" />
                  </button>
                  <button
                    className={`icon-btn ${isRecording ? "recording" : ""}`}
                    title={chatViewModel.t(isRecording ? "recordStop" : "recordStart")}
                    aria-label={chatViewModel.t(isRecording ? "recordStop" : "recordStart")}
                    onClick={() =>
                      isRecording ? chatViewModel.stopRecording() : void chatViewModel.startRecording()
                    }
                    disabled={state.streaming}
                  >
                    {isRecording ? <Square aria-hidden="true" /> : <Circle aria-hidden="true" />}
                  </button>
                  <button
                    className="icon-btn"
                    title={chatViewModel.t("attachAudio")}
                    aria-label={chatViewModel.t("attachAudio")}
                    onClick={() => audioInputRef.current?.click()}
                    disabled={state.streaming}
                  >
                    <Mic aria-hidden="true" />
                  </button>
                </div>
                <div className="composer-send">
                  {state.streaming ? (
                    <button
                      className="btn stop"
                      onClick={handleStop}
                      title={chatViewModel.t("stop")}
                      aria-label={chatViewModel.t("stop")}
                    >
                      <Square aria-hidden="true" />
                    </button>
                  ) : (
                    <button className="btn primary" onClick={() => void handleSend()}>
                      {chatViewModel.t("send")}
                    </button>
                  )}
                </div>
              </div>
              <div className="status">{state.statusText}</div>
              <input
                ref={fileInputRef}
                type="file"
                className="visually-hidden"
                accept="text/*,image/*,audio/*"
                multiple
                onChange={(event) => {
                  const files = event.currentTarget.files;
                  if (files && files.length > 0) {
                    void chatViewModel.addAttachmentsFromFiles(files);
                  }
                  event.currentTarget.value = "";
                }}
              />
              <input
                ref={photoInputRef}
                type="file"
                className="visually-hidden"
                accept="image/*"
                capture="environment"
                onChange={(event) => {
                  const files = event.currentTarget.files;
                  if (files && files.length > 0) {
                    void chatViewModel.addAttachmentsFromFiles(files);
                  }
                  event.currentTarget.value = "";
                }}
              />
              <input
                ref={audioInputRef}
                type="file"
                className="visually-hidden"
                accept="audio/*"
                onChange={(event) => {
                  const files = event.currentTarget.files;
                  if (files && files.length > 0) {
                    void chatViewModel.addAttachmentsFromFiles(files);
                  }
                  event.currentTarget.value = "";
                }}
              />
            </footer>
          </div>
        </main>
      </div>

      <dialog
        ref={apiDialogRef}
        className="api-dialog"
        onCancel={(event) => event.preventDefault()}
      >
        <div className="api-card">
          <div className="api-title">{chatViewModel.t("apiTitle")}</div>
          <div className="api-text">{state.apiStatusText}</div>
          {state.downloadProgress !== null ? (
            <div className="download-progress">
              <div className="download-progress-track">
                <div
                  className="download-progress-bar"
                  style={{ width: `${Math.round(state.downloadProgress * 100)}%` }}
                ></div>
              </div>
              <div className="download-progress-label">
                {chatViewModel.t("apiDownloadProgress")}:{" "}
                {Math.round(state.downloadProgress * 100)}%
              </div>
            </div>
          ) : null}
          <div className="api-actions">
            {state.apiAvailability === "downloadable" ? (
              <>
                <button
                  className="btn primary"
                  onClick={() => void chatViewModel.startDownloadPromptApi()}
                  disabled={state.downloadProgress !== null}
                >
                  {chatViewModel.t("apiDownloadNow")}
                </button>
                <button className="btn" onClick={() => void chatViewModel.forceUsePromptApi()}>
                  {chatViewModel.t("apiForceUse")}
                </button>
              </>
            ) : (
              <button className="btn primary" onClick={() => void chatViewModel.forceUsePromptApi()}>
                {chatViewModel.t("apiForceUse")}
              </button>
            )}
          </div>
        </div>
      </dialog>

      <dialog
        ref={previewDialogRef}
        className="preview-dialog"
        onCancel={(event) => {
          event.preventDefault();
          closePreview();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closePreview();
        }}
      >
        <div className="preview-card">
          <div className="preview-header">
            <div className="preview-title">
              {previewAttachment?.name ?? chatViewModel.t("attachments")}
            </div>
            <button
              className="icon-btn"
              title={chatViewModel.t("close")}
              onClick={closePreview}
            >
              <X aria-hidden="true" />
            </button>
          </div>
          <div className="preview-body">
            {previewAttachment?.kind === "image" ? (
              previewUrl ? (
                <img className="preview-media" src={previewUrl} alt={previewAttachment.name} />
              ) : (
                <div className="attachment-placeholder">
                  {chatViewModel.t("attachmentPreviewUnavailable")}
                </div>
              )
            ) : null}
            {previewAttachment?.kind === "audio" ? (
              previewUrl ? (
                <audio className="preview-media" src={previewUrl} controls autoPlay />
              ) : (
                <div className="attachment-placeholder">
                  {chatViewModel.t("attachmentPreviewUnavailable")}
                </div>
              )
            ) : null}
          </div>
        </div>
      </dialog>

      <dialog
        ref={dialogRef}
        className="settings-dialog"
        onCancel={(event) => {
          event.preventDefault();
          closeSettings();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeSettings();
        }}
      >
        <form method="dialog" className="settings-card">
          <div className="settings-header">
            <div className="settings-title">{chatViewModel.t("settings")}</div>
            <button
              className="icon-btn"
              title={chatViewModel.t("close")}
              type="button"
              onClick={closeSettings}
            >
              <X aria-hidden="true" />
            </button>
          </div>

          <div className="settings-row">
            <label htmlFor="theme-mode">{chatViewModel.t("theme")}</label>
            <CustomSelect
              id="theme-mode"
              label={chatViewModel.t("theme")}
              value={draftSettings.theme}
              options={themeOptions}
              showBadge={false}
              showLabel={false}
              onChange={(value) =>
                setDraftSettings((prev) => ({
                  ...prev,
                  theme: value as SettingsDraft["theme"],
                }))
              }
            />
          </div>

          <div className="settings-row">
            <label htmlFor="send-shortcut">{chatViewModel.t("sendShortcut")}</label>
            <CustomSelect
              id="send-shortcut"
              label={chatViewModel.t("sendShortcut")}
              value={draftSettings.sendShortcut}
              options={sendShortcutOptions}
              showBadge={false}
              showLabel={false}
              onChange={(value) =>
                setDraftSettings((prev) => ({
                  ...prev,
                  sendShortcut: value as SettingsDraft["sendShortcut"],
                }))
              }
            />
          </div>

          <div className="settings-row">
            <label htmlFor="system-prompt">{chatViewModel.t("templateChat")}</label>
            <textarea
              id="system-prompt"
              rows={5}
              value={draftSettings.systemPrompt}
              onChange={(event) =>
                setDraftSettings((prev) => ({ ...prev, systemPrompt: event.target.value }))
              }
            ></textarea>
            <div className="settings-hint">{chatViewModel.t("hintChat")}</div>
          </div>

          <div className="settings-row">
            <label htmlFor="title-template">{chatViewModel.t("templateTitle")}</label>
            <textarea
              id="title-template"
              rows={4}
              value={draftSettings.titleTemplate}
              onChange={(event) =>
                setDraftSettings((prev) => ({ ...prev, titleTemplate: event.target.value }))
              }
            ></textarea>
            <div className="settings-hint">{chatViewModel.t("hintTitle")}</div>
          </div>

          <div className="settings-row">
            <label>{chatViewModel.t("settingsBackup")}</label>
            <div className="settings-inline-actions">
              <button className="btn" type="button" onClick={handleBackupSettings}>
                {chatViewModel.t("backupToFile")}
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => void handleBackupToClipboard()}
              >
                {chatViewModel.t("backupToClipboard")}
              </button>
            </div>
          </div>

          <div className="settings-row">
            <label>{chatViewModel.t("importSettings")}</label>
            <div className="settings-inline-actions">
              <button
                className="btn"
                type="button"
                onClick={() => importInputRef.current?.click()}
              >
                {chatViewModel.t("importFromFile")}
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => void handleImportFromClipboard()}
              >
                {chatViewModel.t("importFromClipboard")}
              </button>
            </div>
            {importStatus ? <div className="settings-hint">{importStatus}</div> : null}
            {backupStatus ? <div className="settings-hint">{backupStatus}</div> : null}
          </div>

          <div className="settings-row">
            <label>{chatViewModel.t("exportChats")}</label>
            <div className="settings-inline-actions">
              <button className="btn" type="button" onClick={openExportDialog}>
                {chatViewModel.t("openExportDialog")}
              </button>
            </div>
          </div>

          <div className="settings-actions">
            <button className="btn primary" type="button" onClick={saveSettings}>
              {chatViewModel.t("save")}
            </button>
          </div>
          <input
            ref={importInputRef}
            type="file"
            className="visually-hidden"
            accept="application/json"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (file) {
                void handleImportSettings(file);
              }
              event.currentTarget.value = "";
            }}
          />
        </form>
      </dialog>

      <dialog ref={exportDialogRef} className="settings-dialog">
        <div className="settings-card">
          <div className="settings-header">
            <div className="settings-title">{chatViewModel.t("exportDialogTitle")}</div>
            <button
              className="icon-btn"
              title={chatViewModel.t("close")}
              onClick={closeExportDialog}
            >
              <X aria-hidden="true" />
            </button>
          </div>
          <div className="settings-row">
            <div className="settings-hint">{chatViewModel.t("exportHint")}</div>
            {state.histories.length === 0 ? (
              <div className="settings-hint">{chatViewModel.t("exportEmpty")}</div>
            ) : (
              <>
                <div className="export-controls">
                  <div className="export-actions">
                    <button
                      className="btn"
                      type="button"
                      onClick={() => setExportSelection(state.histories.map((h) => h.id))}
                    >
                      {chatViewModel.t("exportSelectAll")}
                    </button>
                    <button className="btn" type="button" onClick={() => setExportSelection([])}>
                      {chatViewModel.t("exportClear")}
                    </button>
                  </div>
                  <div className="export-format">
                    <span>{chatViewModel.t("exportFormat")}</span>
                    <CustomSelect
                      value={exportFormat}
                      label={chatViewModel.t("exportFormat")}
                      options={exportFormatOptions}
                      showLabel={false}
                      onChange={(value) => setExportFormat(value as "json" | "md" | "txt")}
                    />
                  </div>
                </div>
                <div className="export-list">
                  {state.histories.map((history) => (
                    <label key={history.id} className="export-item">
                      <input
                        type="checkbox"
                        checked={exportSelection.includes(history.id)}
                        onChange={() => toggleExportSelection(history.id)}
                      />
                      <span className="export-name">{history.name}</span>
                      <span className="export-date">
                        {chatViewModel.formatDate(history.updatedAt)}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="settings-inline-actions">
                  <button
                    className="btn primary"
                    type="button"
                    onClick={handleExportChats}
                    disabled={exportSelection.length === 0}
                  >
                    {chatViewModel.t("exportSelected")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </dialog>

      <div className={`toast ${toast ? "show" : ""} ${toast?.tone ?? ""}`}>
        {toast?.message}
      </div>
    </>
  );
};

export default App;
