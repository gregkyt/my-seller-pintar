import { api } from "@/plugins/axios";
import {
  LoginPayload,
  LoginResponse,
  ProfileResponse,
  RegisterPayload,
  RegisterResponse,
} from "../domain/auth-domain";

export default class AuthRepository {
  async retrieveProfile() {
    return api.get<ProfileResponse>(`/auth/profile`);
  }

  async login(payload: LoginPayload) {
    return api.post<LoginResponse>(`/auth/login`, payload);
  }

  async register(payload: RegisterPayload) {
    return api.post<RegisterResponse>(`/auth/register`, payload);
  }
}
