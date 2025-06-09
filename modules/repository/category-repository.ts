import { api } from "@/plugins/axios";
import { toQueryParam } from "@/utils/utils";
import {
  CategoriesResponse,
  CategoryPayload,
  CategoryResponse,
  CreateCategoryResponse,
  UpdateCategoryResponse,
} from "../domain/category-domain";

export default class CategoryRepository {
  async retrieveCategories(queryParam?: Record<string, any>) {
    return api.get<CategoriesResponse>(
      `/categories?${toQueryParam(queryParam)}`
    );
  }

  async retrieveCategory(id: string) {
    return api.get<CategoryResponse>(`/categories/${id}`);
  }

  async createCategory(payload: CategoryPayload) {
    return api.post<CreateCategoryResponse>(`/categories`, payload);
  }

  async updateCategory(id: string, payload: CategoryPayload) {
    return api.put<UpdateCategoryResponse>(`/categories/${id}`, payload);
  }
}
