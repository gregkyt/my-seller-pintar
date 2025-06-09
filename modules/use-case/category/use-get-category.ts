import {
  CategoryResponse,
  V1ErrorResponse,
} from "@/modules/domain/category-domain";
import categoryRepository from "../../repository/category-repository";
import BaseUseCase from "../base-use-case";

interface IUseGetcategory {
  id: string;
  onStart: () => void;
  onSuccess: (data: CategoryResponse) => void;
  onError?: (error: V1ErrorResponse) => void;
}

export default class UseGetcategory implements BaseUseCase {
  repository = new categoryRepository();
  id: string;
  onStart: () => void;
  onSuccess: (data: CategoryResponse) => void;
  onError?: (error: V1ErrorResponse) => void;

  constructor({ id, onStart, onSuccess, onError }: IUseGetcategory) {
    this.id = id;
    this.onStart = onStart;
    this.onSuccess = onSuccess;
    this.onError = onError;
  }

  async execute() {
    this.onStart();
    try {
      const { data } = await this.repository.retrieveCategory(this.id);
      this.onSuccess(data);
    } catch (error) {
      if (typeof this.onError === "function") {
        this.onError(error as V1ErrorResponse);
      }
    }
  }
}
