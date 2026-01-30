<script setup lang="ts">
import type { TriggerNode } from '../schemas/trigger';
import ConditionEditor from './ConditionEditor.vue';

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
  
  if (newType === 'CONDITION') {
    newNode.condition = { id: 'new_cond', name: '新条件', op: 'eq', value: 0 };
  } else if (newType === 'AND' || newType === 'OR') {
    newNode.left = { type: 'TRUE' };
    newNode.right = { type: 'TRUE' };
  } else if (newType === 'NOT') {
    newNode.child = { type: 'TRUE' };
  }
  
  emit('update:modelValue', newNode);
};

const updateChild = (key: 'left' | 'right' | 'child' | 'condition', value: any) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value });
};
</script>

<template>
  <div class="node-container" :class="modelValue.type.toLowerCase()">
    <div class="node-header">
      <select :value="modelValue.type" @change="e => changeType((e.target as HTMLSelectElement).value)">
        <option v-for="t in nodeTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
      </select>
    </div>

    <div class="node-body">
      <!-- 条件节点 -->
      <div v-if="modelValue.type === 'CONDITION'" class="condition-wrapper">
        <ConditionEditor 
          :modelValue="modelValue.condition" 
          @update:modelValue="val => updateChild('condition', val)" 
        />
      </div>

      <!-- 二元逻辑节点 (AND/OR) -->
      <div v-if="modelValue.type === 'AND' || modelValue.type === 'OR'" class="binary-nodes">
        <div class="branch">
          <span class="label">左分支:</span>
          <TriggerNodeEditor 
            :modelValue="modelValue.left" 
            @update:modelValue="val => updateChild('left', val)" 
          />
        </div>
        <div class="branch">
          <span class="label">右分支:</span>
          <TriggerNodeEditor 
            :modelValue="modelValue.right" 
            @update:modelValue="val => updateChild('right', val)" 
          />
        </div>
      </div>

      <!-- 一元逻辑节点 (NOT) -->
      <div v-if="modelValue.type === 'NOT'" class="unary-node">
        <TriggerNodeEditor 
          :modelValue="modelValue.child" 
          @update:modelValue="val => updateChild('child', val)" 
        />
      </div>

      <!-- 常量节点 (TRUE/FALSE) -->
      <div v-if="modelValue.type === 'TRUE' || modelValue.type === 'FALSE'" class="constant-node">
        {{ modelValue.type === 'TRUE' ? '✅ 总是通过' : '❌ 总是失败' }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.node-container {
  border: 1px solid #444;
  padding: 15px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  margin-top: 15px;
  width: 100%;
  box-sizing: border-box;
}
.node-header {
  margin-bottom: 15px;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.node-header select {
  background: #333;
  color: white;
  border: 1px solid #444;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.binary-nodes {
  display: flex;
  gap: 30px;
  padding-left: 20px;
  border-left: 2px solid #444;
}
.branch {
  flex: 1;
  min-width: 0; /* 防止子元素溢出 */
}
.label {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: block;
  margin-bottom: 10px;
}
.condition-wrapper {
  width: 100%;
}
.and { border-left: 4px solid #3498db; }
.or { border-left: 4px solid #f1c40f; }
.not { border-left: 4px solid #e74c3c; }
.condition { border-left: 4px solid #42b883; }
</style>
