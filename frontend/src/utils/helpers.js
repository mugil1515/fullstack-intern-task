export const formatCurrency = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);

export const formatDate = (date) =>
  new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date(date));

export const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const truncate = (text, length = 100) =>
  text?.length > length ? text.slice(0, length) + "..." : text;

export const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";
