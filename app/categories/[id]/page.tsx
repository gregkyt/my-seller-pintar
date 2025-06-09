"use client";

import Button from "@/components/button";
import Loading from "@/components/loading";
import TextInput from "@/components/text-input";
import Toast, { ToastType } from "@/components/toast";
import { FetchStatus } from "@/constants/fetch-status";
import { CategoryFormData, CategorySchema } from "@/forms/categories";
import { CategoryPayload } from "@/modules/domain/category-domain";
import { createCategoryStore } from "@/stores/category-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

export default function CategoryDetail() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(CategorySchema),
  });

  const {
    message,
    fetchStatusPage,
    fetchStatusButton,
    setFetchStatusButton,
    getCategory,
    updateCategory,
  } = createCategoryStore();

  const router = useRouter();
  const { id } = useParams();

  const isLoading = useMemo(() => {
    return fetchStatusPage === FetchStatus.LOADING;
  }, [fetchStatusPage]);

  useEffect(() => {
    if (typeof id === "string") {
      getCategory(id);
    }
  }, [id]);

  function onSubmit(data: CategoryFormData) {
    const payload = data as CategoryPayload;
    if (typeof id === "string") {
      updateCategory(id, payload);
    }
  }

  if (isLoading) return <Loading />;
  return (
    <div className="p-4">
      <label className="font-bold text-2xl text-center">Edit Category</label>
      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label="Name"
          placeholder="Input name..."
          error={errors.name?.message}
          register={register("name")}
        />
        <Button
          className="mt-4"
          label="Submit"
          type="submit"
          isLoading={fetchStatusButton === FetchStatus.LOADING}
        />
      </form>
      <Toast
        isOpen={[FetchStatus.ERROR, FetchStatus.SUCCESS].includes(
          fetchStatusButton
        )}
        text={
          fetchStatusButton === FetchStatus.ERROR ? message : "Category updated"
        }
        type={
          fetchStatusButton === FetchStatus.ERROR
            ? ToastType.ERROR
            : ToastType.SUCCESS
        }
        onHide={() => {
          if (fetchStatusButton === FetchStatus.ERROR)
            setFetchStatusButton(FetchStatus.IDLE);
          else if (fetchStatusButton === FetchStatus.SUCCESS) {
            setFetchStatusButton(FetchStatus.IDLE);
            setValue("name", "");
            router.back();
          }
        }}
      />
    </div>
  );
}
