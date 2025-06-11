import Button from "@/components/button";
import TextInput from "@/components/text-input";
import { FetchStatus } from "@/constants/fetch-status";
import { CategoryFormData, CategorySchema } from "@/forms/categories";
import {
  CategoryData,
  CategoryPayload,
} from "@/modules/domain/category-domain";
import { createCategoryStore } from "@/stores/category-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type CategoryAddProps = {
  isOpen?: boolean;
  categoryData: CategoryData;
  onClose: (isAction?: boolean) => void;
};

export default function CategoryEdit({
  categoryData,
  isOpen,
  onClose,
}: CategoryAddProps) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(CategorySchema),
  });

  const { category, fetchStatusButton, updateCategory } = createCategoryStore();

  useEffect(() => {
    if (isOpen) onClose(true);
  }, [category]);

  useEffect(() => {
    if (isOpen) {
      console.log(categoryData);
      setValue("name", categoryData.name ?? "");
    }
  }, [isOpen]);

  function onSubmit(data: CategoryFormData) {
    const payload = data as CategoryPayload;
    updateCategory(categoryData.id ?? "", payload);
  }

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`} open={isOpen}>
      <div className="modal-box h-fit">
        <h3 className="font-semibold text-lg">Edit Category</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Category"
            register={register("name")}
            error={errors?.name?.message}
          />
          <div className="flex justify-end mt-2 gap-2">
            <Button
              className="!bg-white !text-brand-slate-900"
              type="button"
              label="Cancel"
              onClick={() => {
                setValue("name", "");
                onClose();
              }}
            />
            <Button
              label="Submit"
              isLoading={fetchStatusButton === FetchStatus.LOADING}
            />
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => onClose()}></button>
      </form>
    </dialog>
  );
}
