<template>
  <div>
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
      :page-sizes="[10, 20, 30, 40,50]"
      :page-size="_pageSize"
      layout="sizes, prev, pager, next"
      :total="total"
      @size-change="currentChange(1,$event)"
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
    },
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
    },
    _pageSize: {
      get() {
        return this.pageSize
      },
      set(val) {
        return val
      }
    }
  },
  methods: {
    currentChange(page, page_size) {
      this._pageSize = page_size
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
