/* eslint-disable class-methods-use-this */
import { post, get, put, _delete } from '@/lin/plugin/axios'

export default class Manager {
  static async getManagers(name) {
    const res = await get('cms/manager', {
      name,
    })
    return res
  }
}
