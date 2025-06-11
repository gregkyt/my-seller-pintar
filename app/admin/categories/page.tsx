"use client";

import Button, { IconPosition } from "@/components/button";
import Empty from "@/components/empty";
import Loading from "@/components/loading";
import Table from "@/components/table";
import TextInput from "@/components/text-input";
import { FetchStatus } from "@/constants/fetch-status";
import { CategoriesFormData, CategoriesSchema } from "@/forms/categories";
import { CategoryData } from "@/modules/domain/category-domain";
import { createCategoryStore } from "@/stores/category-store";
import { useDebounce } from "@/utils/use-debounce";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import CategoryAdd from "./components/dialog-add";
import CategoryEdit from "./components/dialog-edit";

export default function Categories() {
  const { register, watch } = useForm<CategoriesFormData>({
    resolver: zodResolver(CategoriesSchema),
  });

  const {
    queryParam,
    categories,
    categoriesMeta,
    fetchStatusPage,
    setQueryParam,
    getCategories,
  } = createCategoryStore();

  const [data, setData] = useState<Record<string, any>[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectCategory, setSelectCategory] = useState<CategoryData>({});

  const columns: Record<string, string> = {
    category: "Category",
    createdAt: "Created At",
    actions: "Action",
  };

  const watchedSearch = watch("search");
  const debouncedSearch = useDebounce(watchedSearch ?? "", 500);

  useEffect(() => {
    console.log(debouncedSearch);
    if (debouncedSearch !== undefined) {
      const queryParams = {
        ...queryParam,
        page: 1,
        search: debouncedSearch,
      };
      setQueryParam(queryParams);
      getCategories(queryParams);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    const items: Record<string, any>[] = [];
    categories.forEach((value) => {
      const item: Record<string, any> = {
        id: value.id,
        category: value.name,
        createdAt: dayjs(value.createdAt).format("MMMM DD, YYYY HH:mm:ss"),
        actions: [
          { key: "edit", value: "Edit" },
          { key: "delete", value: "Delete" },
        ],
      };
      items.push(item);
    });

    setData(items);
  }, [categories]);

  useEffect(() => {
    getCategories(queryParam);
    if (categories.length === 0) getCategories();
  }, []);

  const totalPage = useMemo(() => {
    return Math.ceil(
      (categoriesMeta?.total ?? 0) / (categoriesMeta?.limit ?? 0)
    );
  }, [categoriesMeta]);

  const isLoading =
    ([FetchStatus.IDLE, FetchStatus.LOADING].includes(fetchStatusPage) &&
      data.length === 0) ||
    fetchStatusPage === FetchStatus.LOADING;

  function onActionMenu(data: Record<string, any>, menu: Record<string, any>) {
    switch (menu.key) {
      case "edit":
        const category: CategoryData = {
          id: data.id,
          name: data.category,
        };
        setSelectCategory(category);
        setTimeout(() => {
          setIsOpen(!isOpen);
        }, 500);
        break;
      default:
        break;
    }
  }

  function onAdd() {
    setIsOpen(!isOpen);
  }

  if (isLoading) return <Loading />;
  else if (data.length === 0) return <Empty />;
  return (
    <div className="p-6">
      <div className="rounded-xl shadow">
        <div className="p-6 font-medium text-brand-slate-900">{`Total Category ${categoriesMeta?.total}`}</div>
        <div className="p-6 flex border-t-[1px] border-brand-gray-100 items-center justify-between">
          <TextInput
            placeholder="Search category..."
            register={register("search")}
          />
          <Button
            label="Add Category"
            icon={<Plus size={20} />}
            iconPosition={IconPosition.LEFT}
            onClick={() => onAdd()}
          />
        </div>
        <Table
          columns={columns}
          data={data}
          isPagination={
            (categoriesMeta?.total ?? 0) > (categoriesMeta?.limit ?? 0)
          }
          currentPage={categoriesMeta?.page ?? 1}
          limit={categoriesMeta?.limit ?? 10}
          totalPage={totalPage}
          onPageChange={(page) => {
            const queryParams = { ...queryParam, page: page };
            setQueryParam(queryParams);
            getCategories(queryParams);
          }}
          onActionClick={(data, menu) => {
            onActionMenu(data, menu);
          }}
        />
      </div>
      <CategoryAdd
        isOpen={isOpen}
        onClose={(isNext) => {
          setIsOpen(!isOpen);
          if (isNext) {
            const queryParams = { ...queryParam, page: 1 };
            setQueryParam(queryParams);
            getCategories(queryParams);
          }
        }}
      />
      <CategoryEdit
        isOpen={isOpen}
        categoryData={selectCategory}
        onClose={(isNext) => {
          setIsOpen(!isOpen);
          if (isNext) {
            const queryParams = { ...queryParam, page: 1 };
            setQueryParam(queryParams);
            getCategories(queryParams);
          }
        }}
      />
    </div>
  );
}
