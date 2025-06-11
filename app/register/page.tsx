"use client";

import Button from "@/components/button";
import Dropdown from "@/components/dropdown";
import TextInput from "@/components/text-input";
import Toast, { ToastType } from "@/components/toast";
import { FetchStatus } from "@/constants/fetch-status";
import { RegisterFormData, RegisterSchema } from "@/forms/register";
import { RegisterPayload } from "@/modules/domain/auth-domain";
import { createAuthStore } from "@/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function Register() {
  const data = [
    { id: "1", value: "Admin" },
    { id: "2", value: "User" },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  const {
    profileData,
    fetchStatusButton,
    message,
    register: createUser,
    setFetchStatusButton,
  } = createAuthStore();

  const router = useRouter();

  useEffect(() => {
    if (fetchStatusButton === FetchStatus.SUCCESS && profileData) {
      router.replace("/articles");
    }
  }, [profileData]);

  function onSubmit(data: RegisterFormData) {
    const payload = data as RegisterPayload;
    createUser(payload);
  }

  function goToLogin() {
    router.push("/");
  }

  return (
    <div className="md:bg-brand-gray-100 flex h-screen w-screen justify-center items-center bg-white">
      <div className="md:w-[400px] md:h-[452px] md:rounded-2xl md:p-4 p-6 md:bg-white w-full h-full flex flex-col justify-center">
        <div className="flex justify-center items-center">
          <Image
            src="/logo_ipsum.png"
            width={122}
            height={22}
            alt="logo_ipsum"
          />
        </div>
        <form className="flex flex-col mt-4" onSubmit={handleSubmit(onSubmit)}>
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
          <Dropdown
            label="Role"
            placeholder="Input role..."
            error={errors.role?.message}
            register={register("role")}
            value={watch("role") ?? ""}
            data={data}
            onChange={(e) => {
              const value =
                data.find((item) => item.id === e.target.value)?.value ?? "";
              setValue("role", value);
            }}
          />
          <Button
            className="mt-4"
            label="Register"
            type="submit"
            isLoading={fetchStatusButton === FetchStatus.LOADING}
          />
        </form>
        <div className="flex items-center justify-center text-sm mt-6">
          <span>Already have an account? </span>
          <button
            className="btn-link text-brand-blue-600 ml-1"
            onClick={goToLogin}
          >
            Login
          </button>
        </div>
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
  );
}
