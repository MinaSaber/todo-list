import { Types } from "mongoose";
import { ForbiddenException } from "../exceptions/index.js";

export function checkAuthority(
  userIdFromToken: string,
  userIdFromDB: Types.ObjectId
) {
  if (userIdFromToken !== userIdFromDB.toString()) {
    throw new ForbiddenException(
      "You are not authorized to perform this action"
    );
  }
  return true;
}
