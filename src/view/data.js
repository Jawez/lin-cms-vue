import AdminModel from '@/lin/model/admin'
import GenericModel from '@/model/generic-model'
const dynamicModel = new GenericModel('v1')

export const useDataList = () => {
  /**
   * 获取用户列表数据
   */
  const getUsersAndStore = async () => {
    const pageCount = 10
    let usersCount = 0 // 当前页获取的用户数量
    let users = []
    try {
      let res = {}
      res = await AdminModel.getAdminUsers({
        count: pageCount,
        page: 0,
      })
      console.log(res)

      const totalNum = res.total // 分组内的用户总数
      usersCount += res.items.length
      users = users.concat(res.items)
      console.log(res.items)

      for (let currentPage = 2; usersCount < totalNum; currentPage++) {
        res = await AdminModel.getAdminUsers({
          count: pageCount,
          page: currentPage - 1,
        })
        console.log(res.items)

        if (res.items.length === 0) {
          break;
        }
        usersCount += res.items.length
        users = users.concat(res.items)
      }
    } catch (e) {
      console.error(e)
    }

    console.log(usersCount)
    console.log(users)
    sessionStorage.setItem('users', JSON.stringify(users))
    return users
  }

  // MTODO: timeout
  const getUsersFromStore = () => {
    const users = JSON.parse(sessionStorage.getItem('users'))
    return users
  }

  const getModelsAndStore = async (name) => {
    try {
      dynamicModel.setRoute('v1/' + name)
      const modelList = await dynamicModel.getModels()
      sessionStorage.setItem(name, JSON.stringify(modelList))
      // console.log(modelList)
      return modelList
    } catch (error) {
      if (error.code === 10020) {
      }
    }
    return []
  }

  // MTODO: timeout
  const getDataFromStore = (name) => {
    const users = JSON.parse(sessionStorage.getItem(name))
    return users
  }

  return {
    getUsersAndStore,
    getUsersFromStore,
    getModelsAndStore,
    getDataFromStore,
  }
}
