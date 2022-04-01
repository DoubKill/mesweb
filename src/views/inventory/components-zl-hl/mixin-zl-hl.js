import { outboundDeliveryOrderDetails } from '@/api/base_w'
import { outbound } from '@/api/jqy'
import { debounce } from '@/utils/index'
export default {
  data() {
    return {
      dialogVisibleView: false,
      tableDataView: [],
      totalView: 0,
      searchView: { status: [1, 2, 5], sub_no: '', pallet_no: '', lot_no: '' },
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
        const obj = JSON.parse(JSON.stringify(this.searchView))
        obj.status = obj.status.join(',')
        const data = await _api('get', null, { params: obj })
        this.totalView = data.count
        this.tableDataView = data.results
        this.loadingView = false
      } catch (error) {
        this.loadingView = false
      }
    },
    getDebounceView() {
      this.searchView.page = 1
      debounce(this, 'getListView')
    },
    searchStatus() {
      this.searchView.page = 1
      this.getListView()
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
      this.searchView.sub_no = ''
      this.searchView.pallet_no = ''
      this.searchView.lot_no = ''
      if (done) {
        done()
      }
    },
    async closeOrderNo(row) {
      try {
        await outbound('patch', row.id, { data: { status: '4' }})
        this.$message.success('关闭成功')
        this.getListView()
      } catch (e) { this.$message.info('关闭失败') }
    },
    currentChangeView(page, page_size) {
      this.searchView.page = page
      this.searchView.page_size = page_size
      this.getListView()
    }
  }
}
