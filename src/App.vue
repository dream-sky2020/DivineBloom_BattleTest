<script setup lang="ts">
import { ref, reactive } from 'vue'
import { state, addToSystem } from './battle/store'
import type { AttributeComponent } from './battle/schemas/attribute'
import type { StatsBundle } from './battle/schemas/statsBundle'
import type { Condition } from './battle/schemas/condition'
import type { Trigger } from './battle/schemas/trigger'
import type { Regulator } from './battle/schemas/regulator'
import ConditionEditor from './battle/editors/ConditionEditor.vue'
import TriggerEditor from './battle/editors/TriggerEditor.vue'
import RegulatorEditor from './battle/editors/RegulatorEditor.vue'
import EntityEditor from './battle/editors/EntityEditor.vue'
import AttributeEditor from './battle/editors/AttributeEditor.vue'
import StatsBundleEditor from './battle/editors/StatsBundleEditor.vue'

// 当前视图
const currentView = ref('dashboard') // dashboard | entity_manager | entity_editor | attribute | stats_bundle | condition | trigger | regulator

interface TempState {
  newAttribute: Partial<AttributeComponent>;
  newStatsBundle: Partial<StatsBundle>;
  newCondition: Partial<Condition>;
  newTrigger: Trigger;
  newRegulator: Partial<Regulator>;
}

// 编辑器用的临时状态 (仅在当前窗口生效，直到点击“保存”)
const tempState = reactive<TempState>({
  newAttribute: { 
    id: 'attr_' + Date.now(), 
    name: 'New Attribute', 
    valueType: 'int', 
    value: 0, 
    ownerUuid: 'char-001' 
  },
  newStatsBundle: { 
    uuid: 'bundle_' + Date.now(), 
    name: 'New Bundle', 
    attributeUuids: [], 
    ownerUuid: 'char-001' 
  },
  newCondition: { 
    id: 'cond_' + Date.now(), 
    name: 'New Condition', 
    op: 'eq', 
    attributeId: 'hp', 
    value: 10, 
    ownerUuid: 'system', 
    targetUuid: 'target' 
  },
  newTrigger: {
    uuid: 'trig_' + Date.now(),
    name: 'New Trigger',
    ownerUuid: 'system',
    root: { type: 'AND', left: { type: 'TRUE' }, right: { type: 'FALSE' } }
  },
  newRegulator: { 
    id: 'reg_' + Date.now(), 
    name: 'New Regulator', 
    type: 'LINEAR_SCALING', 
    mode: 'value', 
    op: 'add', 
    factor: 1, 
    ownerUuid: 'system' 
  }
})

const navigate = (view: string) => {
  currentView.value = view
}

// 保存逻辑
const saveToPool = (type: any, data: any) => {
  addToSystem(type, data);
  alert('已同步到全局数据池');
}
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">Battle Lab</div>
      <nav>
        <button :class="{ active: currentView === 'dashboard' }" @click="navigate('dashboard')">Dashboard</button>
        <button :class="{ active: currentView === 'entity_editor' }" @click="navigate('entity_editor')">Entity Manager</button>
        <button :class="{ active: currentView === 'attribute' }" @click="navigate('attribute')">Attributes</button>
        <button :class="{ active: currentView === 'stats_bundle' }" @click="navigate('stats_bundle')">StatsBundles</button>
        <button :class="{ active: currentView === 'condition' }" @click="navigate('condition')">Conditions</button>
        <button :class="{ active: currentView === 'trigger' }" @click="navigate('trigger')">Triggers</button>
        <button :class="{ active: currentView === 'regulator' }" @click="navigate('regulator')">Regulators</button>
      </nav>
      <div class="sync-status">
        <span class="dot"></span> Multi-Tab Sync Active
      </div>
    </aside>

    <main class="main-content">
      <header>
        <h1>{{ currentView.toUpperCase() }}</h1>
      </header>

      <!-- Dashboard -->
      <section v-if="currentView === 'dashboard'" class="dashboard">
        <div class="content-grid">
          <div class="entity-list">
            <h2>Shared Entities Pool</h2>
            <div v-for="entity in state.entities" :key="entity.uuid" class="card">
              <strong>{{ entity.name }}</strong> <small>{{ entity.type }}</small>
            </div>
          </div>
          <div class="debug-view">
            <h2>Real-time Shared State</h2>
            <pre>{{ JSON.stringify(state, null, 2) }}</pre>
          </div>
        </div>
      </section>

      <!-- Entity Manager -->
      <section v-if="currentView === 'entity_editor'">
        <EntityEditor />
      </section>

      <!-- 各个组件编辑器 -->
      <section v-if="currentView === 'attribute'">
        <div class="editor-container">
          <AttributeEditor v-model="tempState.newAttribute" />
          <div class="preview">
            <button @click="saveToPool('attributes', tempState.newAttribute)" class="save-btn">Save to Shared Pool</button>
            <pre>{{ JSON.stringify(tempState.newAttribute, null, 2) }}</pre>
          </div>
        </div>
      </section>

      <section v-if="currentView === 'stats_bundle'">
        <div class="editor-container">
          <StatsBundleEditor v-model="tempState.newStatsBundle" />
          <div class="preview">
            <button @click="saveToPool('statsBundles', tempState.newStatsBundle)" class="save-btn">Save to Shared Pool</button>
            <pre>{{ JSON.stringify(tempState.newStatsBundle, null, 2) }}</pre>
          </div>
        </div>
      </section>

      <section v-if="currentView === 'condition'">
        <div class="editor-container">
          <ConditionEditor v-model="tempState.newCondition" />
          <div class="preview">
            <button @click="saveToPool('conditions', tempState.newCondition)" class="save-btn">Save to Shared Pool</button>
            <pre>{{ JSON.stringify(tempState.newCondition, null, 2) }}</pre>
          </div>
        </div>
      </section>

      <section v-if="currentView === 'trigger'">
        <div class="editor-container full-width">
          <TriggerEditor v-model="tempState.newTrigger" />
          <div class="preview">
            <button @click="saveToPool('triggers', tempState.newTrigger)" class="save-btn">Save to Shared Pool</button>
            <pre>{{ JSON.stringify(tempState.newTrigger, null, 2) }}</pre>
          </div>
        </div>
      </section>

      <section v-if="currentView === 'regulator'">
        <div class="editor-container">
          <RegulatorEditor v-model="tempState.newRegulator" />
          <div class="preview">
            <button @click="saveToPool('regulators', tempState.newRegulator)" class="save-btn">Save to Shared Pool</button>
            <pre>{{ JSON.stringify(tempState.newRegulator, null, 2) }}</pre>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style>
body { margin: 0; background: #1a1a1a; color: #e0e0e0; font-family: sans-serif; }
.layout { display: flex; height: 100vh; }
.sidebar { width: 240px; background: #111; border-right: 1px solid #333; display: flex; flex-direction: column; position: relative;}
.logo { padding: 20px; font-size: 20px; font-weight: bold; color: #42b883; border-bottom: 1px solid #333; }
nav { padding: 10px; flex: 1; }
nav button { width: 100%; padding: 12px; margin-bottom: 5px; background: transparent; border: none; color: #999; text-align: left; cursor: pointer; border-radius: 4px; }
nav button.active { background: #42b88322; color: #42b883; font-weight: bold; }

.sync-status {
  padding: 15px;
  font-size: 11px;
  color: #666;
  border-top: 1px solid #333;
  display: flex;
  align-items: center;
  gap: 8px;
}
.dot { width: 8px; height: 8px; background: #42b883; border-radius: 50%; box-shadow: 0 0 8px #42b883; }

.main-content { flex: 1; overflow-y: auto; padding: 20px; background: #1e1e1e; }
header { margin-bottom: 20px; }
header h1 { margin: 0; font-size: 20px; color: #fff; display: flex; align-items: center; gap: 10px; }
header h1::after { content: ''; flex: 1; height: 1px; background: #333; }
.content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; width: 100%; }
.editor-container { display: grid; grid-template-columns: minmax(400px, 1fr) 450px; gap: 20px; align-items: start; }
.editor-container.full-width { grid-template-columns: 1fr 450px; }
.debug-view pre, .preview pre { background: #000; padding: 15px; border-radius: 8px; font-size: 13px; line-height: 1.5; border: 1px solid #333; color: #a9dc76; overflow: auto; max-height: calc(100vh - 120px); }
.card { background: #222; padding: 10px; margin-bottom: 10px; border-radius: 4px; border: 1px solid #333; }
.save-btn { background: #42b883; border: none; color: white; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-bottom: 10px; width: 100%; font-weight: bold;}
</style>
