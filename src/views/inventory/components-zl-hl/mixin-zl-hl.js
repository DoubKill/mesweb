export default {
  data() {
    return {
      dialogVisibleView: false,
      tableDataView: [],
      totalView: 0,
      searchView: {},
      loadingView: false
    }
  },
  methods: {
    async getListView() {
      try {
        this.loadingView = true
        // const data = await putPlanManagement('get', null, { params: this.search })
        // this.totalView = data.count
        // this.tableDataView = data.results
        this.loadingView = false
      } catch (error) {
        this.loadingView = false
      }
    },
    viewPlan(index, row) {
      this.dialogVisibleView = true
    },
    forcedEndPlan(index, row) {
      this.$confirm(
        '确定强制关闭?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async() => {
        // const obj = {
        //   status: 5,
        //   order_no: 'order_no',
        //   warehouse_info: this.warehouseInfo
        // }
        // this.loading = true
        // await putPlanManagement('put', row.id, { data: obj })
        // this.$message.success('操作成功')
        // this.getList()
      }).catch(() => {
        this.loading = false
      })
    },
    handleCloseView(done) {
      this.dialogVisibleView = false
      this.searchView.page = 1
      if (done) {
        done()
      }
    },
    currentChangeView(page, page_size) {
      this.searchView.page = page
      this.searchView.page_size = page_size
      this.getListView()
    }
  }
}
