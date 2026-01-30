import { z } from 'zod';
import { ID } from './common';

/**
 * ConditionSchema - 判定条件 Schema
 * 用于定义战斗逻辑中的各种前置检查或触发判定
 */
export const ConditionSchema = z.object({
  // --- 基础元数据 ---
  id: z.string(),           // 判定条件的唯一标识
  name: z.string(),         // 判定名称 (如 "血量检查")
  description: z.string().optional(), // 详细描述
  
  // --- 关系标识 ---
  ownerUuid: ID,            // 判定条件的持有者 (如 某个技能、状态或行为)
  targetUuid: ID,           // 判定目标 (该条件将作用于谁身上进行检查)

  // --- 判定主体 ---
  attributeId: z.string().optional(), // 要检查的属性组件 ID (如 "hp", "is_stunned")

  // --- 判定操作 (Operator) ---
  op: z.enum([
    'lt',          // 小于 (Less Than)
    'gt',          // 大于 (Greater Than)
    'lte',         // 小于等于 (Less Than or Equal)
    'gte',         // 大于等于 (Greater Than or Equal)
    'eq',          // 等于 (Equal)
    'neq',         // 不等于 (Not Equal)
    'lt_percent',  // 小于百分比 (Less Than Percent, e.g., hp < 30%)
    'gt_percent',  // 大于百分比 (Greater Than Percent)
    'HAS',         // 拥有 (用于状态、标签或属性的存在检查)
    'NOT_HAS'      // 不拥有
  ]).default('eq'),

  // --- 判定目标值 ---
  value: z.any().optional(), // 比较的目标值。可以是数字、布尔值，甚至是另一个属性的 ID
  
  // --- 扩展备注 ---
  comment: z.string().optional()
});

export type Condition = z.infer<typeof ConditionSchema>;
