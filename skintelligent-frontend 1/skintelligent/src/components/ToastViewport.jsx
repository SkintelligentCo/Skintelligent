import Toast from "./Toast";

export default function ToastViewport({ toasts, onDismiss, onPause, onResume }) {
  if (!toasts.length) {
    return null;
  }

  return (
    <div className="toast-viewport" aria-label="Notifications">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
          onPause={onPause}
          onResume={onResume}
        />
      ))}
    </div>
  );
}
