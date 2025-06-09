"use client";

import Button from "@/components/button";
import TextInput from "@/components/text-input";
import Toast, { ToastType } from "@/components/toast";
import { FetchStatus } from "@/constants/fetch-status";
import { CategoryFormData, CategorySchema } from "@/forms/categories";
import { CategoryPayload } from "@/modules/domain/category-domain";
import { createCategoryStore } from "@/stores/category-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function CategoryAdd() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(CategorySchema),
  });

  const { fetchStatusButton, message, setFetchStatusButton, createCategory } =
    createCategoryStore();

  const router = useRouter();

  function onSubmit(data: CategoryFormData) {
    const payload = data as CategoryPayload;
    createCategory(payload);
  }

  return (
    <div className="p-4">
      <label className="font-bold text-2xl text-center">Create Category</label>
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
          fetchStatusButton === FetchStatus.ERROR ? message : "Category created"
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
