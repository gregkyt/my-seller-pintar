import { TextareaHTMLAttributes } from "react";
import { Control, Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

type TextEditorProps = {
  name: string;
  label?: string;
  info?: string;
  error?: string;
  control: Control<any>;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;
export default function TextEditor({
  name,
  required,
  label,
  info,
  error,
  control,
}: TextEditorProps) {
  return (
    <div>
      <fieldset className="fieldset">
        {label && (
          <legend className="fieldset-legend text-sm font-medium mb-[-8px]">
            <span className="label-text text-brand-gray-900">{label}</span>
            {required && <span className="label-text text-red-600"> *</span>}
          </legend>
        )}
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <ReactQuill
              className="h-[200px]"
              theme="snow"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {info && <p className="fieldset-label text-black mt-10">{info}</p>}
        {error && <p className="fieldset-label text-error mt-10">{error}</p>}
      </fieldset>
    </div>
  );
}
