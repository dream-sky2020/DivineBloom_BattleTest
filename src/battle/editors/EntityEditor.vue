<script setup lang="ts">
import { ref, computed } from 'vue';
import { state, addToSystem, removeFromSystem, updateInSystem } from '../store';
import type { EntityReference } from '../schemas/common';

// 导入模块化表单
import AttributeForm from './modules/AttributeForm.vue';
import StatsBundleForm from './modules/StatsBundleForm.vue';
import ConditionForm from './modules/ConditionForm.vue';
import RegulatorForm from './modules/RegulatorForm.vue';
import TriggerForm from './modules/TriggerForm.vue';

const selectedUuid = ref<string | number | null>(null);

// ---------------- 选中实体的计算属性 ----------------
const selectedEntity = computed(() => state.entities.find(e => e.uuid === selectedUuid.value) || null);
const entityAttributes = computed(() => state.attributes.filter(a => a.ownerUuid === selectedUuid.value));
const entityBundles = computed(() => state.statsBundles.filter(b => b.ownerUuid === selectedUuid.value));
const entityConditions = computed(() => state.conditions.filter(c => c.ownerUuid === selectedUuid.value));
const entityTriggers = computed(() => state.triggers.filter(t => t.ownerUuid === selectedUuid.value));
const entityRegulators = computed(() => state.regulators.filter(r => r.ownerUuid === selectedUuid.value));

// ---------------- 浏览面板助手函数 ----------------
const getEntityAttributes = (uuid: string | number) => state.attributes.filter(a => a.ownerUuid === uuid);
const getEntityBundles = (uuid: string | number) => state.statsBundles.filter(b => b.ownerUuid === uuid);

// ---------------- 基础操作 ----------------
const createEntity = () => {
  const newEntity: EntityReference = {
    uuid: 'ent_' + Date.now(),
    type: 'character',
    name: 'New Entity',
    tags: []
  };
  addToSystem('entities', newEntity);
  selectedUuid.value = newEntity.uuid;
};

const deleteEntity = (uuid: string | number) => {
  if (confirm('Delete entity?')) {
    removeFromSystem('entities', uuid);
    if (selectedUuid.value === uuid) selectedUuid.value = null;
  }
};

const updateEntityField = (field: keyof EntityReference, value: any) => {
  if (!selectedEntity.value) return;
  updateInSystem('entities', selectedEntity.value.uuid, { ...selectedEntity.value, [field]: value });
};

const addComponent = (type: any) => {
  if (!selectedUuid.value) return;
  const ownerUuid = selectedUuid.value;
  if (type === 'attributes') addToSystem('attributes', { id: 'attr_' + Date.now(), name: 'New Attr', valueType: 'int', value: 0, ownerUuid });
  else if (type === 'statsBundles') addToSystem('statsBundles', { uuid: 'bundle_' + Date.now(), name: 'New Bundle', attributeUuids: [], ownerUuid });
  else if (type === 'conditions') addToSystem('conditions', { id: 'cond_' + Date.now(), name: 'New Condition', op: 'eq', attributeId: '', value: 0, ownerUuid, targetUuid: '' });
  else if (type === 'regulators') addToSystem('regulators', { id: 'reg_' + Date.now(), name: 'New Regulator', type: 'LINEAR_SCALING', mode: 'value', op: 'add', factor: 1, ownerUuid });
  else if (type === 'triggers') addToSystem('triggers', { uuid: 'trig_' + Date.now(), name: 'New Trigger', ownerUuid, root: { type: 'TRUE' } });
};

const tagInput = ref('');
const addTag = () => {
  if (!tagInput.value || !selectedEntity.value) return;
  const tags = [...(selectedEntity.value.tags || [])];
  if (!tags.includes(tagInput.value)) {
    tags.push(tagInput.value);
    updateEntityField('tags', tags);
  }
  tagInput.value = '';
};
</script>

<template>
  <div class="split-view-container">
    <!-- 1. 左侧：实体编辑器 (Editor) - 独立滚动 -->
    <section class="col editor-column" v-if="selectedEntity">
      <div class="col-header">
        <span>Editing: {{ selectedEntity.name }}</span>
      </div>
      <div class="col-body scrollable">
        <!-- Meta -->
        <div class="group">
          <h3>Meta Data</h3>
          <div class="field">
            <label :for="'ent-name-' + selectedEntity.uuid">Name</label>
            <input :id="'ent-name-' + selectedEntity.uuid" name="entity-name" :value="selectedEntity.name" @input="e => updateEntityField('name', (e.target as HTMLInputElement).value)" />
          </div>
          <div class="field">
            <label :for="'ent-type-' + selectedEntity.uuid">Type</label>
            <input :id="'ent-type-' + selectedEntity.uuid" name="entity-type" :value="selectedEntity.type" @input="e => updateEntityField('type', (e.target as HTMLInputElement).value)" />
          </div>
          <div class="field">
            <label :for="'ent-tag-' + selectedEntity.uuid">Tags</label>
            <div class="tag-row">
              <input :id="'ent-tag-' + selectedEntity.uuid" name="entity-tag-input" v-model="tagInput" @keyup.enter="addTag" placeholder="+" />
              <div class="pills">
                <span v-for="t in selectedEntity.tags" :key="t" class="pill">{{ t }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Components -->
        <div class="group">
          <div class="group-header"><h3>Attributes</h3> <button @click="addComponent('attributes')">+</button></div>
          <AttributeForm v-for="a in entityAttributes" :key="a.id" :modelValue="a" @update:modelValue="val => updateInSystem('attributes', a.id, val)" @delete="removeFromSystem('attributes', a.id)" />
        </div>

        <div class="group">
          <div class="group-header"><h3>Stats Bundles</h3> <button @click="addComponent('statsBundles')">+</button></div>
          <StatsBundleForm v-for="b in entityBundles" :key="b.uuid" :modelValue="b" @update:modelValue="val => updateInSystem('statsBundles', b.uuid, val)" @delete="removeFromSystem('statsBundles', b.uuid)" />
        </div>

        <div class="group">
          <div class="group-header"><h3>Conditions</h3> <button @click="addComponent('conditions')">+</button></div>
          <ConditionForm v-for="c in entityConditions" :key="c.id" :modelValue="c" @update:modelValue="val => updateInSystem('conditions', c.id, val)" @delete="removeFromSystem('conditions', c.id)" />
        </div>

        <div class="group">
          <div class="group-header"><h3>Regulators</h3> <button @click="addComponent('regulators')">+</button></div>
          <RegulatorForm v-for="r in entityRegulators" :key="r.id" :modelValue="r" @update:modelValue="val => updateInSystem('regulators', r.id, val)" @delete="removeFromSystem('regulators', r.id)" />
        </div>

        <div class="group">
          <div class="group-header"><h3>Triggers</h3> <button @click="addComponent('triggers')">+</button></div>
          <TriggerForm v-for="t in entityTriggers" :key="t.uuid" :modelValue="t" @update:modelValue="val => updateInSystem('triggers', t.uuid, val)" @delete="removeFromSystem('triggers', t.uuid)" />
        </div>
      </div>
    </section>
    <div class="col editor-column empty" v-else>Select an entity from the browser to edit</div>

    <!-- 2. 右侧：全局浏览器 (Browser) - 独立滚动 -->
    <section class="col browser-column">
      <div class="col-header">
        <span>Global Entity Browser ({{ state.entities.length }})</span>
        <button class="add-mini" @click="createEntity">+ Add Entity</button>
      </div>
      <div class="col-body scrollable grid">
        <div v-for="entity in state.entities" :key="entity.uuid" 
             class="browser-card" :class="{ selected: selectedUuid === entity.uuid }"
             @click="selectedUuid = entity.uuid">
          <div class="card-head">
            <span class="type-badge">{{ entity.type }}</span>
            <span class="name">{{ entity.name || 'Unnamed' }}</span>
            <button class="del-card-btn" @click.stop="deleteEntity(entity.uuid)">×</button>
          </div>
          <div class="card-stats">
            <div class="stat-line" v-for="a in getEntityAttributes(entity.uuid)" :key="a.id">
              {{ a.name }}: <strong>{{ a.value }}</strong>
            </div>
            <div class="bundle-line" v-for="b in getEntityBundles(entity.uuid)" :key="b.uuid">
              📦 {{ b.name }} ({{ b.attributeUuids.length }})
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.split-view-container {
  display: flex;
  height: calc(100vh - 80px);
  width: 100%;
  background: #000;
  overflow: hidden;
}

/* 通用列样式 */
.col {
  display: flex;
  flex-direction: column;
  border-right: 1px solid #222;
}
.col-header {
  padding: 12px 15px;
  background: #111;
  border-bottom: 1px solid #333;
  font-size: 12px;
  font-weight: bold;
  color: #888;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-transform: uppercase;
}
.col-body.scrollable {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* 1. Editor (500px) */
.editor-column { width: 500px; background: #1a1a1a; }
.group { margin-bottom: 30px; }
.group-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #333; }
.group h3 { font-size: 14px; color: #42b883; margin: 0; padding-bottom: 5px; }
.group-header button { background: #333; border: none; color: #42b883; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; }

.field { margin-bottom: 15px; }
.field label { display: block; font-size: 11px; color: #666; margin-bottom: 5px; }
.field input { width: 100%; background: #000; border: 1px solid #333; color: #ccc; padding: 8px; border-radius: 4px; font-size: 13px; }

/* 2. Browser (Flexible) */
.browser-column { flex: 1; background: #111; }
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
}
.browser-card {
  background: #181818;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 15px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}
.browser-card:hover { border-color: #555; background: #202020; }
.browser-card.selected { border-color: #42b883; background: #1a251e; box-shadow: 0 0 10px rgba(66, 184, 131, 0.1); }

.card-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding-right: 20px; }
.name { font-weight: bold; font-size: 14px; color: #eee; }
.type-badge { background: #42b883; color: #000; font-size: 9px; font-weight: bold; padding: 1px 4px; border-radius: 3px; text-transform: uppercase; }

.del-card-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: #444;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 0;
}
.del-card-btn:hover { color: #f55; }

.card-stats { font-size: 11px; color: #888; border-top: 1px solid #222; padding-top: 10px; }
.stat-line { margin-bottom: 4px; display: flex; justify-content: space-between; }
.stat-line strong { color: #569cd6; }
.bundle-line { margin-top: 5px; color: #ce9178; }

/* 按钮 */
.add-mini { background: #42b883; border: none; color: #000; padding: 4px 12px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; }
.add-mini:hover { background: #33a06f; }

.empty { align-items: center; justify-content: center; color: #444; text-align: center; font-style: italic; }
.tag-row { display: flex; flex-direction: column; gap: 5px; }
.pills { display: flex; flex-wrap: wrap; gap: 5px; }
.pill { background: #333; padding: 2px 6px; border-radius: 3px; font-size: 10px; color: #aaa; }
</style>
