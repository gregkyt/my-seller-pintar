import Container from "@/components/container";
import Loading from "@/components/loading";
import { Metadata } from "next";
import { ReactNode, Suspense } from "react";

export const metadata: Metadata = {
  title: "Categories",
  description: "Categories",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<Loading />}>
      <Container>{children}</Container>
    </Suspense>
  );
}
