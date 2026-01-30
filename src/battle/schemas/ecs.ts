import { z } from 'zod';
import { ID } from './common';

/**
 * ConditionSchema - 判定条件 Schema
 */
export const ConditionSchema = z.object({
  id: z.string().optional(),
  type: z.enum([
    'STAT_COMPARE',     // 属性比较 (hp, mp, atk...)
    'VARIABLE_COMPARE', // 自定义变量比较 (killCount, comboCount...)
    'STATUS_CHECK',    // 状态检查 (是否有某个 status)
    'CHANCE',          // 概率判定
    'TAG_CHECK'        // 标签检查
  ]),
  source: z.enum(['SELF', 'OWNER', 'TARGET', 'SELF_STATS', 'OWNER_STATS', 'TARGET_STATS']).default('SELF'),
  stat: z.string().optional(),     // 用于属性名
  variable: z.string().optional(), // 用于变量名
  statusId: z.string().optional(), // 用于状态 ID
  tagId: z.string().optional(),    // 用于标签 ID
  op: z.enum([
    'lt',          // 小于 (Less Than)
    'gt',          // 大于 (Greater Than)
    'lte',         // 小于等于 (Less Than or Equal)
    'gte',         // 大于等于 (Greater Than or Equal)
    'eq',          // 等于 (Equal)
    'neq',         // 不等于 (Not Equal)
    'lt_percent',  // 小于百分比 (Less Than Percent, e.g., hp < 30%)
    'gt_percent',  // 大于百分比 (Greater Than Percent)
    'HAS',         // 拥有 (用于状态或标签检查)
    'NOT_HAS'      // 不拥有 (用于状态或标签检查)
  ]).default('eq'),
  value: z.any().optional(),       // 比较的目标值
  refVariable: z.string().optional(), // 也可以与另一个变量比较
  comment: z.string().optional()
});

/**
 * RegulatorSchema - 调节器 Schema (用于动态修改效果数值)
 */
export const RegulatorSchema = z.object({
  type: z.enum([
    'LINEAR_SCALING',   // 线性缩放
    'THRESHOLD_BONUS',  // 阈值加成
    'VARIABLE_SCALING'  // 变量缩放
  ]),
  stat: z.string().optional(),
  variable: z.string().optional(),
  source: z.enum([
    'SELF',         // 实体自身
    'OWNER',        // 所有者 (如技能所属的角色)
    'TARGET',       // 目标 (如技能作用的对象)
    'SELF_STATS',   // 自身的属性包
    'OWNER_STATS',  // 所有者的属性包
    'TARGET_STATS'  // 目标的属性包
  ]).default('SELF_STATS'),
  factor: z.number().optional(),      // 缩放因子 (用于线性缩放)
  threshold: z.number().optional(),   // 阈值 (用于阈值加成判定)
  bonusValue: z.number().optional(),  // 奖励值 (满足阈值后的加成)
  op: z.enum([
    'add', // 加法 (增加数值)
    'mul', // 乘法 (倍率加成)
    'gt',  // 大于判定 (用于阈值)
    'lt',  // 小于判定
    'gte', // 大于等于判定
    'lte'  // 小于等于判定
  ]).default('add'),
  mode: z.enum([
    'percent',         // 百分比模式 (如 当前值/最大值)
    'inverse_percent', // 反向百分比 (如 1 - 当前/最大，常用于『已损失生命值』)
    'value'            // 原始数值模式
  ]).default('value'),
  comment: z.string().optional()
});

/**
 * BehaviorEffectSchema - 行为效果 Schema
 */
export const BehaviorEffectSchema = z.object({
  type: z.string(), // e.g., 'damage', 'heal', 'apply_status', 'record_variable', 'cast_skill'
  baseValue: z.any().optional(),
  element: z.string().optional(),
  radius: z.number().optional(),
  chance: z.number().min(0).max(1).optional(),
  statusId: z.string().optional(),
  skillId: z.string().optional(),
  variable: z.string().optional(), // 用于 record_variable
  valueType: z.string().optional(), // 用于 record_variable (e.g., 'event_damage_value')
  op: z.string().optional(),       // 用于 record_variable (e.g., 'add', 'set')
  
  // 递归判定：该效果自身也可能有前置条件
  conditions: z.array(ConditionSchema).optional(),
  
  // 动态调节器
  regulators: z.array(RegulatorSchema).optional(),
  
  comment: z.string().optional()
});

/**
 * BehaviorSchema - 行为逻辑实体 Schema
 */
export const BehaviorSchema = z.object({
  uuid: ID,
  type: z.literal('behavior').default('behavior'),
  ownerUuid: ID, // 指向 Skill 实例, Character, 或 Status 实例
  name: z.string().optional(),
  
  // 触发时机
  trigger: z.string(), 
  
  // 判定系统
  conditions: z.array(ConditionSchema).optional().default([]),
  
  // 效果系统
  effects: z.array(BehaviorEffectSchema).optional().default([]),
  
  comment: z.string().optional()
});

/**
 * StatsBundleSchema - 属性包实体 Schema
 */
export const StatsBundleSchema = z.object({
  uuid: ID,
  type: z.literal('stats_bundle').default('stats_bundle'),
  ownerUuid: ID, // 指向所属的实体 (Character/Skill/Status 等)
  
  // 预定义的常见属性
  hp: z.number().optional(),
  maxHp: z.number().optional(),
  mp: z.number().optional(),
  maxMp: z.number().optional(),
  atk: z.number().optional(),
  def: z.number().optional(),
  spd: z.number().optional(),
  moveSpeed: z.number().optional(),
  
  // 状态与技能相关变量
  level: z.number().int().optional(),
  exp: z.number().optional(),
  cooldown: z.number().optional(),
  remainingDuration: z.number().optional(),
  tickInterval: z.number().optional(),
}).catchall(z.any());

/**
 * EntityReferenceSchema - 实体实例引用关系 Schema
 */
export const EntityReferenceSchema = z.object({
  uuid: ID,
  type: z.enum([
    'character',
    'skill',
    'item',
    'status',
    'behavior',
    'stats_bundle',
    'projectile'
  ]),
  definitionId: z.string().optional(),
  name: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  
  // 关键引用
  ownerUuid: ID.optional(),
  statsUuid: ID.optional(),
  sourceUuid: ID.optional(),

  // 组件引用
  skillUuids: z.array(ID).optional().default([]),
  itemUuids: z.array(ID).optional().default([]),
  statusUuids: z.array(ID).optional().default([]),
  behaviorUuids: z.array(ID).optional().default([]),

  category: z.enum(['passive', 'active', 'buff', 'debuff', 'permanent']).optional()
});

export type Condition = z.infer<typeof ConditionSchema>;
export type Regulator = z.infer<typeof RegulatorSchema>;
export type BehaviorEffect = z.infer<typeof BehaviorEffectSchema>;
export type Behavior = z.infer<typeof BehaviorSchema>;
export type StatsBundle = z.infer<typeof StatsBundleSchema>;
export type EntityReference = z.infer<typeof EntityReferenceSchema>;
