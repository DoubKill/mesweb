
// import { putPlanManagement, finalPlanManagement } from '@/api/base_w'
import { outboundDeliveryOrderDetails } from '@/api/base_w'
// import { debounce } from '@/utils/index'

export default {
  data() {
    return {
      dialogVisibleView: false,
      tableDataView: [],
      totalView: 0,
      searchView: {},
      loadingView: false,
      outbound_order: '',
      rowObj: {}
    }
  },
  watch: {
  },
  methods: {
    async getListView() {
      try {
        this.loadingView = true
        const _api = outboundDeliveryOrderDetails
        this.searchView.outbound_delivery_order_id = this.outbound_order
        const data = await _api('get', null, { params: this.searchView })
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
      this.rowObj = JSON.parse(JSON.stringify(row))
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
