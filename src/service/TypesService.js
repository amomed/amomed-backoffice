import Api from '../utils/Api'


export class TypesService {

  async getCustomersTypes (){
    let reponse = {}
    try {
      const types = await Api.get(`customertype`)
      reponse.data = types.data
      return reponse
    } catch (error) {
      reponse.error = error
      return reponse
    }
  }

  async updateType (_id,data){
    let reponse = {}
    try {
      const types = await Api.put(`customertype/update/${_id}`,data)
      reponse.data = types.data
      return reponse
    } catch (error) {
      reponse.error = error
      return reponse
    }
  }

  async createType (data){
    let response = {}
    try {
      const createdType = await Api.post(`customertype/create`,data)
      response.data = createdType.data
      return response
    } catch (error) {
      response.error = error
      return response
    }
  }

  async deleteType(_id){
    let response = {}
    try {
      const deletedType = await Api.delete(`customertype/remove/${_id}`)
      response.data = deletedType.data
      return response
    } catch (error) {
      response.error = error
      return response
    }
  }
}