"use client";

import { Cookies } from "@/constants/cookie";
import { createArticleStore } from "@/stores/article-store";
import { createAuthStore } from "@/stores/auth-store";
import { createCategoryStore } from "@/stores/category-store";
import { deleteCookie } from "cookies-next";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "./button";

export default function NavBar() {
  const { logout, resetAll: resetAllAuth } = createAuthStore();
  const { resetAll: resetAllArticle } = createArticleStore();
  const { resetAll: resetAllCategory } = createCategoryStore();

  const router = useRouter();

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
    return (
      <div className="navbar-start">
        <label htmlFor="my-drawer" className="btn btn-ghost drawer-button">
          <Menu className="w-6 h-6" tabIndex={0} color="#000000" />
        </label>
      </div>
    );
  };

  const renderRightContent = () => {
    return (
      <div className="navbar-end">
        <Button label="Logout" onClick={onLogout} />
      </div>
    );
  };

  return (
    <div className="navbar sticky bg-brand-blue">
      {renderLeftContent()}
      {renderRightContent()}
    </div>
  );
}
