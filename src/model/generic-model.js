/* eslint-disable class-methods-use-this */
import _axios, { get, post, put, _delete } from '@/lin/plugin/axios'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class GenericModel {
  constructor(route) {
    this.route = route
  }

  setRoute(route) {
    this.route = route
  }

  // 类中的方法可以代表一个用户行为
  async createModel(data) {
    return _axios({
      method: 'post',
      url: this.route,
      data,
    })
  }

  // 在这里通过 async await 语法糖让代码同步执行
  // 1. await 一定要搭配 async 来使用
  // 2. await 后面跟的是一个 Promise 对象
  async getModel(id) {
    const res = await get(`${this.route}/${id}`)
    return res
  }

  async editModel(id, info) {
    const res = await put(`${this.route}/${id}`, info)
    return res
  }

  async borrowModel(id, info) {
    const res = await post(`${this.route}/${id}/borrow`, info)
    return res
  }

  async returnModel(id, info) {
    const res = await post(`${this.route}/${id}/return`, info)
    return res
  }

  async deleteModel(id) {
    const res = await _delete(`${this.route}/${id}`)
    return res
  }

  async getModels() {
    return _axios({
      method: 'get',
      url: this.route,
      handleError: true,
    })
  }
}

export default GenericModel
