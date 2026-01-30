import { z } from 'zod';
import { ID } from './common';

/**
 * 属性数据类型定义
 */
export const AttributeTypeSchema = z.enum(['int', 'bool', 'float']);
export type AttributeType = z.infer<typeof AttributeTypeSchema>;

/**
 * 属性组件 Schema
 * 用于定义每一个具体的数值/状态属性
 */
export const AttributeComponentSchema = z.object({
  // 核心标识
  id: z.string(), // 属性唯一 ID，例如 "strength", "is_dead", "crit_rate"
  ownerUuid: ID,  // 持有该属性的实体 UUID
  
  // 元数据
  name: z.string(),
  description: z.string().optional(),
  
  // 类型与值
  valueType: AttributeTypeSchema,
  value: z.any(), // 初始为 any，下面通过 superRefine 校验
}).superRefine((data, ctx) => {
  const { valueType, value } = data;
  
  if (valueType === 'int') {
    if (!Number.isInteger(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `当 valueType 为 'int' 时，value 必须是整数。当前值: ${value}`,
        path: ['value']
      });
    }
  } else if (valueType === 'float') {
    if (typeof value !== 'number') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `当 valueType 为 'float' 时，value 必须是数字。当前值: ${value}`,
        path: ['value']
      });
    }
  } else if (valueType === 'bool') {
    if (typeof value !== 'boolean') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `当 valueType 为 'bool' 时，value 必须是布尔值。当前值: ${value}`,
        path: ['value']
      });
    }
  }
});

export type AttributeComponent = z.infer<typeof AttributeComponentSchema>;

/**
 * 属性组容器
 * 方便在一个实体上管理多个属性组件
 */
export const AttributeMapSchema = z.record(z.string(), AttributeComponentSchema);
export type AttributeMap = z.infer<typeof AttributeMapSchema>;
