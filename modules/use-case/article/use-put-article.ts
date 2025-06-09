import {
  ArticlePayload,
  ArticleResponse,
  V1ErrorResponse,
} from "@/modules/domain/article-domain";
import ArticleRepository from "../../repository/article-repository";
import BaseUseCase from "../base-use-case";

interface IUsePutArticle {
  id: string;
  payload: ArticlePayload;
  onStart: () => void;
  onSuccess: (data: ArticleResponse) => void;
  onError?: (error: V1ErrorResponse) => void;
}

export default class UsePutArticle implements BaseUseCase {
  repository = new ArticleRepository();
  id: string;
  payload: ArticlePayload;
  onStart: () => void;
  onSuccess: (data: ArticleResponse) => void;
  onError?: (error: V1ErrorResponse) => void;

  constructor({ id, payload, onStart, onSuccess, onError }: IUsePutArticle) {
    this.id = id;
    this.payload = payload;
    this.onStart = onStart;
    this.onSuccess = onSuccess;
    this.onError = onError;
  }

  async execute() {
    this.onStart();
    try {
      const { data } = await this.repository.updateArticle(
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
