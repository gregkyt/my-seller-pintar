"use client";

import Button, { IconPosition } from "@/components/button";
import Dropdown, { getDropdownData } from "@/components/dropdown";
import Empty from "@/components/empty";
import Loading from "@/components/loading";
import Table from "@/components/table";
import TextInput from "@/components/text-input";
import { FetchStatus } from "@/constants/fetch-status";
import { ArticlesFormData, ArticlesSchema } from "@/forms/articles";
import { createArticleStore } from "@/stores/article-store";
import { createCategoryStore } from "@/stores/category-store";
import { useDebounce } from "@/utils/use-debounce";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

export default function Articles() {
  const { register, watch, setValue } = useForm<ArticlesFormData>({
    resolver: zodResolver(ArticlesSchema),
  });

  const {
    queryParam: articleQueryParam,
    articles,
    articlesMeta,
    fetchStatusPage,
    setQueryParam,
    getArticles,
  } = createArticleStore();
  const {
    queryParam: categoryQueryParam,
    categories,
    getCategories,
  } = createCategoryStore();

  const [data, setData] = useState<Record<string, any>[]>([]);

  const router = useRouter();

  const columns: Record<string, string> = {
    thumbnails: "Thumbnails",
    title: "Title",
    category: "Category",
    createdAt: "Created At",
    actions: "Action",
  };

  const watchedSearch = watch("title");
  const debouncedSearch = useDebounce(watchedSearch ?? "", 500);

  useEffect(() => {
    if (debouncedSearch !== undefined) {
      const queryParams = {
        ...articleQueryParam,
        page: 1,
        title: debouncedSearch,
      };
      setQueryParam(queryParams);
      getArticles(queryParams);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    const items: Record<string, any>[] = [];
    articles.forEach((value) => {
      const item: Record<string, any> = {
        id: value.id,
        thumbnails: value.imageUrl,
        title: value.title,
        category: value.category?.name,
        createdAt: dayjs(value.createdAt).format("MMMM DD, YYYY HH:mm:ss"),
        actions: [
          { key: "preview", value: "Preview" },
          { key: "edit", value: "Edit" },
          { key: "delete", value: "Delete" },
        ],
      };
      items.push(item);
    });

    setData(items);
  }, [articles]);

  useEffect(() => {
    getArticles(articleQueryParam);
    if (categories.length === 0) {
      const queryParams = { ...categoryQueryParam, limit: 1000 };
      getCategories(queryParams);
    }
  }, []);

  const totalPage = useMemo(() => {
    return Math.ceil((articlesMeta?.total ?? 0) / (articlesMeta?.limit ?? 0));
  }, [articlesMeta]);

  const isLoading =
    ([FetchStatus.IDLE, FetchStatus.LOADING].includes(fetchStatusPage) &&
      data.length === 0) ||
    fetchStatusPage === FetchStatus.LOADING;

  function onActionMenu(data: Record<string, any>, menu: Record<string, any>) {
    switch (menu.key) {
      case "preview":
        router.push(`/articles/${data.id}`);
        break;
      case "edit":
        goToPage(`${data.id}/edit`);
        break;
      default:
        break;
    }
  }

  function goToPage(path: string) {
    router.push(`/admin/articles/${path}`);
  }

  if (isLoading) return <Loading />;
  return (
    <div className="p-6">
      <div className="rounded-xl shadow">
        <div className="p-6 font-medium text-brand-slate-900">{`Total Articles ${articlesMeta?.total}`}</div>
        <div className="p-6 flex border-t-[1px] border-brand-gray-100 items-center justify-between">
          <div className="flex gap-2">
            <Dropdown
              register={register("category")}
              value={
                categories.find((item) => item.id === watch("category"))
                  ?.name ?? ""
              }
              data={getDropdownData(categories)}
              onChange={(e) => {
                setValue("category", e.target.value);
                const queryParams = {
                  ...articleQueryParam,
                  category: e.target.value,
                  page: 1,
                };
                setQueryParam(queryParams);
                getArticles(queryParams);
              }}
            />
            <TextInput
              placeholder="Search by title..."
              register={register("title")}
            />
          </div>
          <Button
            label="Add Article"
            icon={<Plus size={20} />}
            iconPosition={IconPosition.LEFT}
            onClick={() => goToPage("add")}
          />
        </div>
        {data.length === 0 ? (
          <Empty />
        ) : (
          <Table
            columns={columns}
            data={data}
            isPagination={
              (articlesMeta?.total ?? 0) > (articlesMeta?.limit ?? 0)
            }
            currentPage={articlesMeta?.page ?? 1}
            limit={articlesMeta?.limit ?? 10}
            totalPage={totalPage}
            onPageChange={(page) => {
              const queryParams = { ...articleQueryParam, page: page };
              setQueryParam(queryParams);
              getArticles(queryParams);
            }}
            onActionClick={(data, menu) => {
              onActionMenu(data, menu);
            }}
          />
        )}
      </div>
    </div>
  );
}
