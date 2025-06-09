import {
  UploadResponse,
  V1ErrorResponse,
} from "@/modules/domain/upload-domain";
import UserRepository from "../../repository/upload-repository";
import BaseUseCase from "../base-use-case";

interface IUsePostUpload {
  file: File;
  onStart: () => void;
  onSuccess: (data: UploadResponse) => void;
  onError?: (error: V1ErrorResponse) => void;
}

export default class UsePostUpload implements BaseUseCase {
  repository = new UserRepository();
  file: File;
  onStart: () => void;
  onSuccess: (data: UploadResponse) => void;
  onError?: (error: V1ErrorResponse) => void;

  constructor({ file, onStart, onSuccess, onError }: IUsePostUpload) {
    this.file = file;
    this.onStart = onStart;
    this.onSuccess = onSuccess;
    this.onError = onError;
  }

  async execute() {
    this.onStart();
    try {
      const { data } = await this.repository.upload(this.file);
      this.onSuccess(data);
    } catch (error) {
      if (typeof this.onError === "function") {
        this.onError(error as V1ErrorResponse);
      }
    }
  }
}
