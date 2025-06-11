"use client";

import article from "@/app/articles/components/article";
import OtherArticles from "@/app/articles/components/other-article";
import { createArticleStore } from "@/stores/article-store";
import { createAuthStore } from "@/stores/auth-store";
import dayjs from "dayjs";
import { Dot } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

export default function ArticlePreview() {
  const { previewArticle, getArticles } = createArticleStore();
  const { profileData } = createAuthStore();

  useEffect(() => {
    if (previewArticle.categoryId) {
      const queryParams = {
        page: 1,
        limit: 3,
        category: previewArticle.categoryId,
      };
      getArticles(queryParams);
    }
  }, [article]);

  return (
    <div>
      <div className="flex h-[1px] bg-brand-slate-200" />
      <div className="py-10 md:px-[160px] px-5 justify-center text-brand-gray-900">
        <span className="flex mt-2 justify-center text-sm ">
          {dayjs(new Date()).format("MMMM DD, YYYY")}
          <Dot />
          Created by ${profileData?.username}
        </span>
        <div className="font-semibold text-3xl mt-4 text-center">
          {previewArticle.title}
        </div>
        <div className="mt-10">
          <Image
            className="w-full h-auto rounded-xl"
            src={`/api/image?url=${encodeURIComponent(
              previewArticle.imageUrl ?? ""
            )}`}
            alt="image"
            width={180}
            height={180}
          />
        </div>
        <div
          className="mt-10"
          dangerouslySetInnerHTML={{
            __html: previewArticle.content ?? "",
          }}
        />
        <OtherArticles />
      </div>
    </div>
  );
}
