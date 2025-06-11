"use client";

import { ChevronDown } from "lucide-react";
import { InputHTMLAttributes, useEffect, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

export type DropdownType = { id: string; value: string };

export function getDropdownData(data: Record<string, any>[]) {
  const dropdownData: DropdownType[] = [];
  if (data === undefined) return dropdownData;
  else {
    for (const item of data) {
      dropdownData.push({ id: item.id, value: item.name ?? item.text });
    }
    return dropdownData;
  }
}

type DropdownProps = {
  label?: string;
  info?: string;
  error?: string;
  register: UseFormRegisterReturn;
  data: DropdownType[];
} & InputHTMLAttributes<HTMLInputElement>;

export default function Dropdown({
  required,
  label,
  info,
  error,
  value,
  register,
  data,
  ...props
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [suggestions, setSuggestions] = useState<DropdownType[]>([]);

  useEffect(() => {
    if (typeof value === "string") {
      if (["", null, undefined].includes(value)) setText("");
      else setText(data.find((item) => item.id === value)?.value || "");
    }
  }, [value]);

  function onChangeText(text: string) {
    setIsOpen(true);
    setText(text);
    setSuggestions(data);
  }

  const renderAutoComplete = () => {
    return (
      <div>
        <div className="dropdown w-full">
          <div className="flex items-center w-full relative">
            <input
              tabIndex={0}
              role="button"
              type="text"
              readOnly
              className={`w-full input input-bordered text-brand-gray-900 bg-white "disabled:bg-brand-light-gray disabled:border-brand-light-gray" ${
                error && "input-error"
              }`}
              onFocus={() => onChangeText(text)}
              value={value}
              {...register}
              {...props}
            />
            <ChevronDown
              className={`
                absolute right-3 top-1/2 -translate-y-1/2
                h-4 w-4 transition-transform duration-300
                ${isOpen ? "rotate-180" : "rotate-0"}
              `}
            />
          </div>

          {isOpen && (
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-10 w-full p-2 shadow-sm max-h-60 overflow-y-auto grid grid-cols-1"
            >
              {suggestions.map((item, index) => {
                return (
                  <li key={index}>
                    <a
                      className="text-brand-gray-900"
                      onClick={() => {
                        setText(item.value);
                        setIsOpen(false);
                        props.onChange?.({
                          target: { value: item.id },
                        } as any);
                      }}
                    >
                      {item.value}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    );
  };

  return (
    <div {...props}>
      <fieldset
        className="fieldset"
        onBlur={() => {
          setTimeout(() => {
            const element = document.getElementById(label ?? "");
            element?.removeAttribute("open");
          }, 200);
        }}
      >
        {label && (
          <legend className="fieldset-legend text-sm font-medium mb-[-8px]">
            <span className="label-text text-brand-gray-900">{label}</span>
            {required && <span className="label-text text-red-600"> *</span>}
          </legend>
        )}
        {renderAutoComplete()}
        {info && <p className="fieldset-label text-black">{info}</p>}
        {error && <p className="fieldset-label text-error">{error}</p>}
      </fieldset>
    </div>
  );
}
