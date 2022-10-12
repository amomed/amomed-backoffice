import Api from "../utils/Api";


export class BrandsService {

  // GET ALL SUB CATEGORIES
  async getSubCategories() {
    let response  = {}
    try {
      const subCategory = await Api.get('underCategory/all')
      response.data = subCategory.data
      return response
    } catch (error) {
      console.log("error : ",error)
      response.error = error
      return response
    }
  }


  // UPDATE SUB CATEGORY
  async updateSubCategory (_id,data) {
    let response = {}
    try {
      const updatedSubCategory = await Api.put(`underCategory/update/${_id}`,data)
      response.data = updatedSubCategory.data
      return response
    } catch (error) {
      console.log("error : ",error.message)
      response.error = error
      return response
    }
  }

  // ADD SUB CATEGORY
  async createSubCategory (data){
    let response = {}
    try {
      const createSubCate = await Api.post(`underCategory/create`,data)
      response.data = createSubCate.data
      return response
    } catch (error) {
      response.error = error
      return response
    }
  }

  async getBrandsByCategory(categoryId){
    let response = {}
    try {
      const brands = await Api.get(`underCategory?category=${categoryId}`)
      response.data = brands.data
      return response
    } catch (error) {
      console.log(error)
      response.error = error
      return response
    }
  }

}