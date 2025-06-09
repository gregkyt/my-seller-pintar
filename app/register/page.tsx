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
    loginData,
    fetchStatusButton,
    message,
    register: createUser,
    setFetchStatusButton,
  } = createAuthStore();

  const router = useRouter();

  useEffect(() => {
    console.log(loginData);
    if (fetchStatusButton === FetchStatus.SUCCESS && loginData) {
      router.replace("/home");
    }
  }, [loginData]);

  function onSubmit(data: RegisterFormData) {
    const payload = data as RegisterPayload;
    createUser(payload);
  }

  return (
    <div className="p-4 flex h-screen justify-center">
      <div className="flex flex-col justify-center">
        <label className="font-bold text-2xl text-center">Login</label>
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
            value={watch("role")}
            data={data}
            onChange={(e) => setValue("role", e.target.value)}
          />
          <Button
            className="mt-4"
            label="Register"
            type="submit"
            isLoading={fetchStatusButton === FetchStatus.LOADING}
          />
        </form>
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
