"use client";

import TextArea from "@/components/text-area";
import TextInput from "@/components/text-input";
import { ArticleFormData, ArticleSchema } from "@/forms/articles";
import { ArticlePayload } from "@/modules/domain/article-domain";
import { createArticleStore } from "@/stores/article-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function ArticleAdd() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(ArticleSchema),
  });

  const { article, fetchStatusButton, message, createArticle } =
    createArticleStore();

  function onSubmit(data: ArticleFormData) {
    const payload = data as ArticlePayload;
    createArticle(payload);
  }

  return (
    <div className="p-4">
      <label className="font-bold text-2xl text-center">Create Article</label>
      <form className="flex flex-col mt-4" onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label="Title"
          placeholder="Input title..."
          error={errors.title?.message}
          register={register("title")}
        />
        <TextArea
          label="Content"
          placeholder="Input content..."
          error={errors.content?.message}
          register={register("content")}
        />
      </form>
    </div>
  );
}
