"use client";

import Dropdown, { getDropdownData } from "@/components/dropdown";
import Empty from "@/components/empty";
import Loading from "@/components/loading";
import NavBar from "@/components/nav-bar";
import Pagination from "@/components/pagination";
import TextInput from "@/components/text-input";
import { FetchStatus } from "@/constants/fetch-status";
import { ArticlesFormData, ArticlesSchema } from "@/forms/articles";
import { ArticleData } from "@/modules/domain/article-domain";
import { createArticleStore } from "@/stores/article-store";
import { createCategoryStore } from "@/stores/category-store";
import { useDebounce } from "@/utils/use-debounce";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import Article from "./components/article";

const List = ({ articles }: { articles: ArticleData[] }) => {
  const router = useRouter();

  function goToDetail(id?: string) {
    router.push(`/articles/${id}`);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {articles.map((article) => {
        return (
          <Article
            key={article.id}
            article={article}
            onClick={(id) => goToDetail(id)}
          />
        );
      })}
    </div>
  );
};

const Content = () => {
  const {
    queryParam,
    fetchStatusPage,
    articles,
    articlesMeta,
    setQueryParam,
    getArticles,
  } = createArticleStore();

  const isLoading = useMemo(() => {
    return fetchStatusPage === FetchStatus.LOADING;
  }, [fetchStatusPage]);

  const totalPage = useMemo(() => {
    return Math.ceil((articlesMeta?.total ?? 0) / queryParam.limit);
  }, [articlesMeta]);

  if (isLoading) return <Loading />;
  return (
    <div className="md:px-[100px] py-10 px-5">
      <div className="mb-6 hidden md:block">{`Showing : ${articles.length} of ${articlesMeta?.total} articles`}</div>
      {articles.length === 0 ? <Empty /> : <List articles={articles} />}
      <div className="flex justify-center items-center">
        {(articlesMeta?.total ?? 0) > 9 && (
          <Pagination
            className="mt-4"
            currentPage={articlesMeta?.page ?? 1}
            totalPage={totalPage}
            onClick={(value) => {
              const queryParams = { ...queryParam, page: value };
              setQueryParam(queryParams);
              getArticles(queryParams);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default function Articles() {
  const { register, watch, getValues, setValue } = useForm<ArticlesFormData>({
    resolver: zodResolver(ArticlesSchema),
  });

  const { queryParam, setQueryParam, getArticles } = createArticleStore();
  const { categories, getCategories } = createCategoryStore();

  const watchedSearch = watch("title");
  const debouncedSearch = useDebounce(watchedSearch ?? "", 500);

  useEffect(() => {
    if (debouncedSearch !== undefined) {
      onFetchArticles(1);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (categories.length === 0) onFetchCategories();
  }, []);

  function onFetchArticles(page?: number) {
    const values = getValues();
    const queryParams = { ...queryParam, ...values, page: page ?? 1 };
    setQueryParam(queryParams);
    getArticles(queryParams);
  }

  function onFetchCategories() {
    getCategories();
  }

  return (
    <div className="relative w-full justify-center items-center">
      <div className="relative flex w-full md:h-[500px] h-[560px] bg-brand-blue-600 justify-center items-center">
        <div className="absolute w-full md:h-[500px] h-[560px] overflow-hidden">
          <Image
            className="md:h-[500px] h-[560px] w-full opacity-20"
            src="/bg-articles.jpg"
            alt="bg-articles"
            width={100}
            height={100}
          />
        </div>
        <div className="w-[730px] justify-center items-center text-center">
          <div className="text-white font-bold">Blog genzet</div>
          <div className="text-white text-5xl mt-3">
            The Journal : Design Resources, Interviews, and Industry News
          </div>
          <div className="text-white text-2xl mt-3">
            Your daily dose of design insights!
          </div>
          <div className="flex flex-col justify-between items-center mx-12 mt-10 p-2 md:flex-row md:gap-2 bg-brand-blue-500 rounded-lg">
            <div className="md:grow w-full">
              <Dropdown
                register={register("category")}
                value={
                  categories.find((item) => item.id === watch("category"))
                    ?.name ?? ""
                }
                data={getDropdownData(categories)}
                onChange={(e) => {
                  setValue("category", e.target.value);
                  onFetchArticles();
                }}
              />
            </div>
            <div className="md:grow w-full">
              <TextInput placeholder="Search..." register={register("title")} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full">
        <NavBar />
      </div>
      <Content />
    </div>
  );
}
