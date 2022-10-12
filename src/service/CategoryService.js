import Api from "../utils/Api";

export class CategoryService {

  // GET ALL CATEGORIES
  async getCategories() {
    let response  = {}
    try {
      const categories = await Api.get('category/getAll')
      response.data = categories.data
      return response
    } catch (error) {
      console.log("error : ",error)
      response.error = error
      return response
    }
  }

  // UPDATE CATEGORY
  async updateCategory (_id,data) {
    let response = {}
    try {
      const updatedCategory = await Api.put(`category/update/${_id}`,data)
      response.data = updatedCategory.data
      return response
    } catch (error) {
      console.log("error : ",error.message)
      response.error = error
      return response
    }
  }

  // DELETE CATEGORY
  async deleteCategory (_id){
    let response = {}
    try {
      const deleteCategory = await Api.delete(`category/delete/${_id}`)
      response.data = deleteCategory.data.message
      return response
    } catch (error) {
      response.error = error
      return response
    }
  }

  // CREATE CATEGORY
  async createCategory (data){
    let response = {}
    try {
      const createdCategory = await Api.post(`category/create`,data)
      response.data = createdCategory.data
      return response
    } catch (error) {
      response.error = error
      return response
    }
  }


}