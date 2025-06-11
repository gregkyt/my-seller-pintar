import { Eye, EyeOff } from "lucide-react";
import { HTMLInputTypeAttribute, InputHTMLAttributes, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type TextInputProps = {
  label?: string;
  info?: string;
  error?: string;
  register: UseFormRegisterReturn;
} & InputHTMLAttributes<HTMLInputElement>;

export default function TextInput({
  required,
  type,
  label,
  info,
  error,
  register,
  ...props
}: TextInputProps) {
  const [inputType, setInputType] =
    useState<HTMLInputTypeAttribute>("password");
  const [isShow, setIsShow] = useState(false);

  function onEye(value: HTMLInputTypeAttribute) {
    setIsShow(value === "text");
    setInputType(value);
  }

  const renderPassword = () => {
    return (
      <div
        className={`w-full input input-bordered text-brand-gray-900 bg-white flex items-center gap-2 ${
          error && "input-error"
        }`}
      >
        <input type={inputType} {...register} {...props} />
        {isShow ? (
          <Eye
            className="w-4 h-4"
            color="#475569"
            onClick={() => onEye("password")}
          />
        ) : (
          <EyeOff
            className="w-4 h-4"
            color="#475569"
            onClick={() => {
              onEye("text");
            }}
          />
        )}
      </div>
    );
  };

  const renderInput = () => {
    return (
      <input
        className={`w-full input input-bordered text-brand-gray-900 bg-white ${
          error && "input-error"
        }`}
        {...register}
        {...props}
      />
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
        {type === "password" ? renderPassword() : renderInput()}
        {info && <p className="fieldset-label text-black">{info}</p>}
        {error && <p className="fieldset-label text-error">{error}</p>}
      </fieldset>
    </div>
  );
}
