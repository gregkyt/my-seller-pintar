"use client";

import Button from "@/components/button";
import Dropdown, { getDropdownData } from "@/components/dropdown";
import FileInput from "@/components/file-input";
import TextArea from "@/components/text-area";
import TextInput from "@/components/text-input";
import { FetchStatus } from "@/constants/fetch-status";
import { ArticleFormData, ArticleSchema } from "@/forms/articles";
import { ArticlePayload } from "@/modules/domain/article-domain";
import { createArticleStore } from "@/stores/article-store";
import { createCategoryStore } from "@/stores/category-store";
import { createUploadStore } from "@/stores/upload-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function ArticleAdd() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(ArticleSchema),
  });

  const router = useRouter();
  const { fetchStatusButton, setPreviewArticle } = createArticleStore();
  const { categories, getCategories } = createCategoryStore();
  const { uploadData, upload } = createUploadStore();

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (uploadData) {
      setValue("imageUrl", uploadData.imageUrl ?? "");
    }
  }, [uploadData]);

  function onSubmit(data: ArticleFormData) {
    const payload = data as ArticlePayload;
    setPreviewArticle(payload);
    router.push("/articles/preview");
  }

  return (
    <div className="p-4">
      <label className="font-bold text-2xl text-center">Create Article</label>
      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
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
            categories.find((item) => item.id === watch("categoryId"))?.name ??
            ""
          }
          data={getDropdownData(categories)}
          onChange={(e) => {
            setValue("categoryId", e.target.value);
          }}
        />
        <FileInput
          label="Upload"
          placeholder="Choose File"
          value={watch("imageUrl")}
          register={register("imageUrl")}
          onChange={(e) => {
            const files = e.target.files;
            if (files) {
              upload(files[0]);
            }
          }}
        />
        <TextArea
          label="Content"
          placeholder="Input content..."
          error={errors.content?.message}
          register={register("content")}
        />
        <Button
          className="mt-4"
          label="Submit"
          isLoading={fetchStatusButton === FetchStatus.LOADING}
        />
      </form>
    </div>
  );
}
