"use client";

import Button from "@/components/button";
import Dropdown, { getDropdownData } from "@/components/dropdown";
import Empty from "@/components/empty";
import Loading from "@/components/loading";
import Pagination from "@/components/pagination";
import TextInput from "@/components/text-input";
import { FetchStatus } from "@/constants/fetch-status";
import { ArticlesFormData, ArticlesSchema } from "@/forms/articles";
import { ArticleData } from "@/modules/domain/article-domain";
import { createArticleStore } from "@/stores/article-store";
import { createCategoryStore } from "@/stores/category-store";
import { useDebounce } from "@/utils/use-debounce";
import { isAdmin } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

const Article = ({ article }: { article: ArticleData }) => {
  const router = useRouter();

  return (
    <div
      className={`flex flex-col cursor-pointer`}
      onClick={() => router.push(`/articles/${article.id}`)}
    >
      <div className="pb-2 pt-2">
        <Image
          className="h-1/4 w-1/4"
          src={`/api/image?url=${encodeURIComponent(article.imageUrl ?? "")}`}
          alt="image"
          width={180}
          height={180}
        />
        <div className="font-semibold text-lg mt-2">{article.title}</div>
        <div className="text-base">{article.category?.name}</div>
      </div>
      <div className="divider h-2 m-0" />
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
  else {
    return articles.length === 0 ? (
      <Empty />
    ) : (
      <div className="mt-4">
        {articles.map((article) => {
          return <Article key={article.id} article={article} />;
        })}
        {(articlesMeta?.total ?? 0) > 9 && (
          <Pagination
            className="mt-4"
            currentPage={articlesMeta?.page ?? 1}
            totalPage={totalPage}
            onClick={(value) => {
              console.log(value);
              const queryParams = { ...queryParam, page: value };
              setQueryParam(queryParams);
              getArticles(queryParams);
            }}
          />
        )}
      </div>
    );
  }
};

export default function Articles() {
  const { register, watch, getValues, setValue } = useForm<ArticlesFormData>({
    resolver: zodResolver(ArticlesSchema),
  });

  const { queryParam, setQueryParam, getArticles } = createArticleStore();
  const { categories, getCategories } = createCategoryStore();

  const router = useRouter();
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

  function goToAddArticle() {
    router.push("/articles/add");
  }

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <label className="font-semibold text-2xl text-center">Articles</label>
        {isAdmin() && <Button label="Add" onClick={goToAddArticle} />}
      </div>
      <TextInput
        label="Search"
        placeholder="Search article..."
        register={register("title")}
      />
      <Dropdown
        label="Filter"
        register={register("category")}
        value={
          categories.find((item) => item.id === watch("category"))?.name ?? ""
        }
        data={getDropdownData(categories)}
        onChange={(e) => {
          setValue("category", e.target.value);
          onFetchArticles();
        }}
      />
      <Content />
    </div>
  );
}
