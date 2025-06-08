import { ProfileResponse, V1ErrorResponse } from "@/modules/domain/auth-domain";
import UserRepository from "../../repository/auth-repository";
import BaseUseCase from "../base-use-case";

interface IUseGetProfile {
  onStart: () => void;
  onSuccess: (data: ProfileResponse) => void;
  onError?: (error: V1ErrorResponse) => void;
}

export default class UseGetProfile implements BaseUseCase {
  repository = new UserRepository();
  onStart: () => void;
  onSuccess: (data: ProfileResponse) => void;
  onError?: (error: V1ErrorResponse) => void;

  constructor({ onStart, onSuccess, onError }: IUseGetProfile) {
    this.onStart = onStart;
    this.onSuccess = onSuccess;
    this.onError = onError;
  }

  async execute() {
    this.onStart();
    try {
      const { data } = await this.repository.retrieveProfile();
      this.onSuccess(data);
    } catch (error) {
      if (typeof this.onError === "function") {
        this.onError(error as V1ErrorResponse);
      }
    }
  }
}
