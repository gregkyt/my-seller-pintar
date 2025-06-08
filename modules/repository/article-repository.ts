import { api } from "@/plugins/axios";
import {
  ArticlePayload,
  ArticleResponse,
  ArticlesResponse,
  CreateArticleResponse,
} from "../domain/article-domain";
import { RegisterResponse } from "../domain/auth-domain";

export default class ArticleRepository {
  async retrieveArticles() {
    return api.get<ArticlesResponse>(`/articles`);
  }

  async retrieveArticle(id: string) {
    return api.get<ArticleResponse>(`/articles/${id}`);
  }

  async createArticle(payload: ArticlePayload) {
    return api.post<CreateArticleResponse>(`/articles`, payload);
  }

  async updateArticle(id: string, payload: ArticlePayload) {
    return api.put<RegisterResponse>(`/articles/${id}`, payload);
  }
}
