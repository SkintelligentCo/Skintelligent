export function formatApiError(error, fallback = "Something went wrong.") {
  if (!error) {
    return "";
  }
  return error.message || fallback;
}

export function formatDateTime(dateString) {
  if (!dateString) {
    return "";
  }
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));
}
