import { FetchStatus } from "@/constants/fetch-status";
import { LocalStorage } from "@/constants/local-storage";
import { ArticleData, ArticlePayload } from "@/modules/domain/article-domain";
import UseGetArticle from "@/modules/use-case/article/use-get-article";
import UseGetArticles from "@/modules/use-case/article/use-get-articles";
import UsePostArticle from "@/modules/use-case/article/use-post-article";
import UsePutArticle from "@/modules/use-case/article/use-put-article";
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

export type ArticlesMeta = {
  total?: number;
  page?: number;
  limit?: number;
};

export type ArticleState = {
  article: ArticleData;
  articles: ArticleData[];
  articlesMeta?: ArticlesMeta;
  previewArticle: ArticlePayload;

  queryParam: QueryParam;
  fetchStatusPage: FetchStatus;
  fetchStatusButton: FetchStatus;
  message: string;
};

export type ArticleActions = {
  getArticle: (id: string) => void;
  getArticles: (queryParam?: QueryParam) => void;
  createArticle: (payload: ArticlePayload) => void;
  updateArticle: (id: string, payload: ArticlePayload) => void;

  resetAll: () => void;
  setPreviewArticle: (payload: ArticlePayload) => void;
  setQueryParam: (queryParam?: QueryParam) => void;
  setFetchStatusPage: (fetchStatus: FetchStatus) => void;
  setFetchStatusButton: (fetchStatus: FetchStatus) => void;
};

export type ArticleStore = ArticleState & ArticleActions;

export const defaultInitState: ArticleState = {
  article: {},
  articles: [],
  previewArticle: {},

  queryParam: { page: 1, limit: 10 },
  fetchStatusPage: FetchStatus.IDLE,
  fetchStatusButton: FetchStatus.IDLE,
  message: "",
};

export const createArticleStore = create<ArticleStore>()(
  persist(
    (set) => ({
      ...defaultInitState,
      getArticles: (queryParam) => {
        new UseGetArticles({
          queryParam,
          onStart: () => {
            set(() => ({
              fetchStatusPage: FetchStatus.LOADING,
            }));
          },
          onSuccess: (data) => {
            set(() => ({
              articles: data?.data,
              articlesMeta: {
                page: data.page,
                limit: data.limit,
                total: data.total,
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
      getArticle(id) {
        new UseGetArticle({
          id,
          onStart: () => {
            set(() => ({
              fetchStatusPage: FetchStatus.LOADING,
            }));
          },
          onSuccess: (data) => {
            set(() => ({
              article: data,
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
      createArticle(payload) {
        new UsePostArticle({
          payload,
          onStart: () => {
            set(() => ({
              fetchStatusButton: FetchStatus.LOADING,
            }));
          },
          onSuccess: (data) => {
            set(() => ({
              article: data,
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
      updateArticle(id, payload) {
        new UsePutArticle({
          id,
          payload,
          onStart: () => {
            set(() => ({
              fetchStatusButton: FetchStatus.LOADING,
            }));
          },
          onSuccess: (data) => {
            set(() => ({
              article: data,
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
      setPreviewArticle(payload) {
        set(() => ({
          previewArticle: payload,
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
    }),
    {
      name: LocalStorage.articles,
      partialize: (state) => ({
        articles: state.articles,
        article: state.article,
      }),
    }
  )
);
