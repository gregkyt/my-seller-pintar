"use client";

import Button, { IconPosition } from "@/components/button";
import Dropdown, { getDropdownData } from "@/components/dropdown";
import FileInput from "@/components/file-input";
import TextInput from "@/components/text-input";
import Toast, { ToastType } from "@/components/toast";
import { FetchStatus } from "@/constants/fetch-status";
import { ArticleFormData, ArticleSchema } from "@/forms/articles";
import { ArticlePayload } from "@/modules/domain/article-domain";
import { createArticleStore } from "@/stores/article-store";
import { createCategoryStore } from "@/stores/category-store";
import { createUploadStore } from "@/stores/upload-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import dynamic from "next/dynamic";

const TextEditor = dynamic(() => import("@/components/text-editor"), {
  ssr: false,
});

export default function ArticleAdd() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(ArticleSchema),
  });

  const router = useRouter();
  const {
    message,
    fetchStatusButton,
    setPreviewArticle,
    setFetchStatusButton,
    createArticle,
  } = createArticleStore();
  const { queryParam, categories, getCategories } = createCategoryStore();
  const { uploadData, upload } = createUploadStore();

  useEffect(() => {
    const queryParams = { ...queryParam, limit: 1000 };
    getCategories(queryParams);
  }, []);

  useEffect(() => {
    if (uploadData) {
      setValue("imageUrl", uploadData.imageUrl ?? "");
    }
  }, [uploadData]);

  function onCancel() {
    const fields: (keyof ArticleFormData)[] = [
      "title",
      "content",
      "categoryId",
      "imageUrl",
    ];
    fields.forEach((item) => setValue(item, ""));
    router.replace("/admin/articles");
  }

  function onPreview() {
    const payload = getValues();
    setPreviewArticle(payload);
    window.open(
      `${process.env.NEXT_PUBLIC_BASE_URL}/articles/preview`,
      "_blank"
    );
  }

  function onSubmit(data: ArticleFormData) {
    const payload = data as ArticlePayload;
    createArticle(payload);
  }

  return (
    <div className="p-6">
      <div className="rounded-xl shadow">
        <div className="p-5">
          <Button
            className="btn-ghost !bg-white !text-brand-slate-900 p-0"
            label="Create Articles"
            icon={<ArrowLeft size={20} />}
            iconPosition={IconPosition.LEFT}
            onClick={() => router.back()}
          />
        </div>
        <form className="p-6" onSubmit={handleSubmit(onSubmit)}>
          <FileInput
            label="Thumbnails"
            value={watch("imageUrl")}
            register={register("imageUrl")}
            error={errors.imageUrl?.message}
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                upload(files[0]);
              }
            }}
          />
          <TextInput
            label="Title"
            placeholder="Input title..."
            error={errors.title?.message}
            register={register("title")}
          />
          <Dropdown
            label="Filter"
            placeholder="Input category..."
            register={register("categoryId")}
            value={
              categories.find((item) => item.id === watch("categoryId"))
                ?.name ?? ""
            }
            data={getDropdownData(categories)}
            onChange={(e) => {
              setValue("categoryId", e.target.value);
            }}
          />
          <TextEditor
            label="Content"
            name="content"
            placeholder="Input content..."
            error={errors.content?.message}
            control={control}
          />
          <div className="flex justify-end items-center gap-2">
            <Button
              className="!bg-white !text-brand-slate-900 mt-20"
              type="button"
              label="Cancel"
              onClick={onCancel}
            />
            <Button
              className="bg-brand-slate-200 !text-brand-slate-900 mt-20"
              type="button"
              label="Preview"
              onClick={onPreview}
            />
            <Button
              className="mt-20"
              label="Submit"
              isLoading={fetchStatusButton === FetchStatus.LOADING}
            />
          </div>
        </form>
      </div>
      <Toast
        isOpen={[FetchStatus.ERROR, FetchStatus.SUCCESS].includes(
          fetchStatusButton
        )}
        text={
          fetchStatusButton === FetchStatus.ERROR ? message : "Article Created"
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
            router.back();
          }
        }}
      />
    </div>
  );
}
