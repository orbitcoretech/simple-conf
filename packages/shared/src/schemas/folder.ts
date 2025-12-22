import { z } from "zod";
import { Department } from "../types/user";

export const createFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required"),
  parentId: z.string().nullable(),
  visibility: z.enum(["public", "department"]),
  department: z.nativeEnum(Department).nullable(),
});

export type CreateFolderInput = z.infer<typeof createFolderSchema>;
