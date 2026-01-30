<script setup lang="ts">
import type { Trigger } from '../schemas/trigger';
import TriggerNodeEditor from './TriggerNodeEditor.vue';

const props = defineProps<{
  modelValue: Trigger;
}>();

const emit = defineEmits(['update:modelValue']);

const updateRoot = (newRoot: any) => {
  emit('update:modelValue', { ...props.modelValue, root: newRoot });
};

const updateField = (field: keyof Trigger, value: string) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value });
};
</script>

<template>
  <div class="trigger-editor">
    <div class="meta-section">
      <h3>触发器基础配置</h3>
      <div class="form-row">
        <div class="form-group">
          <label>触发器名称:</label>
          <input :value="modelValue.name" @input="e => updateField('name', (e.target as HTMLInputElement).value)" />
        </div>
        <div class="form-group">
          <label>UUID:</label>
          <input :value="modelValue.uuid" disabled />
        </div>
      </div>
    </div>

    <div class="logic-section">
      <h3>逻辑树编辑器 (二叉树)</h3>
      <TriggerNodeEditor :modelValue="modelValue.root" @update:modelValue="updateRoot" />
    </div>
  </div>
</template>

<style scoped>
.trigger-editor {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.meta-section {
  background: #222;
  padding: 15px;
  border-radius: 8px;
}
.form-row {
  display: flex;
  gap: 15px;
}
.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-size: 12px;
  color: #888;
  margin-bottom: 5px;
}
.form-group input {
  background: #111;
  border: 1px solid #444;
  color: white;
  padding: 8px;
  border-radius: 4px;
}
.logic-section {
  background: #1a1a1a;
  padding: 20px;
  border-radius: 8px;
  border: 1px dashed #444;
}
</style>
