<template>
  <div>
    <el-transfer
      v-model="userGroups"
      :render-content="renderFunc"
      :titles="['可用 角色', '选中的 角色']"
      :data="groups"
      @change="changeTransferGroup"
    />
  </div>
</template>

<script>
export default {
  props: {
    groups: {
      type: Array,
      default: () => {
        return []
      }
    },
    defaultGroups: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    userGroups: {
      // eslint-disable-next-line vue/return-in-computed-property
      get() {
        if (this.defaultGroups.length > 0) {
          return this.defaultGroups || []
        }
      },
      set() { }
    }
  },
  methods: {
    renderFunc(h, option) {
      return <span title={option.name}>{option.name}</span>
    },
    changeTransferGroup(val) {
      this.$emit('changeTransferGroup', val)
    }
  }
}
</script>

<style>

</style>
