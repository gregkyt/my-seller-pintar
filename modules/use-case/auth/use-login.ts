import {
  LoginPayload,
  LoginResponse,
  V1ErrorResponse,
} from "@/modules/domain/auth-domain";
import UserRepository from "../../repository/auth-repository";
import BaseUseCase from "../base-use-case";

interface IUseLogin {
  payload: LoginPayload;
  onStart: () => void;
  onSuccess: (data: LoginResponse) => void;
  onError?: (error: V1ErrorResponse) => void;
}

export default class UseLogin implements BaseUseCase {
  repository = new UserRepository();
  payload: LoginPayload;
  onStart: () => void;
  onSuccess: (data: LoginResponse) => void;
  onError?: (error: V1ErrorResponse) => void;

  constructor({ payload, onStart, onSuccess, onError }: IUseLogin) {
    this.payload = payload;
    this.onStart = onStart;
    this.onSuccess = onSuccess;
    this.onError = onError;
  }

  async execute() {
    this.onStart();
    try {
      const { data } = await this.repository.login(this.payload);
      this.onSuccess(data);
    } catch (error) {
      if (typeof this.onError === "function") {
        this.onError(error as V1ErrorResponse);
      }
    }
  }
}
