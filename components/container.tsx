import NavBar from "@/components/nav-bar";
import { Cookies } from "@/constants/cookie";
import { cookies, headers } from "next/headers";
import { useMemo } from "react";

interface Menu {
  id: string;
  label: string;
}

export default function Container({ children }: { children: React.ReactNode }) {
  const cookiesStore = cookies();
  const profileStr = cookiesStore.get(Cookies.profile || "")?.value;
  const profile = JSON.parse(profileStr || "");

  const headersList = headers();
  const pathname = headersList.get("x-url") || "";

  const allMenu: Menu[] = [
    { id: "/articles", label: "Articles" },
    { id: "/categories", label: "Categories" },
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
    const urls = pathname.split("/");
    const selectedMenu = `/${urls[3]}`;

    return menu.map((item, index) => {
      return (
        <li key={index}>
          <a
            className={`hover:text-brand-blue hover:bg-white ${
              // selectedMenu === item.id ? "font-bold" : ""
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
        <ul className="menu bg-white text-base min-h-full w-56 p-2">
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
        <NavBar />
        <div className={`bg-white`}>{children}</div>
      </div>
      <div className="drawer-side">{renderSideMenu()}</div>
    </div>
  );
}
