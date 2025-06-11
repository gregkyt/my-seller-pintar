import { Cookies } from "@/constants/cookie";
import { FileText, Tag } from "lucide-react";
import { cookies, headers } from "next/headers";
import Image from "next/image";
import { ReactNode, useMemo } from "react";
import NavBar from "./nav-bar";

interface Menu {
  id: string;
  icon: ReactNode;
  label: string;
}

export default function Container({ children }: { children: React.ReactNode }) {
  const cookiesStore = cookies();
  const profileStr = cookiesStore.get(Cookies.profile || "")?.value;
  const profile = JSON.parse(profileStr || "");

  const headersList = headers();
  const pathname = headersList.get("x-url") || "";

  const allMenu: Menu[] = [
    { id: "/admin/articles", icon: <FileText />, label: "Articles" },
    { id: "/admin/categories", icon: <Tag />, label: "Categories" },
  ];

  const userMenu = () => {
    return [allMenu[0]];
  };

  const adminMenu = () => {
    return [...allMenu];
  };

  const menu: Menu[] = useMemo(() => {
    if (profile) {
      if (profile.role?.toLocaleLowerCase() === "user") return userMenu();
      else return adminMenu();
    }
    return [];
  }, []);

  const renderMenu = () => {
    return menu.map((item, index) => {
      return (
        <li key={index}>
          <a
            className={`hover:text-brand-slate-900 hover:bg-white text-white ${
              pathname.includes(item.id) ? "font-bold" : ""
            }`}
            href={item.id}
          >
            {item.label}
          </a>
        </li>
      );
    });
  };

  const renderSideMenu = () => {
    return (
      <>
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        <div className="w-full bg-brand-blue-600 p-4">
          <Image
            src="/logo_ipsum.png"
            width={122}
            height={22}
            alt="logo_ipsum"
          />
        </div>
        <ul className="menu bg-brand-blue-600 text-base min-h-full w-56 p-2">
          {renderMenu()}
        </ul>
      </>
    );
  };

  return (
    <div className={`drawer drawer-mobile md:drawer-open`}>
      <input
        id="my-drawer"
        type="checkbox"
        defaultChecked={false}
        className="drawer-toggle"
      />
      <div className="drawer-content">
        <NavBar isAdmin />
        <div className={`bg-white`}>{children}</div>
      </div>
      <div className="drawer-side">{renderSideMenu()}</div>
    </div>
  );
}
