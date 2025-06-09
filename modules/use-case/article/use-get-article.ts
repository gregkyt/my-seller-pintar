import {
  ArticleResponse,
  V1ErrorResponse,
} from "@/modules/domain/article-domain";
import ArticleRepository from "../../repository/article-repository";
import BaseUseCase from "../base-use-case";

interface IUseGetArticle {
  id: string;
  onStart: () => void;
  onSuccess: (data: ArticleResponse) => void;
  onError?: (error: V1ErrorResponse) => void;
}

export default class UseGetArticle implements BaseUseCase {
  repository = new ArticleRepository();
  id: string;
  onStart: () => void;
  onSuccess: (data: ArticleResponse) => void;
  onError?: (error: V1ErrorResponse) => void;

  constructor({ id, onStart, onSuccess, onError }: IUseGetArticle) {
    this.id = id;
    this.onStart = onStart;
    this.onSuccess = onSuccess;
    this.onError = onError;
  }

  async execute() {
    this.onStart();
    try {
      const { data } = await this.repository.retrieveArticle(this.id);
      this.onSuccess(data);
    } catch (error) {
      if (typeof this.onError === "function") {
        this.onError(error as V1ErrorResponse);
      }
    }
  }
}
