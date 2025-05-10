import TokenBlacklist from "../models/TokenBlacklist";

export const isTokenBlacklisted = async (token: string) => {
  const exists = await TokenBlacklist.findOne({ token });
  return !!exists;
};