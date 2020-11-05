import { setDate } from '@/utils/index'
export default {
  created() {
    const a = setDate()
    const b = setDate(new Date(new Date() - 24 * 3600 * 1000 * 30))
    this.search.date = [b, a]
    const date = this.search.date
    this.search.st = date ? date[0] : ''
    this.search.et = date ? date[1] : ''
    // this.getList()
  }
}
