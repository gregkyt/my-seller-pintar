// import Image from "next/image";

"use client";

import Button from "@/components/button";
import TextInput from "@/components/text-input";
import Toast, { ToastType } from "@/components/toast";
import { FetchStatus } from "@/constants/fetch-status";
import { LoginFormData, LoginSchema } from "@/forms/login";
import { LoginPayload } from "@/modules/domain/auth-domain";
import { createAuthStore } from "@/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const {
    message,
    profileData,
    fetchStatusButton,
    login,
    setFetchStatusButton,
  } = createAuthStore();

  const router = useRouter();

  useEffect(() => {
    if (fetchStatusButton === FetchStatus.SUCCESS && profileData) {
      if (profileData.role?.toLocaleLowerCase() === "admin")
        router.replace("/articles");
      router.replace("/admin/articles");
    }
  }, [profileData]);

  function onSubmit(data: LoginFormData) {
    const payload = data as LoginPayload;
    login(payload);
  }

  function goToRegister() {
    router.push("/register");
  }

  return (
    <div className="md:bg-brand-gray-100 flex h-screen w-screen justify-center items-center bg-white">
      <div className="md:w-[400px] md:h-[376px] md:rounded-2xl md:p-4 p-6 md:bg-white w-full h-full flex flex-col justify-center">
        <div className="flex justify-center items-center">
          <Image
            src="/logo_ipsum.png"
            width={122}
            height={22}
            alt="logo_ipsum"
          />
        </div>
        <form
          className="flex flex-col gap-2 mt-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextInput
            label="Username"
            placeholder="Input username..."
            error={errors.username?.message}
            register={register("username")}
          />
          <TextInput
            label="Password"
            placeholder="Input password..."
            type="password"
            error={errors.password?.message}
            register={register("password")}
          />
          <Button label="Login" className="btn mt-4" type="submit" />
        </form>
        <div className="flex items-center justify-center text-sm mt-6">
          <span>Don&apos;t have account? </span>
          <button
            className="btn-link text-brand-blue-600 ml-1"
            onClick={goToRegister}
          >
            Register
          </button>
        </div>
        <Toast
          isOpen={fetchStatusButton === FetchStatus.ERROR}
          text={message}
          type={
            fetchStatusButton === FetchStatus.ERROR
              ? ToastType.ERROR
              : ToastType.SUCCESS
          }
          onHide={() => setFetchStatusButton(FetchStatus.IDLE)}
        />
      </div>
    </div>
  );
}
