import { z } from 'zod';

export const ID = z.union([z.string(), z.number()]);
export type ID = z.infer<typeof ID>;

export const StatsSchema = z.object({
  hp: z.number().optional(),
  maxHp: z.number().optional(),
  mp: z.number().optional(),
  maxMp: z.number().optional(),
  atk: z.number().optional(),
  def: z.number().optional(),
  mag: z.number().optional(),
  spd: z.number().optional(),
}).catchall(z.number());

export type Stats = z.infer<typeof StatsSchema>;

export const EntityReferenceSchema = z.object({
  uuid: ID,
  type: z.string(),
  name: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
});

export type EntityReference = z.infer<typeof EntityReferenceSchema>;
