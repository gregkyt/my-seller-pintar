import { ImagePlus } from "lucide-react";
import Image from "next/image";
import { InputHTMLAttributes, useRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type FileInputProps = {
  file?: File;
  label?: string;
  error?: string;
  info?: string;
  success?: string;
  register: UseFormRegisterReturn;
  onDelete?: () => void;
} & InputHTMLAttributes<HTMLInputElement>;

export default function FileInput({
  required,
  value,
  label,
  error,
  info,
  success,
  register,
  onDelete,
  ...props
}: FileInputProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function onClickButton() {
    if (fileInputRef.current) fileInputRef.current.click();
  }

  const renderEmptyFile = () => {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <ImagePlus size={20} />
        <button
          type="button"
          className="btn-ghost underline"
          onClick={onClickButton}
        >
          Click to select files
        </button>
        <div>Support File Type .jpg or .png</div>
      </div>
    );
  };

  const renderImage = (value: string) => {
    return (
      <div className="w-full h-full p-3 flex flex-col">
        <Image
          className="w-full rounded-lg overflow-hidden"
          src={`/api/image?url=${encodeURIComponent(value as string)}`}
          alt="image"
          width={50}
          height={50}
        />
        <div className="flex justify-center items-center gap-3 mt-2">
          <button
            className="btn-link text-brand-blue-600 cursor-pointer"
            type="button"
            onClick={onClickButton}
          >
            Changes
          </button>
          <button
            className="btn-link text-error cursor-pointer"
            type="button"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  const renderInput = () => {
    return (
      <div className="flex items-center gap-2">
        <div className="cursor-pointer h-[163px] w-[223px] border border-brand-slate-200 items-center justify-center rounded-lg border-dashed">
          {value ? renderImage(value as string) : renderEmptyFile()}
        </div>
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
          <legend className="fieldset-legend text-sm font-medium mb-[-8px]">
            <span className="label-text text-brand-gray-900">{label}</span>
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
