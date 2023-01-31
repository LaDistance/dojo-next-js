import { z } from "zod";

// Schema
export const IdNumberObject = z.object({
  id: z.number(),
});

export const NamedObject = IdNumberObject.extend({
  name: z.string(),
});

// Types
export type IdNumberObject = z.infer<typeof IdNumberObject>;
export type NamedObject = z.infer<typeof NamedObject>;
