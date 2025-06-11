import { NextRequest, NextResponse } from "next/server";
// import { Cookies, Params } from "./constants/constant";

// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export const config = {
  matcher: ["/((?!api|_next|favicon|images|videos).*)"],
};

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-url", request.url);

  const response = NextResponse.next({
    request: {
      headers: headers,
    },
  });
  // console.log(response.headers);
  // const { pathname } = request.nextUrl;
  // const cookies = request.cookies;
  // const adminRestrictedUrls = ["/articles", "/categories"];

  // const token = cookies.get(Cookies.token)?.value;
  // if (restrictedUrls.includes(pathname) && token === undefined) {
  //   return redirectToHome();
  // }

  return response;
}

// function redirectToHome() {
//   return NextResponse.redirect(new URL(`/`, baseUrl));
// }
