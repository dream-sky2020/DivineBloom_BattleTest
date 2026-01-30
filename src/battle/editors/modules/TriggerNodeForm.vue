<script setup lang="ts">
import type { TriggerNode } from '../../schemas/trigger';
import ConditionForm from './ConditionForm.vue';

const props = defineProps<{
  modelValue: TriggerNode;
}>();

const emit = defineEmits(['update:modelValue']);

const nodeTypes = [
  { label: '基础叶子节点 (Condition)', value: 'CONDITION' },
  { label: '二元逻辑: 与 (AND)', value: 'AND' },
  { label: '二元逻辑: 或 (OR)', value: 'OR' },
  { label: '一元逻辑: 非 (NOT)', value: 'NOT' },
  { label: '常量叶子: 真 (TRUE)', value: 'TRUE' },
  { label: '常量叶子: 假 (FALSE)', value: 'FALSE' },
];

const changeType = (newType: string) => {
  let newNode: any = { type: newType };
  if (newType === 'CONDITION') newNode.condition = { id: 'new_cond', name: 'New Condition', op: 'eq', value: 0 };
  else if (newType === 'AND' || newType === 'OR') { newNode.left = { type: 'TRUE' }; newNode.right = { type: 'TRUE' }; }
  else if (newType === 'NOT') newNode.child = { type: 'TRUE' };
  emit('update:modelValue', newNode);
};

const updateChild = (key: string, value: any) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value });
};
</script>

<template>
  <div class="trigger-node-module" :class="modelValue.type.toLowerCase()">
    <div class="node-mini-header">
      <select :value="modelValue.type" @change="e => changeType((e.target as HTMLSelectElement).value)">
        <option v-for="t in nodeTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
      </select>
    </div>

    <div class="node-mini-body">
      <div v-if="modelValue.type === 'CONDITION'" class="nested-form">
        <ConditionForm :modelValue="modelValue.condition" @update:modelValue="val => updateChild('condition', val)" />
      </div>

      <div v-if="modelValue.type === 'AND' || modelValue.type === 'OR'" class="binary-row">
        <div class="branch-col">
          <TriggerNodeForm :modelValue="modelValue.left" @update:modelValue="val => updateChild('left', val)" />
        </div>
        <div class="branch-col">
          <TriggerNodeForm :modelValue="modelValue.right" @update:modelValue="val => updateChild('right', val)" />
        </div>
      </div>

      <div v-if="modelValue.type === 'NOT'" class="unary-row">
        <TriggerNodeForm :modelValue="modelValue.child" @update:modelValue="val => updateChild('child', val)" />
      </div>

      <div v-if="modelValue.type === 'TRUE' || modelValue.type === 'FALSE'" class="constant-label">
        {{ modelValue.type === 'TRUE' ? 'ALWAYS TRUE' : 'ALWAYS FALSE' }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.trigger-node-module { border: 1px solid #333; padding: 10px; border-radius: 4px; background: rgba(0,0,0,0.2); margin-top: 5px; }
.node-mini-header select { background: #222; color: #aaa; border: 1px solid #444; font-size: 10px; padding: 2px 5px; border-radius: 3px; }
.binary-row { display: flex; gap: 10px; padding-left: 10px; border-left: 1px dashed #444; margin-top: 5px; }
.branch-col { flex: 1; }
.constant-label { font-size: 10px; color: #666; text-align: center; padding: 5px; }
.and { border-left: 3px solid #3498db; }
.or { border-left: 3px solid #f1c40f; }
.not { border-left: 3px solid #e74c3c; }
.condition { border-left: 3px solid #42b883; }
</style>
