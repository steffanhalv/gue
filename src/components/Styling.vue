<template>
  <div class="styles" :key="renderKey" :class="selected && selected.motion ? 'timeline-wrapper' : 'keypoint-wrapper'">
    <label v-if="selected && selected.motion"><b>Timeline</b></label>
    <label
      style="cursor: pointer; float: left; width: auto;"
      @click="$emit('motion', selected), $emit('parent', parent)"
      v-else-if="selected && typeof selected.index !== 'undefined'">
      <label style="cursor: pointer" v-if="!nest" @click="$emit('motion', parent), $emit('parent', null)">
        Back
      </label>
      <b>Keypoint {{ selected.index }}</b>
    </label>
    <button v-if="selected && !selected.motion && typeof selected.index !== 'undefined'" style="width: auto; float: right; margin: 8px 10px 0; padding: 5px" class="add-btn" @click="removeMotion()">
      Delete
    </button>
    <label v-else>Style</label>
    <div v-if="store.current" style="color: #eee" class="style-keys">
      <div
        :key="key"
        v-for="(value, key) in style"
      >
        <span style="width: 50%; text-align: left; float: left; margin: 0">
          <button class="remove-btn" @click="remove(key)">-</button>
          {{ key }}
        </span>
        <input
          @input="render(selected, parent)"
          style="width: calc(50% - 6px); float: right; margin: 0; border: 0; padding: 5px 3px;"
          v-model="style[key]" />
      </div>
      <div v-if="selected && typeof selected.index !== 'undefined'">
        <span style="font-size: .8em; padding: 6px 0 2px 5px; background: #888; color: #fff; width: calc(50% - 10px); text-align: left; float: left; margin: 0">
          Index {{ selected.index }}
        </span>
        <input
          @input="render(selected, parent)"
          style="width: calc(50% - 6px); float: right; margin: 0; border: 0; padding: 5px 3px;"
          v-model="selected.index" />
      </div>
      <div>
        <input
          @keyup.enter="append(newKey, newValue)"
          placeholder="Key"
          v-model="newKey"
          style="width: calc(40% - 9px); float: left; margin: 0 3px 0 0; border: 0; padding: 5px 3px;"
        />
        <input
          @keyup.enter="append(newKey, newValue)"
          placeholder="Value"
          v-model="newValue"
          style="width: calc(40% - 9px); float: left; margin: 0 0 0 3px; border: 0; padding: 5px 3px;"
        />
        <button class="add-btn" @click="append(newKey, newValue)">Add</button>
      </div>
      <span v-if="selected && selected.motion">
        <styling
          @save="$emit('save')"
          @render="render($event, selected)"
          @motion="$emit('motion', $event)"
          @parent="$emit('parent', $event)"
          :idx="key"
          :nest="true"
          :parent="selected"
          :selected="motion"
          :key="key"
          v-for="(motion, key) in selected.motion"/>
      </span>
    </div>
    <button style="width: 100px; margin: 3px" class="add-btn" @click="add()" v-if="selected && selected.motion">
      Add key
    </button>
    <button style="width: 100px; margin: 3px" class="add-btn" @click="sort()" v-if="selected && selected.motion">
      Sort
    </button>
  </div>
</template>

<script>
export default {
  name: 'styling',
  props: ['selected', 'parent', 'nest', 'idx'],
  data() {
    return {
      newKey: '',
      newValue: '',
      renderKey: 'renderer_key'
    }
  },
  computed: {
    style() {
      if (this.selected && this.selected.style)
        return this.selected.style
      if (this.selected && this.selected.current)
        return this.selected.current
      return this.selected
    }
  },
  methods: {
    removeMotion() {
      this.parent.motion.splice(this.idx, 1)
    },
    add() {
      if (this.selected.motion.length) {
        this.selected.motion.push(
          JSON.parse(JSON.stringify(this.selected.motion[this.selected.motion.length - 1]))
        )
        this.selected.motion.sort((a, b) =>
          a.index > b.index ? 1 : b.index > a.index ? -1 : 0
        )
      } else {
        this.selected.motion.push({
          index: 0
        })
      }
    },
    append(key, value) {
      this.newKey = ''
      this.newValue = ''
      let obj = this.selected
      if (this.selected && this.selected.style)
        obj = this.selected.style
      if (this.selected && this.selected.current)
        obj = this.selected.current
      obj[key] = value
      this.renderKey = Math.random().toString(36).substring(7)
      this.$emit('save')
    },
    remove(key) {
      let obj = this.selected
      if (this.selected && this.selected.style)
        obj = this.selected.style
      if (this.selected && this.selected.current)
        obj = this.selected.current
      delete obj[key]
      this.renderKey = Math.random().toString(36).substring(7)
      this.$emit('save')
    },
    sort() {
      if (this.selected.motion) {
        this.selected.motion = this.selected.motion.sort((a, b) =>
          Number(a.index) > Number(b.index) ? 1 : Number(b.index) > Number(a.index) ? -1 : 0
        )
      } else if (this.parent.motion) {
        this.parent.motion = this.parent.motion.sort((a, b) =>
          Number(a.index) > Number(b.index) ? 1 : Number(b.index) > Number(a.index) ? -1 : 0
        )
      }
    },
    render(selected, parent) {
      this.$emit('render', {
        motion: selected,
        parent: parent
      })
    }
  }
}
</script>

<style scoped>
input {
  color: #fff;
  background: #333;
  font-size: .9em;
}
label {
  border-top: 5px solid #4c4c4c;
  color: #eee;
  padding: 4px;
  display: inline-block;
  width: 100%;
}
.styles {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background: #555;
}
.styles > div > div {
  display: inline-block;
  padding: 2px 5px;
  color: #eee;
  background-color: #444;
  cursor: pointer;
  width: calc(100% - 8px);
  border-bottom: 1px solid #3b3b3b;
}
.styles > div > div:hover {
  color: #c5c5c5;
  background-color: #333;
}
.motion-select:hover {
  background-color: #333;
}
.motion-select {
  background-color: #444;
  cursor: pointer;
  width: calc(100% - 6px);
  padding: 3px;
  display: inline-block;
  text-align: left;
}
.add-btn:hover, .remove-btn:hover {
  background: rgb(40, 126, 255);
  color: white;
}
.add-btn {
  cursor: pointer;
  border: none;
  width: calc(20% - 6px);
  padding: 7px 3px;
  float: right;
  border-radius: 2px;
  background: #222;
  color: white;
}
.remove-btn {
  cursor: pointer;
  border: none;
  width: 18px;
  padding: 2px 3px;
  margin: 3px 5px 0 0;
  float: left;
  border-radius: 2px;
  background: #222;
  color: white;
}
span {
  padding-top: 2px;
}
.timeline-wrapper .keypoint-wrapper .style-keys {
  display: none;
}
.timeline-wrapper .style-keys {
  /*display: none;*/
}
</style>
