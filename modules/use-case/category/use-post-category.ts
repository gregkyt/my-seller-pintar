import {
  CategoryPayload,
  CategoryResponse,
  V1ErrorResponse,
} from "@/modules/domain/category-domain";
import CategoryRepository from "../../repository/category-repository";
import BaseUseCase from "../base-use-case";

interface IUsePostCategory {
  payload: CategoryPayload;
  onStart: () => void;
  onSuccess: (data: CategoryResponse) => void;
  onError?: (error: V1ErrorResponse) => void;
}

export default class UsePostCategory implements BaseUseCase {
  repository = new CategoryRepository();
  payload: CategoryPayload;
  onStart: () => void;
  onSuccess: (data: CategoryResponse) => void;
  onError?: (error: V1ErrorResponse) => void;

  constructor({ payload, onStart, onSuccess, onError }: IUsePostCategory) {
    this.payload = payload;
    this.onStart = onStart;
    this.onSuccess = onSuccess;
    this.onError = onError;
  }

  async execute() {
    this.onStart();
    try {
      const { data } = await this.repository.createCategory(this.payload);
      this.onSuccess(data);
    } catch (error) {
      if (typeof this.onError === "function") {
        this.onError(error as V1ErrorResponse);
      }
    }
  }
}
