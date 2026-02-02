export type LangKey = "zh-CN" | "en-US";

export const I18N: Record<LangKey, Record<string, string>> = {
  "zh-CN": {
    language: "语言",
    newChat: "新建对话",
    defaultTitle: "新对话",
    rename: "重命名",
    delete: "删除",
    send: "发送",
    inputPlaceholder: "输入内容，按 Ctrl/⌘ + Enter 发送",
    statusStreaming: "模型输出中...",
    statusError: "发生错误：",
    editMessage: "编辑消息",
    editCancel: "取消",
    editSave: "保存",
    confirm: "确定",
    cancel: "取消",
    settings: "设置",
    close: "关闭",
    sendShortcut: "发送快捷键",
    templateChat: "系统提示词",
    templateTitle: "标题总结模板",
    save: "保存",
    hintChat: "可用变量：{date} {language}",
    hintTitle: "可用变量：{date} {language} {user} {assistant}",
    roleUser: "用户",
    roleAssistant: "助手",
    locale: "zh-CN",
  },
  "en-US": {
    language: "Language",
    newChat: "New Chat",
    defaultTitle: "New Chat",
    rename: "Rename",
    delete: "Delete",
    send: "Send",
    inputPlaceholder: "Type here, press Ctrl/⌘ + Enter to send",
    statusStreaming: "Model is responding...",
    statusError: "Error: ",
    editMessage: "Edit Message",
    editCancel: "Cancel",
    editSave: "Save",
    confirm: "Confirm",
    cancel: "Cancel",
    settings: "Settings",
    close: "Close",
    sendShortcut: "Send Shortcut",
    templateChat: "System Prompt",
    templateTitle: "Title Summary Template",
    save: "Save",
    hintChat: "Available variables: {date} {language}",
    hintTitle: "Available variables: {date} {language} {user} {assistant}",
    roleUser: "User",
    roleAssistant: "Assistant",
    locale: "en-US",
  },
};

export const DEFAULT_LANG: LangKey = "zh-CN";

export function t(lang: LangKey, key: string): string {
  return I18N[lang]?.[key] || I18N["en-US"][key] || key;
}

export function formatDate(lang: LangKey, ts: number): string {
  const locale = I18N[lang]?.locale || "en-US";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(ts));
}

export function today(lang: LangKey): string {
  return formatDate(lang, Date.now());
}
