"use client";

import { useEffect, useState } from "react";
import Button from "./button";

interface DialogProps {
  id?: string;
  isOpen: boolean;
  title?: string;
  message?: string;
  positiveText?: string;
  negativeText?: string;
  onClose: (isOpen: boolean) => void;
  onPositiveAction?: () => void;
  onNegativeAction?: () => void;
}

export default function Dialog(props: DialogProps) {
  const {
    id,
    isOpen,
    title,
    message,
    positiveText,
    negativeText,
    onClose,
    onPositiveAction,
    onNegativeAction,
  } = props;

  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <dialog id={id} className={`modal ${open ? "modal-open" : ""}`} open={open}>
      <div className="modal-box h-fit">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="py-2">{message}</p>
        <div className="modal-action">
          <form className="flex gap-2" method="dialog">
            {negativeText && (
              <Button
                className="!text-brand-slate-900 bg-white"
                label={negativeText}
                onClick={() => {
                  onClose(!open);
                  if (onNegativeAction) onNegativeAction();
                }}
              />
            )}
            <Button
              className="text-white bg-brand-blue-600"
              label={positiveText}
              onClick={() => {
                onClose(!open);
                if (onPositiveAction) onPositiveAction();
              }}
            />
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button
          onClick={() => {
            onClose(!open);
            setOpen(!open);
          }}
        ></button>
      </form>
    </dialog>
  );
}
