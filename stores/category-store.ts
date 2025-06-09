import { FetchStatus } from "@/constants/fetch-status";
import { LocalStorage } from "@/constants/local-storage";
import {
  CategoryData,
  CategoryPayload,
} from "@/modules/domain/category-domain";
import UseGetCategories from "@/modules/use-case/category/use-get-categories";
import UseGetCategory from "@/modules/use-case/category/use-get-category";
import UsePostCategory from "@/modules/use-case/category/use-post-category";
import UsePutCategory from "@/modules/use-case/category/use-put-category";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface QueryParam {
  page: number;
  limit: number;
  title?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: string;
}

export type CategoriesMeta = {
  total?: number;
  page?: number;
  limit?: number;
};

export type CategoryState = {
  category: CategoryData;
  categories: CategoryData[];
  categoriesMeta?: CategoriesMeta;
  categoriesFormData: Record<string, any>;

  createCategoryFormData: Record<string, any>;
  createCategoryErrorData: Record<string, any>;
  updateCategoryFormData: Record<string, any>;
  updateCategoryErrorData: Record<string, any>;

  queryParam: QueryParam;
  fetchStatusPage: FetchStatus;
  fetchStatusButton: FetchStatus;
  message: string;
};

export type CategoryActions = {
  getCategory: (id: string) => void;
  getCategories: (queryParam?: QueryParam) => void;
  createCategory: (payload: CategoryPayload) => void;
  updateCategory: (id: string, payload: CategoryPayload) => void;

  resetAll: () => void;
  setQueryParam: (queryParam?: QueryParam) => void;
  setFetchStatusPage: (fetchStatus: FetchStatus) => void;
  setFetchStatusButton: (fetchStatus: FetchStatus) => void;

  setCategoriesFormData: (formData: Record<string, any>) => void;
  setCreateCategoryFormData: (formData: Record<string, any>) => void;
  setCreateCategoryErrorData: (errorData: Record<string, any>) => void;
  setUpdateCategoryFormData: (formData: Record<string, any>) => void;
  setUpdateCategoryErrorData: (errorData: Record<string, any>) => void;
};

export type CategoryStore = CategoryState & CategoryActions;

export const defaultInitState: CategoryState = {
  category: {},
  categories: [],
  categoriesFormData: {},

  createCategoryFormData: {},
  createCategoryErrorData: {},
  updateCategoryFormData: {},
  updateCategoryErrorData: {},

  queryParam: { page: 1, limit: 10 },
  fetchStatusPage: FetchStatus.IDLE,
  fetchStatusButton: FetchStatus.IDLE,
  message: "",
};

export const createCategoryStore = create<CategoryStore>()(
  persist(
    (set) => ({
      ...defaultInitState,
      getCategories: (queryParam) => {
        new UseGetCategories({
          queryParam,
          onStart: () => {
            set(() => ({
              fetchStatusPage: FetchStatus.LOADING,
            }));
          },
          onSuccess: (data) => {
            set(() => ({
              categories: data?.data,
              categoriesMeta: {
                page: data.currentPage,
                limit: 10,
                total: data.totalData,
              },
              fetchStatusPage: FetchStatus.SUCCESS,
            }));
          },
          onError: (error) => {
            set(() => ({
              message: error.error,
              fetchStatusPage: FetchStatus.ERROR,
            }));
          },
        }).execute();
      },
      getCategory(id) {
        new UseGetCategory({
          id,
          onStart: () => {
            set(() => ({
              fetchStatusPage: FetchStatus.LOADING,
            }));
          },
          onSuccess: (data) => {
            set(() => ({
              category: data,
              fetchStatusPage: FetchStatus.SUCCESS,
            }));
          },
          onError: (error) => {
            set(() => ({
              message: error.error,
              fetchStatusPage: FetchStatus.ERROR,
            }));
          },
        }).execute();
      },
      createCategory(payload) {
        new UsePostCategory({
          payload,
          onStart: () => {
            set(() => ({
              fetchStatusButton: FetchStatus.LOADING,
            }));
          },
          onSuccess: (data) => {
            set(() => ({
              category: data,
              fetchStatusButton: FetchStatus.SUCCESS,
            }));
          },
          onError: (error) => {
            set(() => ({
              message: error.error,
              fetchStatusButton: FetchStatus.ERROR,
            }));
          },
        }).execute();
      },
      updateCategory(id, payload) {
        new UsePutCategory({
          id,
          payload,
          onStart: () => {
            set(() => ({
              fetchStatusButton: FetchStatus.LOADING,
            }));
          },
          onSuccess: (data) => {
            set(() => ({
              category: data,
              fetchStatusButton: FetchStatus.SUCCESS,
            }));
          },
          onError: (error) => {
            set(() => ({
              message: error.error,
              fetchStatusButton: FetchStatus.ERROR,
            }));
          },
        }).execute();
      },
      resetAll() {
        set(() => ({
          ...defaultInitState,
        }));
      },
      setQueryParam(queryParam) {
        set(() => ({
          queryParam: queryParam,
        }));
      },
      setFetchStatusPage(fetchStatusPage) {
        set((state) => ({
          fetchStatusPage: fetchStatusPage,
          message: fetchStatusPage === FetchStatus.IDLE ? "" : state.message,
        }));
      },
      setFetchStatusButton(fetchStatusButton) {
        set((state) => ({
          fetchStatusButton: fetchStatusButton,
          message: fetchStatusButton === FetchStatus.IDLE ? "" : state.message,
        }));
      },
      setCategoriesFormData(categoriesFormData) {
        set(() => ({
          categoriesFormData: categoriesFormData,
        }));
      },
      setCreateCategoryFormData(createCategoryFormData) {
        set(() => ({
          createCategoryFormData: createCategoryFormData,
        }));
      },
      setCreateCategoryErrorData(createCategoryErrorData) {
        set(() => ({
          createCategoryErrorData: createCategoryErrorData,
        }));
      },
      setUpdateCategoryFormData(updateCategoryFormData) {
        set(() => ({
          updateCategoryFormData: updateCategoryFormData,
        }));
      },
      setUpdateCategoryErrorData(updateCategoryErrorData) {
        set(() => ({
          updateCategoryErrorData: updateCategoryErrorData,
        }));
      },
    }),
    {
      name: LocalStorage.categories,
      partialize: (state) => ({
        categories: state.categories,
        category: state.category,
      }),
    }
  )
);
