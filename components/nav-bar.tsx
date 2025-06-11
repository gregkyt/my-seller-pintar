"use client";

import { Cookies } from "@/constants/cookie";
import { createArticleStore } from "@/stores/article-store";
import { createAuthStore } from "@/stores/auth-store";
import { createCategoryStore } from "@/stores/category-store";
import { deleteCookie } from "cookies-next";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { HTMLAttributes, useState } from "react";
import Dialog from "./dialog";

type NavBarProps = {
  isAdmin?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export default function NavBar({ isAdmin, className, ...props }: NavBarProps) {
  const { profileData, logout, resetAll: resetAllAuth } = createAuthStore();
  const { resetAll: resetAllArticle } = createArticleStore();
  const { resetAll: resetAllCategory } = createCategoryStore();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const router = useRouter();
  const pathname = usePathname();

  const accounts = [
    {
      icon: undefined,
      value: "My Profile",
    },
    {
      icon: <LogOut color="#EF4444" className="h-4 w-4" />,
      value: "Logout",
      onAction: onSetDialog,
    },
  ];

  const initialName = () => {
    const name = profileData?.username || "";
    let initialName: string = "";
    const firstName = name.split(" ")[0];
    const lastName = name.split(" ")[1];
    initialName = `${firstName.substring(0, 1)}`;

    if (lastName) {
      initialName += `${lastName.substring(0, 1)}`;
    }
    return initialName;
  };

  function onSetDialog() {
    setIsDialogOpen(true);
  }

  function onLogout() {
    logout(() => {
      deleteCookie(Cookies.token);
      deleteCookie(Cookies.profile);
      resetAllArticle();
      resetAllCategory();
      resetAllAuth();

      router.replace("/");
    });
  }

  const renderLeftContent = () => {
    const path = pathname.split("/").at(-1) ?? "";
    const capitalizePath = path.charAt(0).toUpperCase() + path.slice(1);
    return (
      <div className="navbar-start">
        {isAdmin ? (
          <div className="text-xl font-semibold">{capitalizePath}</div>
        ) : (
          <Image
            src="/logo_ipsum.png"
            width={122}
            height={22}
            alt="logo_ipsum"
          />
        )}
      </div>
    );
  };

  const renderRightContent = () => {
    return (
      <div className="navbar-end gap-4">
        <div className="btn w-8 h-8 rounded-full bg-brand-blue-200 text-brand-blue-900">
          {profileData?.username}
        </div>
        <div className={`dropdown dropdown-end`}>
          <div
            tabIndex={0}
            className={`md:block hidden btn-link ${
              isAdmin ? "!text-brand-slate-900" : "text-white"
            }`}
          >
            {initialName()}
          </div>
          <ul
            tabIndex={0}
            className="menu w-[180px] dropdown-content rounded-md bg-white z-50"
          >
            {accounts.map((account, index) => {
              return (
                <div
                  key={index}
                  className="btn btn-ghost justify-start"
                  onClick={() => {
                    if (account.onAction) account.onAction();
                  }}
                >
                  {account.icon} {account.value}
                </div>
              );
            })}
          </ul>
        </div>
      </div>
    );
  };

  const adminClassName = `px-4 navbar bg-white border-b-[1px] border-brand-slate-200 ${className}`;
  const userClassName = `md:px-14 md:bg-transparent px-4 navbar bg-white ${className}`;

  return (
    <div className={`${isAdmin ? adminClassName : userClassName}`} {...props}>
      {renderLeftContent()}
      {renderRightContent()}
      <Dialog
        isOpen={isDialogOpen}
        title="Logout"
        message="Are you sure want to logout?"
        negativeText="Cancel"
        positiveText="Logout"
        onPositiveAction={() => onLogout()}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
