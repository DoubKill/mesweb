<template>
  <div>
    <!-- 未用到 -->
    <el-table
      v-if="_tableDataStyle.length>0&&tableDataChildLength>0"
      :data="[{}]"
      border
      class="rigthTable"
      width="100%"
    >
      <div v-for="(valItem,i) in _tableDataStyle" :key="i">
        <el-table-column
          :label="valItem.test_indicator"
        >
          <template v-if="valItem.methods.length>0">
            <el-radio
              v-for="(itemData,ik) in valItem.methods"
              :key="ik"
              v-model="valItem.checkedC"
              :label="itemData"
              :disabled="!itemData.allowed"
              @change="changeMethods"
            >
              {{ itemData.name }}
            </el-radio>
            <span v-if="false">{{ scope.row }}</span>
            <br>
            <el-button style="margin-top:5px" size="mini" @click="clearRadio(valItem,i)">清除</el-button>
          </template>
        </el-table-column>
      </div>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tableDataStyle: {
      type: Array,
      default() {
        return []
      }
    },
    tableDataChildLength: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {
    _tableDataStyle: {
      get() {
        return this.tableDataStyle
      }
    }
  },
  methods: {
    changeMethods() {
      this.$emit('changeMethods')
    }
  }
}
</script>

<style>

</style>
