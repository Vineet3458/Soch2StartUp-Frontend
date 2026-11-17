// Tiny pub/sub so any module can show a toast without prop drilling
let items = [];
let id = 0;
const subs = new Set();
const emit = () => subs.forEach((f) => f(items));

export const toastStore = {
  subscribe: (f) => { subs.add(f); return () => subs.delete(f); },
  get: () => items,
  dismiss: (i) => { items = items.filter((t) => t.id !== i); emit(); },
};

const push = (type, title, message = "", opts = {}) => {
  const t = { id: ++id, type, title, message, link: opts.link };
  items = [...items.slice(-3), t];
  emit();
  setTimeout(() => toastStore.dismiss(t.id), opts.duration || 4500);
};

export const toast = {
  success: (t, m, o) => push("success", t, m, o),
  error: (t, m, o) => push("error", t, m, o),
  info: (t, m, o) => push("info", t, m, o),
  warning: (t, m, o) => push("warning", t, m, o),
};
