import {
  CategoriesResponse,
  V1ErrorResponse,
} from "@/modules/domain/category-domain";
import categoryRepository from "../../repository/category-repository";
import BaseUseCase from "../base-use-case";

interface IUseCategories {
  queryParam?: Record<string, any>;
  onStart: () => void;
  onSuccess: (data: CategoriesResponse) => void;
  onError?: (error: V1ErrorResponse) => void;
}

export default class UsecategoryUsers implements BaseUseCase {
  repository = new categoryRepository();
  queryParam?: Record<string, any>;
  onStart: () => void;
  onSuccess: (data: CategoriesResponse) => void;
  onError?: (error: V1ErrorResponse) => void;

  constructor({ queryParam, onStart, onSuccess, onError }: IUseCategories) {
    this.queryParam = queryParam;
    this.onStart = onStart;
    this.onSuccess = onSuccess;
    this.onError = onError;
  }

  async execute() {
    this.onStart();
    try {
      const { data } = await this.repository.retrieveCategories(
        this.queryParam
      );
      this.onSuccess(data);
    } catch (error) {
      if (typeof this.onError === "function") {
        this.onError(error as V1ErrorResponse);
      }
    }
  }
}
