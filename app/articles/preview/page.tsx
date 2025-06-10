"use client";

import Button from "@/components/button";
import Loading from "@/components/loading";
import Toast, { ToastType } from "@/components/toast";
import { FetchStatus } from "@/constants/fetch-status";
import { ArticleFormData, ArticleSchema } from "@/forms/articles";
import { createArticleStore } from "@/stores/article-store";
import { createCategoryStore } from "@/stores/category-store";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

export default function ArticlePreview() {
  const { setValue } = useForm<ArticleFormData>({
    resolver: zodResolver(ArticleSchema),
  });

  const {
    previewArticle,
    fetchStatusPage,
    fetchStatusButton,
    message,
    setFetchStatusButton,
    createArticle,
  } = createArticleStore();
  const { categories } = createCategoryStore();

  const router = useRouter();

  const isLoading = useMemo(() => {
    return fetchStatusPage === FetchStatus.LOADING;
  }, [fetchStatusPage]);

  function onSubmit() {
    createArticle(previewArticle);
  }

  if (isLoading) return <Loading />;
  return (
    <div className="p-4 flex flex-col gap-2">
      <label className="font-bold text-2xl">Preview Article</label>
      <Image
        className="w-1/4 h-1/4"
        src={`/api/image?url=${encodeURIComponent(
          previewArticle.imageUrl ?? ""
        )}`}
        alt="image"
        width={180}
        height={180}
      />
      <label className="font-semibold text-xl">{previewArticle.title}</label>
      <label className="text-lg">
        {categories.find((item) => item.id === previewArticle.categoryId)?.name}
      </label>
      <div
        className="mt-4"
        dangerouslySetInnerHTML={{
          __html: previewArticle.content ?? "",
        }}
      />
      <div>
        <Button label="Submit" onClick={() => onSubmit()} />
      </div>
      <Toast
        isOpen={[FetchStatus.ERROR, FetchStatus.SUCCESS].includes(
          fetchStatusButton
        )}
        text={
          fetchStatusButton === FetchStatus.ERROR ? message : "Article created"
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
            const fields: (keyof ArticleFormData)[] = [
              "title",
              "content",
              "categoryId",
              "imageUrl",
            ];
            fields.forEach((item) => setValue(item, ""));
            router.replace("/articles");
          }
        }}
      />
    </div>
  );
}
