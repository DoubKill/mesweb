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
    <div v-else style="display:flex">
      <el-select
        v-model="pageSize"
        style="width:110px"
        size="mini"
        placeholder="请选择"
        @change="currentChange(1,$event)"
      >
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-pagination
        :current-page.sync="_currentPage"
        layout="total,prev,pager,next"
        :page-size="pageSize"
        :total="total"
        @current-change="currentChange($event,pageSize)"
      />
    </div>
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
      pageSize: 10,
      options: [
        { id: 10, name: '10条/页' },
        { id: 50, name: '50条/页' },
        { id: 100, name: '100条/页' },
        { id: 1000000000000, name: '全部' }
      ]
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
