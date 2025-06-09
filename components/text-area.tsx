import { TextareaHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type TextAreaProps = {
  label?: string;
  info?: string;
  error?: string;
  register: UseFormRegisterReturn;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;
export default function TextArea({
  required,
  label,
  info,
  error,
  register,
  ...props
}: TextAreaProps) {
  return (
    <div>
      <fieldset className="fieldset">
        {label && (
          <legend className="fieldset-legend text-base">
            <span className="label-text text-brand-blue">{label}</span>
            {required && <span className="label-text text-red-600"> *</span>}
          </legend>
        )}
        <textarea
          className={`textarea textarea-bordered bg-white text-brand-blue ${
            error && "textarea-error"
          }`}
          {...register}
          {...props}
        />
        {info && <p className="fieldset-label text-black">{info}</p>}
        {error && <p className="fieldset-label text-error">{error}</p>}
      </fieldset>
    </div>
  );
}
