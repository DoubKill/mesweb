<template>
  <div>
    <el-pagination
      layout="total,prev,pager,next"
      :total="total"
      :page-size="pageSize"
      :current-page.sync="currentPage"
      @current-change="currentChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    // 总页数，需要传进来
    total: {
      type: Number,
      default: 0
    },
    // 统一的当前展示多少页，一般不会用到
    pageSize: {
      type: Number,
      default: 10
    }
    // currentPage:{
    //   type: Number,
    //   default: 1,
    // },
  },
  data() {
    return {
      currentPage: 1
    }
  },
  methods: {
    currentChange(page) {
      this.$emit('currentChange', page)
    }
  }
}
</script>

<style>
</style>
