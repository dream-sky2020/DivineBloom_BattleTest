import { z } from 'zod';
import { ID } from './common';
import { ConditionSchema } from './condition';

/**
 * TriggerNodeSchema - 触发器逻辑节点
 * 修改为严格的二叉树结构，并增加常数布尔叶子
 */
export const TriggerNodeSchema: z.ZodType<any> = z.lazy(() => z.union([
  // --- 基础叶子节点：判定条件 ---
  z.object({
    type: z.literal('CONDITION'),
    condition: ConditionSchema,
  }),
  // --- 一元逻辑节点：非 (NOT) ---
  z.object({
    type: z.literal('NOT'),
    child: TriggerNodeSchema,
  }),
  // --- 常量叶子节点：真 ---
  z.object({
    type: z.literal('TRUE'),
  }),

  // --- 常量叶子节点：假 ---
  z.object({
    type: z.literal('FALSE'),
  }),

  // --- 二元逻辑节点：与 (AND) ---
  z.object({
    type: z.literal('AND'),
    left: TriggerNodeSchema,
    right: TriggerNodeSchema,
  }),

  // --- 二元逻辑节点：或 (OR) ---
  z.object({
    type: z.literal('OR'),
    left: TriggerNodeSchema,
    right: TriggerNodeSchema,
  }),


]));

/**
 * TriggerSchema - 触发器实体 Schema
 */
export const TriggerSchema = z.object({
  uuid: ID,
  ownerUuid: ID,
  name: z.string(),
  description: z.string().optional(),
  root: TriggerNodeSchema,
  comment: z.string().optional()
});

export type TriggerNode = z.infer<typeof TriggerNodeSchema>;
export type Trigger = z.infer<typeof TriggerSchema>;
