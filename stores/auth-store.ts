import { Cookies } from "@/constants/cookie";
import { FetchStatus } from "@/constants/fetch-status";
import { LocalStorage } from "@/constants/local-storage";
import {
  LoginPayload,
  LoginResponse,
  ProfileResponse,
  RegisterPayload,
  RegisterResponse,
} from "@/modules/domain/auth-domain";
import UseGetProfile from "@/modules/use-case/auth/use-get-profile";
import { default as UseLogin } from "@/modules/use-case/auth/use-login";
import UseRegister from "@/modules/use-case/auth/use-register";
import { setCookie } from "cookies-next";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthState = {
  loginData?: LoginResponse;
  registerData?: RegisterResponse;
  profileData?: ProfileResponse;

  fetchStatusPage: FetchStatus;
  fetchStatusButton: FetchStatus;
  message: string;
};

export type AuthActions = {
  login: (payload: LoginPayload) => void;
  register: (payload: RegisterPayload) => void;
  getProfile: () => void;
  logout: (onSuccess: () => void) => void;

  resetAll: () => void;
  setFetchStatusPage: (fetchStatus: FetchStatus) => void;
  setFetchStatusButton: (fetchStatus: FetchStatus) => void;
};

export type AuthStore = AuthState & AuthActions;

export const defaultInitStore: AuthState = {
  fetchStatusPage: FetchStatus.IDLE,
  fetchStatusButton: FetchStatus.IDLE,
  message: "",
};

export const createAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...defaultInitStore,
      login: (body) => {
        new UseLogin({
          payload: body,
          onStart: () => {
            set(() => ({
              fetchStatusButton: FetchStatus.LOADING,
              message: undefined,
            }));
          },
          onSuccess: (data) => {
            const currentState = createAuthStore.getState();
            setCookie(Cookies.token, data.token ?? "");
            set(() => ({
              loginData: data,
            }));
            currentState.getProfile();
          },
          onError: (error) => {
            set(() => ({
              message: error.error,
              fetchStatusButton: FetchStatus.ERROR,
            }));
          },
        }).execute();
      },
      logout: (onSuccess) => {
        localStorage.removeItem(LocalStorage.auth);
        localStorage.removeItem(LocalStorage.articles);
        localStorage.removeItem(LocalStorage.categories);
        onSuccess();
      },
      register: (body) => {
        const currentState = createAuthStore.getState();
        new UseRegister({
          payload: body,
          onStart: () => {
            set(() => ({
              fetchStatusButton: FetchStatus.LOADING,
              message: undefined,
            }));
          },
          onSuccess: (data) => {
            set(() => ({
              registerData: data,
            }));
            const payload = {
              username: data.username,
              password: body.password,
            };
            currentState.login(payload);
          },
          onError: (error) => {
            set(() => ({
              message: error.error,
              fetchStatusButton: FetchStatus.ERROR,
            }));
          },
        }).execute();
      },
      getProfile: () => {
        new UseGetProfile({
          onStart: () => {
            set(() => ({
              fetchStatusButton: FetchStatus.LOADING,
              message: undefined,
            }));
          },
          onSuccess: (data) => {
            setCookie(Cookies.profile, JSON.stringify(data));
            set(() => ({
              profileData: data,
              fetchStatusButton: FetchStatus.SUCCESS,
            }));
          },
          onError: (error) => {
            set(() => ({
              message: error.error,
              fetchStatusButton: FetchStatus.ERROR,
            }));
          },
        }).execute();
      },
      resetAll() {
        set(() => ({
          ...defaultInitStore,
        }));
      },
      setFetchStatusPage(fetchStatusPage) {
        set((state) => ({
          fetchStatusPage: fetchStatusPage,
          message: fetchStatusPage === FetchStatus.IDLE ? "" : state.message,
        }));
      },
      setFetchStatusButton(fetchStatusButton) {
        set((state) => ({
          fetchStatusButton: fetchStatusButton,
          message: fetchStatusButton === FetchStatus.IDLE ? "" : state.message,
        }));
      },
    }),
    {
      name: LocalStorage.auth,
      partialize: (state) => ({
        loginData: state.loginData,
        profileData: state.profileData,
      }),
    }
  )
);
