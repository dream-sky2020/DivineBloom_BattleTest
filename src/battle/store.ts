import { reactive, watch } from 'vue';
import type { EntityReference } from './schemas/common';
import type { AttributeComponent } from './schemas/attribute';
import type { StatsBundle } from './schemas/statsBundle';
import type { Condition } from './schemas/condition';
import type { Trigger } from './schemas/trigger';
import type { Regulator } from './schemas/regulator';

// 定义数据结构
interface BattleState {
  entities: EntityReference[];
  attributes: AttributeComponent[];
  statsBundles: StatsBundle[];
  conditions: Condition[];
  triggers: Trigger[];
  regulators: Regulator[];
}

// 默认初始数据
const DEFAULT_STATE: BattleState = {
  entities: [
    { uuid: 'char-001', type: 'character', name: 'Test Hero', tags: ['player'] }
  ],
  attributes: [
    { id: 'hp', ownerUuid: 'char-001', name: 'HP', valueType: 'int', value: 100 },
    { id: 'atk', ownerUuid: 'char-001', name: 'ATK', valueType: 'int', value: 15 }
  ],
  statsBundles: [
    { uuid: 'bundle-001', ownerUuid: 'char-001', attributeUuids: ['hp', 'atk'], name: 'Base Stats' }
  ],
  conditions: [],
  triggers: [],
  regulators: [],
};

// 1. 初始化响应式状态
// 优先从 localStorage 读取
const savedState = localStorage.getItem('BATTLE_LAB_STATE');
export const state = reactive<BattleState>(savedState ? JSON.parse(savedState) : DEFAULT_STATE);

// 2. 创建广播通道实现多窗口同步
const channel = new BroadcastChannel('BATTLE_LAB_SYNC');

// 3. 监听本地修改并广播
watch(state, (newState) => {
  // 持久化到本地
  localStorage.setItem('BATTLE_LAB_STATE', JSON.stringify(newState));
  // 发送广播（排除自己发出的消息循环）
  channel.postMessage(JSON.stringify(newState));
}, { deep: true });

// 4. 接收来自其他窗口的广播
channel.onmessage = (event) => {
  const remoteState = JSON.parse(event.data);
  // 使用 Object.assign 更新本地状态，保持响应式引用
  Object.assign(state, remoteState);
};

// 5. 提供通用操作函数
export const addToSystem = (type: keyof BattleState, item: any) => {
  state[type].push(JSON.parse(JSON.stringify(item)));
};

export const removeFromSystem = (type: keyof BattleState, uuidOrId: string | number) => {
  // 对于 entities/statsBundles/triggers 使用 uuid，对于 attributes/conditions/regulators 使用 id
  const key = (type === 'entities' || type === 'statsBundles' || type === 'triggers') ? 'uuid' : 'id';
  const index = state[type].findIndex((item: any) => item[key] === uuidOrId);
  if (index !== -1) {
    state[type].splice(index, 1);
  }
};

export const updateInSystem = (type: keyof BattleState, uuidOrId: string | number, newData: any) => {
  const key = (type === 'entities' || type === 'statsBundles' || type === 'triggers') ? 'uuid' : 'id';
  const index = state[type].findIndex((item: any) => item[key] === uuidOrId);
  if (index !== -1) {
    state[type][index] = JSON.parse(JSON.stringify(newData));
  }
};
