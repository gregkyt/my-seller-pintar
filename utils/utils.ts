import { createAuthStore } from "@/stores/auth-store";

function toQueryParam(query?: Record<string, any>) {
  if (query === undefined || query === null) return "";
  const params = new URLSearchParams(query);
  return params.toString();
}

const isAdmin = () => {
  const { profileData } = createAuthStore();
  return profileData?.role?.toLocaleLowerCase() === "admin";
};

export { isAdmin, toQueryParam };
