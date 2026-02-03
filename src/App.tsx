import { memo, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type {
  CSSProperties,
  ClipboardEvent,
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import {
  Camera,
  Check,
  Paperclip,
  Pencil,
  RotateCcw,
  Square,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { chatViewModel, I18N, renderMarkdown } from "./viewmodel";
import type { Attachment, Message } from "./viewmodel";

type ChatMessageProps = {
  msg: Message;
  index: number;
  isEditing: boolean;
  editDraft: string;
  lang: keyof typeof I18N;
};

type AttachmentCardProps = {
  attachment: Attachment;
  compact?: boolean;
  onRemove?: () => void;
};

const getAttachmentPreviewUrl = (attachment: Attachment) =>
  attachment.dataUrl || attachment.transientUrl || "";

const AttachmentCard = ({ attachment, compact = false, onRemove }: AttachmentCardProps) => {
  const previewUrl = getAttachmentPreviewUrl(attachment);
  const sizeLabel = chatViewModel.formatBytes(attachment.size);
  const showTempNote = Boolean(attachment.transientUrl && !attachment.dataUrl);
  const textPreview = attachment.text?.trim() || "";
  return (
    <div className={`attachment ${compact ? "compact" : ""}`}>
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
          <img src={previewUrl} alt={attachment.name} loading="lazy" />
        ) : (
          <div className="attachment-placeholder">
            {chatViewModel.t("attachmentPreviewUnavailable")}
          </div>
        )
      ) : null}
      {attachment.kind === "video" ? (
        previewUrl ? (
          <video
            src={previewUrl}
            controls={!compact}
            muted={compact}
            playsInline
            preload="metadata"
          />
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

const ChatMessage = memo(({ msg, index, isEditing, editDraft, lang }: ChatMessageProps) => {
  const labels = useMemo(
    () => ({
      confirm: chatViewModel.t("confirm"),
      cancel: chatViewModel.t("cancel"),
      rename: chatViewModel.t("rename"),
      delete: chatViewModel.t("delete"),
    }),
    [lang]
  );
  const html = useMemo(() => renderMarkdown(msg.content || ""), [msg.content]);
  return (
    <div className={`message ${msg.role}`}>
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
                onClick={() => chatViewModel.resendFrom(index)}
              >
                <RotateCcw aria-hidden="true" />
              </button>
            ) : null}
          </>
        ) : (
          <>
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
        <div dangerouslySetInnerHTML={{ __html: html }}></div>
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
});

type SettingsDraft = {
  sendShortcut: "ctrlEnter" | "shiftEnter" | "enter";
  theme: "system" | "light" | "dark";
  systemPrompt: string;
  titleTemplate: string;
  sidebarWidth: number;
};

const App = () => {
  const state = useSyncExternalStore(chatViewModel.subscribe, chatViewModel.getSnapshot);
  const active = state.histories.find((h) => h.id === state.activeId) || null;
  const chatRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const exportDialogRef = useRef<HTMLDialogElement | null>(null);
  const apiDialogRef = useRef<HTMLDialogElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const resizeRef = useRef({ startX: 0, startWidth: 0, active: false });
  const autoScrollRef = useRef(true);
  const lastActiveIdRef = useRef<string | null>(null);
  const [draftSettings, setDraftSettings] = useState<SettingsDraft>(state.settings);
  const [exportSelection, setExportSelection] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<"json" | "md" | "txt">("json");
  const [importStatus, setImportStatus] = useState<string>("");
  const [backupStatus, setBackupStatus] = useState<string>("");
  const importInputRef = useRef<HTMLInputElement | null>(null);

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
    event.currentTarget.setPointerCapture?.(event.pointerId);
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
        if (dialog.showModal) dialog.showModal();
        else dialog.setAttribute("open", "true");
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [state.apiStatusText]);

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

  const openSettings = () => {
    setDraftSettings(state.settings);
    setImportStatus("");
    setBackupStatus("");
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (dialog.showModal) dialog.showModal();
    else dialog.setAttribute("open", "true");
  };

  const closeSettings = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.close();
  };

  const saveSettings = () => {
    chatViewModel.updateSettings({
      ...draftSettings,
      titleTemplate: draftSettings.titleTemplate.trim() || chatViewModel.getTitlePrompt(),
    });
    closeSettings();
  };

  const openExportDialog = () => {
    const dialog = exportDialogRef.current;
    if (!dialog) return;
    if (dialog.showModal) dialog.showModal();
    else dialog.setAttribute("open", "true");
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
      setImportStatus(result.error || "Import failed.");
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
        setImportStatus(result.error || "Import failed.");
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
    const items = event.clipboardData?.items;
    if (!items || items.length === 0) return;
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
    onBlur: () => chatViewModel.commitRename(),
  };

  return (
    <>
      <div className="app" style={appStyle}>
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-title">{chatViewModel.t("brandTitle")}</div>
            <div className="brand-sub">{chatViewModel.t("brandSub")}</div>
          </div>
          <div className="lang-switch">
            <label htmlFor="lang-select">{chatViewModel.t("language")}</label>
            <select
              id="lang-select"
              value={state.currentLang}
              onChange={(event) => chatViewModel.setLanguage(event.target.value as keyof typeof I18N)}
            >
              {Object.keys(I18N).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
          <div className="actions">
            <button className="btn primary" onClick={() => chatViewModel.newChat()}>
              {chatViewModel.t("newChat")}
            </button>
            <button className="btn" onClick={openSettings}>
              {chatViewModel.t("settings")}
            </button>
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
                            chatViewModel.setActive(history.id);
                            chatViewModel.deleteActive();
                          }}
                        >
                          <Trash2 aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
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
          <header className="topbar">
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
                active?.name || chatViewModel.t("defaultTitle")
              )}
            </div>
            <div className="topbar-actions">
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
            </div>
          </header>

          <section className="chat" id="chat" ref={chatRef}>
            {active?.messages.map((msg, index) => {
              const isEditing = state.editingIndex === index;
              return (
                <ChatMessage
                  key={`${msg.ts}-${index}`}
                  msg={msg}
                  index={index}
                  isEditing={isEditing}
                  editDraft={isEditing ? state.editDraft : ""}
                  lang={state.currentLang}
                />
              );
            })}
          </section>

          <footer className="composer">
            <div className="composer-input">
              <textarea
                id="input"
                ref={inputRef}
                placeholder={chatViewModel.t("inputPlaceholder")}
                rows={3}
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
                  className="icon-btn"
                  title={chatViewModel.t("attachVideo")}
                  aria-label={chatViewModel.t("attachVideo")}
                  onClick={() => videoInputRef.current?.click()}
                  disabled={state.streaming}
                >
                  <Video aria-hidden="true" />
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
              accept="text/*,image/*,video/*"
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
              ref={videoInputRef}
              type="file"
              className="visually-hidden"
              accept="video/*"
              capture="environment"
              onChange={(event) => {
                const files = event.currentTarget.files;
                if (files && files.length > 0) {
                  void chatViewModel.addAttachmentsFromFiles(files);
                }
                event.currentTarget.value = "";
              }}
            />
          </footer>
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

      <dialog ref={dialogRef} className="settings-dialog">
        <form method="dialog" className="settings-card">
          <div className="settings-header">
            <div className="settings-title">{chatViewModel.t("settings")}</div>
            <button
              className="icon-btn"
              title={chatViewModel.t("close")}
              value="cancel"
              onClick={closeSettings}
            >
              <X aria-hidden="true" />
            </button>
          </div>

          <div className="settings-row">
            <label htmlFor="theme-mode">{chatViewModel.t("theme")}</label>
            <select
              id="theme-mode"
              value={draftSettings.theme}
              onChange={(event) =>
                setDraftSettings((prev) => ({
                  ...prev,
                  theme: event.target.value as SettingsDraft["theme"],
                }))
              }
            >
              <option value="system">{chatViewModel.t("themeSystem")}</option>
              <option value="light">{chatViewModel.t("themeLight")}</option>
              <option value="dark">{chatViewModel.t("themeDark")}</option>
            </select>
          </div>

          <div className="settings-row">
            <label htmlFor="send-shortcut">{chatViewModel.t("sendShortcut")}</label>
            <select
              id="send-shortcut"
              value={draftSettings.sendShortcut}
              onChange={(event) =>
                setDraftSettings((prev) => ({
                  ...prev,
                  sendShortcut: event.target.value as SettingsDraft["sendShortcut"],
                }))
              }
            >
              <option value="ctrlEnter">Ctrl/⌘ + Enter</option>
              <option value="shiftEnter">Shift + Enter</option>
              <option value="enter">Enter</option>
            </select>
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
              <button className="btn" type="button" onClick={handleBackupToClipboard}>
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
              <button className="btn" type="button" onClick={handleImportFromClipboard}>
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
            <button className="btn primary" value="default" onClick={saveSettings}>
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
                    <select
                      value={exportFormat}
                      onChange={(event) =>
                        setExportFormat(event.target.value as "json" | "md" | "txt")
                      }
                    >
                      <option value="json">{chatViewModel.t("exportFormatJson")}</option>
                      <option value="md">{chatViewModel.t("exportFormatMd")}</option>
                      <option value="txt">{chatViewModel.t("exportFormatTxt")}</option>
                    </select>
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
    </>
  );
};

export default App;
