import {
  CategoryPayload,
  CategoryResponse,
  V1ErrorResponse,
} from "@/modules/domain/category-domain";
import CategoryRepository from "../../repository/category-repository";
import BaseUseCase from "../base-use-case";

interface IUsePutCategory {
  id: string;
  payload: CategoryPayload;
  onStart: () => void;
  onSuccess: (data: CategoryResponse) => void;
  onError?: (error: V1ErrorResponse) => void;
}

export default class UsePutCategory implements BaseUseCase {
  repository = new CategoryRepository();
  id: string;
  payload: CategoryPayload;
  onStart: () => void;
  onSuccess: (data: CategoryResponse) => void;
  onError?: (error: V1ErrorResponse) => void;

  constructor({ id, payload, onStart, onSuccess, onError }: IUsePutCategory) {
    this.id = id;
    this.payload = payload;
    this.onStart = onStart;
    this.onSuccess = onSuccess;
    this.onError = onError;
  }

  async execute() {
    this.onStart();
    try {
      const { data } = await this.repository.updateCategory(
        this.id,
        this.payload
      );
      this.onSuccess(data);
    } catch (error) {
      if (typeof this.onError === "function") {
        this.onError(error as V1ErrorResponse);
      }
    }
  }
}
