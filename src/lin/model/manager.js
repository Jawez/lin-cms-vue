/* eslint-disable class-methods-use-this */
import { post, get, put, _delete } from '@/lin/plugin/axios'

export default class Manager {
  constructor(uPage = 0, uCount = 10, gPage = 0, gCount = 5) {
    this.uPage = uPage
    this.uCount = uCount
    this.lPage = gPage
    this.gCount = gCount
  }

  async increaseUPage() {
    this.uPage += 1
  }

  async increaseGPage() {
    this.lPage += 1
  }

  async decreaseUPage() {
    this.uPage -= 1
    if (this.uPage < 0) {
      this.uPage = 0
    }
  }

  async decreaseGPage() {
    this.lPage -= 1
    if (this.lPage < 0) {
      this.lPage = 0
    }
  }

  static getAllPermissions() {
    return get('cms/manager/permission')
  }

  static async getAdminUsers({ groupId, count = this.uCount, page = this.uPage }) {
    let res
    if (groupId) {
      res = await get('cms/manager/users', {
        count,
        page,
        group_id: groupId,
      })
    } else {
      res = await get('cms/manager/users', {
        count,
        page,
      })
    }
    return res
  }

  async nextUsersPage() {
    await this.increaseUPage()
    return this.getAdminUsers({})
  }

  async preUsersPage() {
    await this.decreaseUPage()
    return this.getAdminUsers({})
  }

  async getGroupsWithPermissions({ count = this.uCount, page = this.uPage }) {
    const res = await get('cms/manager/groups', {
      count,
      page,
    })
    return res
  }

  async nextGroupsPage() {
    await this.increaseGPage()
    return this.getGroupsWithPermissions({})
  }

  async preGroupsPage() {
    await this.decreaseGPage()
    return this.getGroupsWithPermissions({})
  }

  static async getAllGroups() {
    const groups = await get('cms/manager/group/all')
    return groups
  }

  static async getOneGroup(id) {
    const group = await get(`cms/manager/group/${id}`)
    return group
  }
}
