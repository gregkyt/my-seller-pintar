import { ButtonHTMLAttributes, ReactNode } from "react";

export enum IconPosition {
  RIGHT,
  LEFT,
}

type ButtonProps = {
  label?: string;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  className,
  children,
  label,
  icon,
  iconPosition,
  disabled,
  isLoading,
  ...props
}: ButtonProps) {
  const loadingSize = () => {
    let selectIndex = 0;
    const sizes: string[] = ["xs", "sm", "md", "lg", "xl", "2xl"];
    if (className === undefined) return "loading-md";
    sizes.map((size, index) => {
      if (className?.includes(size)) {
        selectIndex = index;
      }
    });

    return `loading-${sizes[selectIndex]}`;
  };

  const renderContent = () => {
    if (isLoading) {
      return <span className={`loading loading-dots ${loadingSize()}`}></span>;
    } else {
      return renderChildren();
    }
  };

  const renderChildren = () => {
    if (children) {
      return children;
    } else {
      return (
        <div
          className={`flex items-center gap-1 ${
            iconPosition === IconPosition.LEFT ? "flex-row" : "flex-row-reverse"
          }`}
        >
          {icon}
          {label}
        </div>
      );
    }
  };

  const combinedClassName = () => {
    if (className) return `${className}`;
    return "";
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`btn bg-brand-blue-600 text-white rounded-md ${combinedClassName()}`}
      {...props}
    >
      {renderContent()}
    </button>
  );
}
