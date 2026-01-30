import { z } from 'zod';
import { ID } from './common';

/**
 * RegulatorSchema - 调节器 Schema
 * 用于定义如何根据某些条件或属性动态调节最终数值（如伤害、治疗量、属性加成等）
 */
export const RegulatorSchema = z.object({
  // --- 基础元数据 ---
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),

  // --- 关系标识 ---
  ownerUuid: ID, // 该调节器属于谁（如 某个技能效果或被动天赋）

  // --- 调节逻辑类型 ---
  type: z.enum([
    'LINEAR_SCALING',   // 线性缩放 (final = base + source * factor)
    'THRESHOLD_BONUS',  // 阈值加成 (if source > threshold then + bonus)
    'VARIABLE_SCALING'  // 变量比例 (基于某个动态变量)
  ]).default('LINEAR_SCALING'),

  // --- 数据源配置 ---
  sourceUuid: ID.optional(),       // 数据来源实体（从谁身上取值）
  sourceAttributeId: z.string().optional(), // 数据源属性 ID（如 "atk", "hp"）
  maxSourceAttributeId: z.string().optional(), // 最大值来源属性 ID（用于计算百分比，如 "maxHp"）

  // --- 计算参数 ---
  mode: z.enum([
    'percent',         // 百分比模式 (如 当前值 / 最大值)
    'inverse_percent', // 反向百分比 (如 1 - 当前 / 最大)
    'value'            // 原始数值模式
  ]).default('value'),

  op: z.enum([
    'add', // 加法加成
    'mul', // 乘法系数
  ]).default('add'),

  factor: z.number().optional().default(1),    // 系数/权重
  threshold: z.number().optional(),            // 触发阈值
  bonusValue: z.number().optional(),           // 额外奖励值

  // --- 扩展备注 ---
  comment: z.string().optional()
});

export type Regulator = z.infer<typeof RegulatorSchema>;
