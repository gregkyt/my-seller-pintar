import {
  ArticlesResponse,
  V1ErrorResponse,
} from "@/modules/domain/article-domain";
import ArticleRepository from "../../repository/article-repository";
import BaseUseCase from "../base-use-case";

interface IUseArticles {
  queryParam?: Record<string, any>;
  onStart: () => void;
  onSuccess: (data: ArticlesResponse) => void;
  onError?: (error: V1ErrorResponse) => void;
}

export default class UseArticleUsers implements BaseUseCase {
  repository = new ArticleRepository();
  queryParam?: Record<string, any>;
  onStart: () => void;
  onSuccess: (data: ArticlesResponse) => void;
  onError?: (error: V1ErrorResponse) => void;

  constructor({ queryParam, onStart, onSuccess, onError }: IUseArticles) {
    this.queryParam = queryParam;
    this.onStart = onStart;
    this.onSuccess = onSuccess;
    this.onError = onError;
  }

  async execute() {
    this.onStart();
    try {
      const { data } = await this.repository.retrieveArticles(this.queryParam);
      this.onSuccess(data);
    } catch (error) {
      if (typeof this.onError === "function") {
        this.onError(error as V1ErrorResponse);
      }
    }
  }
}
