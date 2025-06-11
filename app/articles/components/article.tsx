import { ArticleData } from "@/modules/domain/article-domain";
import { dayjs } from "@/plugins/dayjs";
import Image from "next/image";

export default function Article({
  article,
  onClick,
}: {
  article: ArticleData;
  onClick: (id?: string) => void;
}) {
  return (
    <div
      className="cursor-pointer"
      key={article.id}
      onClick={() => onClick(article.id)}
    >
      <div className="overflow-hidden rounded-xl">
        <Image
          className="h-[240px] w-auto rounded-xl"
          src={`/api/image?url=${encodeURIComponent(article.imageUrl ?? "")}`}
          alt="image"
          width={180}
          height={180}
        />
      </div>
      <div className="text-sm font-normal mt-4">
        {dayjs(article.createdAt).format("MMMM DD, YYYY")}
      </div>
      <div className="font-semibold text-lg mt-2 line-clamp-2">
        {article.title}
      </div>
      <div className="font-normal line-clamp-2">{article.content}</div>
      <div className="text-sm mt-2 rounded-full bg-brand-blue-200 px-2 py-1 w-fit">
        {article.category?.name}
      </div>
    </div>
  );
}
