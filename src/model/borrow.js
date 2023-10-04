/* eslint-disable class-methods-use-this */
import _axios, { get, post, put, _delete } from '@/lin/plugin/axios'

class Borrow {
  async getRecords() {
    const res = await get(`v1/borrow/all`)
    return res
  }

  async getUserRecords() {
    const res = await get(`v1/borrow/`)
    return res
  }
}

export default Borrow
