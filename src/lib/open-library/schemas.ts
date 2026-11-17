import { z } from "zod";

/** Open Library returns long text either as a plain string or as `{ type, value }`. */
const textSchema = z.union([z.string(), z.object({ value: z.string() })]);

const linkSchema = z.object({ title: z.string(), url: z.string() });

export const searchDocSchema = z.object({
  key: z.string(),
  title: z.string(),
  author_name: z.array(z.string()).optional().catch(undefined),
  author_key: z.array(z.string()).optional().catch(undefined),
  first_publish_year: z.number().optional().catch(undefined),
  cover_i: z.number().optional().catch(undefined),
  subject: z.array(z.string()).optional().catch(undefined),
  language: z.array(z.string()).optional().catch(undefined),
});

export const searchResponseSchema = z.object({
  numFound: z.number(),
  start: z.number(),
  docs: z.array(searchDocSchema),
});

export const workSchema = z.object({
  key: z.string(),
  title: z.string(),
  description: textSchema.optional().catch(undefined),
  covers: z.array(z.number()).optional().catch(undefined),
  subjects: z.array(z.string()).optional().catch(undefined),
  authors: z
    .array(z.object({ author: z.object({ key: z.string() }).optional() }))
    .optional()
    .catch(undefined),
  links: z.array(linkSchema).optional().catch(undefined),
});

export const authorSchema = z.object({
  key: z.string(),
  name: z.string(),
  birth_date: z.string().optional().catch(undefined),
  death_date: z.string().optional().catch(undefined),
  bio: textSchema.optional().catch(undefined),
  photos: z.array(z.number()).optional().catch(undefined),
  links: z.array(linkSchema).optional().catch(undefined),
});

export type SearchDoc = z.infer<typeof searchDocSchema>;
export type SearchResponse = z.infer<typeof searchResponseSchema>;
export type RawWork = z.infer<typeof workSchema>;
export type RawAuthor = z.infer<typeof authorSchema>;
