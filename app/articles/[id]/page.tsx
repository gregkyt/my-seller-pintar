"use client";

import Button from "@/components/button";
import Dropdown, { getDropdownData } from "@/components/dropdown";
import FileInput from "@/components/file-input";
import Loading from "@/components/loading";
import TextArea from "@/components/text-area";
import TextInput from "@/components/text-input";
import { FetchStatus } from "@/constants/fetch-status";
import { ArticleFormData, ArticleSchema } from "@/forms/articles";
import { ArticleData, ArticlePayload } from "@/modules/domain/article-domain";
import { dayjs } from "@/plugins/dayjs";
import { createArticleStore } from "@/stores/article-store";
import { createAuthStore } from "@/stores/auth-store";
import { createCategoryStore } from "@/stores/category-store";
import { createUploadStore } from "@/stores/upload-store";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

const Article = ({ article }: { article: ArticleData }) => {
  return (
    <div className={`flex flex-col`}>
      <a
        className="font-semibold text-lg"
        href={`${process.env.NEXT_PUBLIC_BASE_URL}/articles/${article.id}`}
        target="_blank"
      >
        {article.title}
      </a>
      <label>{article.category?.name}</label>
    </div>
  );
};

const OtherArticles = () => {
  const { articles } = createArticleStore();

  return (
    <div className="mt-4">
      <div className="divider">Other Article</div>
      {articles.map((article) => {
        return <Article key={article.id} article={article} />;
      })}
    </div>
  );
};

const ArticleDetail = ({ article }: { article?: ArticleData }) => {
  if (article === undefined) return null;
  return (
    <div className="flex flex-col gap-2">
      <Image
        className="w-1/4 h-1/4"
        src={`/api/image?url=${encodeURIComponent(article.imageUrl ?? "")}`}
        alt="image"
        width={180}
        height={180}
      />
      <label className="font-semibold text-xl">{article.title}</label>
      <label className="text-lg">{article.category?.name}</label>
      <label>{dayjs(article.createdAt).format("DD MMMM YYYY")}</label>
      <div
        className="mt-4"
        dangerouslySetInnerHTML={{
          __html: article.content ?? "",
        }}
      />
      <OtherArticles />
    </div>
  );
};

const ArticleEdit = ({ article }: { article?: ArticleData }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(ArticleSchema),
  });

  const router = useRouter();
  const { fetchStatusButton, setPreviewArticle } = createArticleStore();
  const { categories } = createCategoryStore();
  const { uploadData, upload } = createUploadStore();

  useEffect(() => {
    setValue("title", article?.title ?? "");
    setValue("content", article?.content ?? "");
    setValue("categoryId", article?.categoryId ?? "");
    setValue("imageUrl", article?.imageUrl ?? "");
  }, []);

  useEffect(() => {
    if (uploadData) {
      setValue("imageUrl", uploadData.imageUrl ?? "");
    }
  }, [uploadData]);

  function onSubmit(data: ArticleFormData) {
    const payload = data as ArticlePayload;
    setPreviewArticle(payload);
    router.push(`/articles/preview`);
  }

  if (article === undefined) return null;
  return (
    <div>
      <label className="font-bold text-2xl text-center">Edit Article</label>
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
};

export default function ArticleDetails() {
  const { article, fetchStatusPage, getArticle, getArticles } =
    createArticleStore();
  const { profileData } = createAuthStore();

  const { id } = useParams();

  const isLoading = useMemo(() => {
    return fetchStatusPage === FetchStatus.LOADING;
  }, [fetchStatusPage]);

  const isAdmin = useMemo(() => {
    return profileData?.role?.toLowerCase() === "admin";
  }, [profileData]);

  useEffect(() => {
    if (typeof id === "string") {
      getArticle(id);
    }
  }, [id]);

  useEffect(() => {
    if (article.category?.name) {
      const queryParams = {
        page: 1,
        limit: 3,
        category: article.category?.id,
      };
      getArticles(queryParams);
    }
  }, [article]);

  if (isLoading) return <Loading />;
  return (
    <div className="p-4">
      {isAdmin ? (
        <ArticleEdit article={article} />
      ) : (
        <ArticleDetail article={article} />
      )}
    </div>
  );
}
