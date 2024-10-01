"use server";

import { revalidatePath, revalidateTag } from "next/cache";

const clearCachesByServerAction = async (input: {
  method: "tag" | "path";
  value?: string;
}) => {
  try {
    if (input?.method === "tag") {
      revalidateTag(input?.value);
    } else if (input?.method === "path") {
      revalidatePath(input?.value);
    } else {
      revalidatePath("/");
    }
  } catch (error) {
    console.error("clearCachesByServerAction=> ", error);
  }
};
export default clearCachesByServerAction;
