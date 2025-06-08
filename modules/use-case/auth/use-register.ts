import {
  RegisterPayload,
  RegisterResponse,
  V1ErrorResponse,
} from "@/modules/domain/auth-domain";
import UserRepository from "../../repository/auth-repository";
import BaseUseCase from "../base-use-case";

interface IUseRegister {
  payload: RegisterPayload;
  onStart: () => void;
  onSuccess: (data: RegisterResponse) => void;
  onError?: (error: V1ErrorResponse) => void;
}

export default class UseRegister implements BaseUseCase {
  repository = new UserRepository();
  payload: RegisterPayload;
  onStart: () => void;
  onSuccess: (data: RegisterResponse) => void;
  onError?: (error: V1ErrorResponse) => void;

  constructor({ payload, onStart, onSuccess, onError }: IUseRegister) {
    this.payload = payload;
    this.onStart = onStart;
    this.onSuccess = onSuccess;
    this.onError = onError;
  }

  async execute() {
    this.onStart();
    try {
      const { data } = await this.repository.register(this.payload);
      this.onSuccess(data);
    } catch (error) {
      if (typeof this.onError === "function") {
        this.onError(error as V1ErrorResponse);
      }
    }
  }
}
