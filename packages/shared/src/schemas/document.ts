import { z } from "zod";

export const createDocumentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  folderId: z.string().min(1, "Folder ID is required"),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;

export const updateDocumentSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
  folderId: z.string().min(1, "Folder ID is required").optional(),
});

export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
