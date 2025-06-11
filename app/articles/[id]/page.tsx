"use client";

import Loading from "@/components/loading";
import NavBar from "@/components/nav-bar";
import { FetchStatus } from "@/constants/fetch-status";
import { dayjs } from "@/plugins/dayjs";
import { createArticleStore } from "@/stores/article-store";
import { Dot } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import OtherArticles from "../components/other-article";

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
    <div>
      <NavBar />
      <div className="flex h-[1px] bg-brand-slate-200" />
      <div className="py-10 md:px-[160px] px-5 justify-center text-brand-gray-900">
        <span className="flex mt-2 justify-center text-sm ">
          {dayjs(article.createdAt).format("MMMM DD, YYYY")}
          <Dot />
          Created by ${article.user?.username}
        </span>
        <div className="font-semibold text-3xl mt-4 text-center">
          {article.title}
        </div>
        <div className="mt-10">
          <Image
            className="w-full h-auto rounded-xl"
            src={`/api/image?url=${encodeURIComponent(article.imageUrl ?? "")}`}
            alt="image"
            width={180}
            height={180}
          />
        </div>
        <div
          className="mt-10"
          dangerouslySetInnerHTML={{
            __html: article.content ?? "",
          }}
        />
        <OtherArticles />
      </div>
    </div>
  );
}
