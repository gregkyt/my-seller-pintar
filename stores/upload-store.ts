import { FetchStatus } from "@/constants/fetch-status";
import { UploadResponse } from "@/modules/domain/upload-domain";
import UsePostUpload from "@/modules/use-case/upload/use-post-upload";
import { create } from "zustand";

export type UploadState = {
  uploadData?: UploadResponse;

  fetchStatusPage: FetchStatus;
  fetchStatusButton: FetchStatus;
  message: string;
};

export type UploadActions = {
  upload: (file: File) => void;

  setFetchStatusPage: (fetchStatus: FetchStatus) => void;
  setFetchStatusButton: (fetchStatus: FetchStatus) => void;
};

export type UploadStore = UploadState & UploadActions;

export const defaultInitStore: UploadState = {
  fetchStatusPage: FetchStatus.IDLE,
  fetchStatusButton: FetchStatus.IDLE,
  message: "",
};

export const createUploadStore = create<UploadStore>()((set) => ({
  ...defaultInitStore,
  upload: (file: File) => {
    new UsePostUpload({
      file: file,
      onStart: () => {
        set(() => ({
          fetchStatusButton: FetchStatus.LOADING,
          message: undefined,
        }));
      },
      onSuccess: (data) => {
        set(() => ({
          uploadData: data,
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
