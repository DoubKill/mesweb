<template>
  <div style="display:flex;margin-top:5px">
    <!-- <el-button type="success" size="mini">查看全部</el-button> -->
    <el-pagination
      v-if="oldPage"
      layout="total,prev,pager,next"
      :total="total"
      :page-size="pageSize"
      :current-page.sync="_currentPage"
      @current-change="currentChange"
    />
    <el-pagination
      v-else
      :current-page.sync="_currentPage"
      :page-sizes="[10, 50, 100]"
      :page-size="pageSize"
      layout="sizes, prev, pager, next"
      :total="total"
      @size-change="currentChange(1,$event)"
      @current-change="currentChange($event,pageSize)"
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
    // pageSize: {
    //   type: Number,
    //   default: 10
    // },
    currentPage: {
      type: Number,
      default: 1
    },
    oldPage: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      pageSize: 10
    }
  },
  computed: {
    _currentPage: {
      get() {
        return this.currentPage
      },
      set() {
        return 1
      }
    }
  },
  methods: {
    currentChange(page, page_size) {
      this.pageSize = page_size
      if (this.oldPage) {
        this.$emit('currentChange', page)
        return
      }
      this.$emit('currentChange', page, page_size)
    }
  }
}
</script>

<style>
</style>
