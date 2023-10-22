import GenericModel from '@/model/generic-model'
const dynamicModel = new GenericModel('v1/analyzer')

export const useDeviceList = () => {
  const getModels = async (name) => {
    let deviceList = []
    try {
      dynamicModel.setRoute('v1/' + name)
      const modelList = await dynamicModel.getModels()
      deviceList = modelList
      sessionStorage.setItem(name, JSON.stringify(deviceList))
    } catch (error) {
      if (error.code === 10020) {
      }
    }
    // console.log(deviceList)
    return deviceList
  }

  return {
    getModels,
  }
}
