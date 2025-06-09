import { InputHTMLAttributes, useRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

// interface FileInputProps {
//   id?: string | undefined;
//   className?: string;
//   label?: string;
//   isRequired?: boolean;
//   file?: File;
//   placeholder?: string;
//   error?: string;
//   info?: string;
//   success?: string;
//   onChangeFile?: (file: File) => void;
// }

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
  file,
  label,
  error,
  info,
  success,
  placeholder,
  register,
  ...props
}: FileInputProps) {
  // const {
  //   id,
  //   className,
  //   label,
  //   isRequired,
  //   file,
  //   placeholder,
  //   error,
  //   info,
  //   success,
  //   onChangeFile,
  // } = props;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function onClickButton() {
    if (fileInputRef.current) fileInputRef.current.click();
  }

  const renderInput = () => {
    return (
      <div className="flex items-center gap-2">
        <button className="btn" onClick={() => onClickButton()}>
          {placeholder}
        </button>
        {file ? <label className="text-sm">{file.name}</label> : null}
        <input
          ref={fileInputRef}
          // ref={(e) => {
          //   fileInputRef.current = e;
          //   register.ref(e);
          // }}
          className="hidden"
          type="file"
          accept=".png, .jpg, .jpeg"
          {...register}
          {...props}
          // onChange={(e) => {
          //   if (e.target.files) {
          //     if (onChangeFile) onChangeFile(e.target.files[0]);
          //   }
          // }}
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
