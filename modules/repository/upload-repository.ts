import { api } from "@/plugins/axios";
import { UploadResponse } from "../domain/upload-domain";

export default class UploadRepository {
  async upload(file: File) {
    const formData = new FormData();
    formData.append("image", file);

    return api.post<UploadResponse>("/upload", formData);
  }
}
