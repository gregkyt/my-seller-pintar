import { api } from "@/plugins/axios";
import { toQueryParam } from "@/utils/utils";
import {
  ArticlePayload,
  ArticleResponse,
  ArticlesResponse,
  CreateArticleResponse,
  UpdateArticleResponse,
} from "../domain/article-domain";

export default class ArticleRepository {
  async retrieveArticles(queryParam?: Record<string, any>) {
    return api.get<ArticlesResponse>(`/articles?${toQueryParam(queryParam)}`);
  }

  async retrieveArticle(id: string) {
    return api.get<ArticleResponse>(`/articles/${id}`);
  }

  async createArticle(payload: ArticlePayload) {
    return api.post<CreateArticleResponse>(`/articles`, payload);
  }

  async updateArticle(id: string, payload: ArticlePayload) {
    return api.put<UpdateArticleResponse>(`/articles/${id}`, payload);
  }

  async getArticleImage(url: string) {
    return api.get(url);
  }
}
