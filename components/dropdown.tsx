"use client";

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
    console.log("here");
    setIsOpen(true);
    setText(text);
    setSuggestions(data);
  }

  const renderAutoComplete = () => {
    return (
      <>
        <div className={`dropdown`}>
          <input
            tabIndex={0}
            role="button"
            type="text"
            readOnly
            className={`input input-bordered bg-white text-brand-blue "disabled:bg-brand-light-gray disabled:border-brand-light-gray" ${
              error && "input-error"
            }`}
            onFocus={() => onChangeText(text)}
            value={value}
            {...register}
            {...props}
          />
          {isOpen && (
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              {suggestions.map((item, index) => {
                return (
                  <li key={index}>
                    <a
                      className="text-brand-blue"
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
      </>
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
          <legend className="fieldset-legend text-base">
            <span className="label-text text-brand-blue">{label}</span>
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
