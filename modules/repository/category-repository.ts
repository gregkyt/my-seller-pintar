import { api } from "@/plugins/axios";
import { RegisterResponse } from "../domain/auth-domain";
import {
  CategoriesResponse,
  CategoryPayload,
  CategoryResponse,
  CreateCategoryResponse,
} from "../domain/category-domain";

export default class CategoryRepository {
  async retrieveCategories() {
    return api.get<CategoriesResponse>(`/categories`);
  }

  async retrieveCategory(id: string) {
    return api.get<CategoryResponse>(`/categories/${id}`);
  }

  async createCategory(payload: CategoryPayload) {
    return api.post<CreateCategoryResponse>(`/categories`, payload);
  }

  async updateCategory(id: string, payload: CategoryPayload) {
    return api.put<RegisterResponse>(`/categories/${id}`, payload);
  }
}
