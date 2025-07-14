import { createContext, useContext } from "react";

export type UserType = string | null;

export const UserContext = createContext<UserType>(null);

export function useUser() {
  return useContext(UserContext);
}