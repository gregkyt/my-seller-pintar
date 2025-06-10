import { InputHTMLAttributes, useRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type FileInputProps = {
  file?: File;
  label?: string;
  error?: string;
  info?: string;
  success?: string;
  register: UseFormRegisterReturn;
} & InputHTMLAttributes<HTMLInputElement>;

export default function FileInput({
  required,
  value,
  label,
  error,
  info,
  success,
  placeholder,
  register,
  ...props
}: FileInputProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function onClickButton() {
    if (fileInputRef.current) fileInputRef.current.click();
  }

  const renderInput = () => {
    return (
      <div className="flex items-center gap-2">
        <button type="button" className="btn" onClick={() => onClickButton()}>
          {placeholder}
        </button>
        {value ? <label className="text-sm text-success">{value}</label> : null}
        <input
          {...register}
          ref={(e) => {
            fileInputRef.current = e;
          }}
          className="hidden"
          type="file"
          accept=".png, .jpg, .jpeg"
          {...props}
        />
      </div>
    );
  };

  return (
    <div {...props}>
      <fieldset className="fieldset">
        {label && (
          <legend className="fieldset-legend text-base">
            <span className="label-text text-brand-blue">{label}</span>
            {required && <span className="label-text text-red-600"> *</span>}
          </legend>
        )}
        {renderInput()}
        {info && <p className="fieldset-label text-black">{info}</p>}
        {error && <p className="fieldset-label text-error">{error}</p>}
        {success && <p className="fieldset-label text-success">{success}</p>}
      </fieldset>
    </div>
  );
}
