import { FetchStatus, LocalStorage } from "@/constants/fetch-status";
import {
  LoginPayload,
  LoginResponse,
  ProfileResponse,
  RegisterPayload,
  RegisterResponse,
  V1ErrorResponse,
} from "@/modules/domain/auth-domain";
import UseGetProfile from "@/modules/use-case/auth/use-get-profile";
import { default as UseLogin } from "@/modules/use-case/auth/use-login";
import UseRegister from "@/modules/use-case/auth/use-register";
import { create } from "zustand";

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

  setFetchStatusPage: (fetchStatus: FetchStatus) => void;
  setFetchStatusButton: (fetchStatus: FetchStatus) => void;
};

export type AuthStore = AuthState & AuthActions;

export const defaultAuthStore = (): AuthState => {
  return {
    fetchStatusPage: FetchStatus.IDLE,
    fetchStatusButton: FetchStatus.IDLE,
    message: "",
  };
};

export const createAuthStore = create<AuthStore>()((set) => ({
  ...defaultAuthStore(),
  login: (body: LoginPayload) => {
    new UseLogin({
      payload: body,
      onStart: () => {
        set(() => ({
          fetchStatusButton: FetchStatus.LOADING,
          message: undefined,
        }));
      },
      onSuccess: (data: LoginResponse) => {
        localStorage.setItem(LocalStorage.token, data.token ?? "");
        set(() => ({
          loginData: data,
          fetchStatusButton: FetchStatus.SUCCESS,
        }));
      },
      onError: (error: V1ErrorResponse) => {
        set(() => ({
          message: error.error ?? "",
          fetchStatusButton: FetchStatus.ERROR,
        }));
      },
    }).execute();
  },
  register: (body: RegisterPayload) => {
    const currentState = createAuthStore.getState();
    new UseRegister({
      payload: body,
      onStart: () => {
        set(() => ({
          fetchStatusButton: FetchStatus.LOADING,
          message: undefined,
        }));
      },
      onSuccess: (data: RegisterResponse) => {
        set(() => ({
          registerData: data,
        }));
        const payload = {
          username: data.username,
          password: body.password,
        };
        currentState.login(payload);
      },
      onError: (error: V1ErrorResponse) => {
        set(() => ({
          message: error.error ?? "",
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
      onSuccess: (data: ProfileResponse) => {
        set(() => ({
          profileData: data,
          fetchStatusButton: FetchStatus.SUCCESS,
        }));
      },
      onError: (error: V1ErrorResponse) => {
        set(() => ({
          message: error.error ?? "",
          fetchStatusButton: FetchStatus.ERROR,
        }));
      },
    }).execute();
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
}));
