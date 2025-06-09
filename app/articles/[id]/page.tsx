"use client";

import Loading from "@/components/loading";
import { FetchStatus } from "@/constants/fetch-status";
import { ArticleData } from "@/modules/domain/article-domain";
import { dayjs } from "@/plugins/dayjs";
import { createArticleStore } from "@/stores/article-store";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";

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

export default function ArticleDetail() {
  const { article, fetchStatusPage, getArticle, getArticles } =
    createArticleStore();

  const { id } = useParams();

  const isLoading = useMemo(() => {
    return fetchStatusPage === FetchStatus.LOADING;
  }, [fetchStatusPage]);

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
    <div className="p-4 flex flex-col gap-2">
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
}
