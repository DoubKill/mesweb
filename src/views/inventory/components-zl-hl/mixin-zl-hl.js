import { putPlanManagement, finalPlanManagement } from '@/api/base_w'
export default {
  data() {
    return {
      dialogVisibleView: false,
      tableDataView: [],
      totalView: 0,
      searchView: {},
      loadingView: false,
      outbound_order: ''
    }
  },
  watch: {
  },
  methods: {
    async getListView() {
      try {
        this.loadingView = true
        const _api = this.warehouseName === '混炼胶库' ? putPlanManagement : finalPlanManagement
        const data = await _api('get', null, { params: { outbound_order: this.outbound_order }})
        this.totalView = data.count
        this.tableDataView = data.results
        this.loadingView = false
      } catch (error) {
        this.loadingView = false
      }
    },
    showEditDialog(row) {
      // 查看
      this.outbound_order = row.id
      this.dialogVisibleView = true
      this.getListView()
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
