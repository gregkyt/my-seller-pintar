"use client";

import Button from "@/components/button";
import Empty from "@/components/empty";
import Loading from "@/components/loading";
import Pagination from "@/components/pagination";
import TextInput from "@/components/text-input";
import { FetchStatus } from "@/constants/fetch-status";
import { CategoriesFormData, CategoriesSchema } from "@/forms/categories";
import { CategoryData } from "@/modules/domain/category-domain";
import { createCategoryStore } from "@/stores/category-store";
import { useDebounce } from "@/utils/use-debounce";
import { isAdmin } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

const Category = ({ category }: { category: CategoryData }) => {
  const router = useRouter();

  return (
    <div
      className={`flex flex-col cursor-pointer`}
      onClick={() => router.push(`/categories/${category.id}`)}
    >
      <div className="pb-2 pt-2">
        <div className="text-base">{category.name}</div>
      </div>
      <div className="divider h-2 m-0" />
    </div>
  );
};

const Content = () => {
  const {
    queryParam,
    fetchStatusPage,
    categories,
    categoriesMeta,
    setQueryParam,
    getCategories,
  } = createCategoryStore();

  const isLoading = useMemo(() => {
    return fetchStatusPage === FetchStatus.LOADING;
  }, [fetchStatusPage]);

  const totalPage = useMemo(() => {
    return Math.ceil((categoriesMeta?.total ?? 0) / queryParam.limit);
  }, [categoriesMeta]);

  if (isLoading) return <Loading />;
  else {
    return categories.length === 0 ? (
      <Empty />
    ) : (
      <div className="mt-4">
        {categories.map((category) => {
          return <Category key={category.id} category={category} />;
        })}
        {(categoriesMeta?.total ?? 0) > 9 && (
          <Pagination
            className="mt-4"
            currentPage={categoriesMeta?.page ?? 1}
            totalPage={totalPage}
            onClick={(value) => {
              const queryParams = { ...queryParam, page: value };
              setQueryParam(queryParams);
              getCategories(queryParams);
            }}
          />
        )}
      </div>
    );
  }
};

export default function Categories() {
  const { register, watch, getValues } = useForm<CategoriesFormData>({
    resolver: zodResolver(CategoriesSchema),
  });

  const { queryParam, setQueryParam, getCategories } = createCategoryStore();

  const router = useRouter();
  const watchedSearch = watch("search");
  const debouncedSearch = useDebounce(watchedSearch ?? "", 500);

  useEffect(() => {
    if (debouncedSearch !== undefined) {
      onFetchCategories();
    }
  }, [debouncedSearch]);

  function onFetchCategories() {
    const values = getValues();
    const queryParams = { ...queryParam, ...values };
    setQueryParam(queryParams);
    getCategories(queryParams);
  }

  function goToAddCategory() {
    router.push("/categories/add");
  }

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <label className="font-semibold text-2xl text-center">Categories</label>
        {isAdmin() && <Button label="Add" onClick={goToAddCategory} />}
      </div>
      <TextInput
        label="Search"
        placeholder="Search category..."
        register={register("search")}
      />
      <Content />
    </div>
  );
}
