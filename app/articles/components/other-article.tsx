"use client";

import { createArticleStore } from "@/stores/article-store";
import { useRouter } from "next/navigation";
import Article from "./article";

export default function OtherArticles() {
  const { articles } = createArticleStore();

  const router = useRouter();

  function goToDetail(id?: string) {
    router.push(`/articles/${id}`);
  }
  return (
    <div className="mt-20">
      <div className="text-xl font-bold mb-6">Other Articles</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {articles.map((article) => {
          return (
            <Article
              key={article.id}
              article={article}
              onClick={(id) => goToDetail(id)}
            />
          );
        })}
      </div>
    </div>
  );
}
