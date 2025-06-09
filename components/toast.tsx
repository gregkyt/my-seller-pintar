import { useEffect, useState } from "react";

export interface ToastData {
  text: string;
  type: ToastType;
}

export enum ToastType {
  INFO,
  WARNING,
  SUCCESS,
  ERROR,
}

interface ToastProps {
  isOpen: boolean;
  timeout?: number | undefined;
  text?: string;
  type: ToastType;
  onHide: () => void;
}

export default function Toast({ timeout = 2500, ...props }: ToastProps) {
  const { isOpen, type, text, onHide } = props;

  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
    if (isOpen) {
      const timer = setTimeout(() => {
        onHide();
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [isOpen, timeout]);

  const toastStyle = () => {
    switch (type) {
      case ToastType.INFO:
        return "alert-info";
      case ToastType.WARNING:
        return "alert-warning";
      case ToastType.SUCCESS:
        return "alert-success";
      default:
        return "alert-error";
    }
  };

  return (
    open &&
    text && (
      <div className={`toast toast-top toast-end z-20`}>
        <div className={`alert ${toastStyle()}`}>
          <span>{text}</span>
        </div>
      </div>
    )
  );
}
