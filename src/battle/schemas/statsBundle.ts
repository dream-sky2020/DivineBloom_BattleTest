import { z } from 'zod';
import { ID } from './common';

/**
 * StatsBundleSchema - 属性包容器 Schema
 * 用于聚合管理属于同一个实体的多个属性组件 (AttributeComponent)
 */
export const StatsBundleSchema = z.object({
  // --- 核心标识 ---
  uuid: ID,           // 属性包自身的唯一标识
  ownerUuid: ID,      // 属性包所属的实体 (如 Character/Skill)
  
  // --- 属性关联 ---
  /**
   * 存储 AttributeComponent 的唯一标识数组
   * 这样可以通过查表的方式找到具体的数据类型为 int, bool 或 float 的属性
   */
  attributeUuids: z.array(ID).default([]),

  // --- 元数据 ---
  name: z.string().optional(),
  description: z.string().optional(),
  
  // --- 扩展备注 ---
  comment: z.string().optional()
});

export type StatsBundle = z.infer<typeof StatsBundleSchema>;
