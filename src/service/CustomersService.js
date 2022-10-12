import Api from '../utils/Api'

export class CustomersService {

    async createCustomer(data){
        let response = {}
        try {
            const createdCustomer = await Api.post(`customer/signup`,data)
            response.data = createdCustomer.data
            return response
        } catch (error) {
            response.error = error.response.data.message
            return response
        }

    }

    async updateCustomer (_id,data){
        let response = {}
        try {
            const updatedCustomer = await Api.put(`customer/update/${_id}`,data)
            response.data = updatedCustomer.data
            return response
        } catch (error) {
            response.error = error.response.data.message
            return response
        }

    }

    async getCustomers (lazyParams, totalRecords){
        const {first, rows, page, filters : {customerType, active, city} } = lazyParams
        let parameters = `totalSkip=${first}&currentPage=${page}&totalDocuments=${totalRecords}`
        if(customerType != null) parameters += `&customerType=${customerType}`
        if(active != null) parameters += `&active=${active}`
        if(city != null) parameters += `&city=${city}`

        let response = {}
        try {
            const costumers = await Api.get(`customer?${parameters}`)
            response.data = costumers.data
            return response
        } catch (error) {
            response.error = error
            return response
        }
    }

    async deleteCustomer (_id){
        let response = {}
        try {
            const deletedCustomer = await Api.delete(`customer/remove/${_id}`)
            response.data = deletedCustomer.data
            return response
        } catch (error) {
            response.error = error
            return response
        }
    }

    async updatePassword(_id, newPassword) {
        let response = {}
        try {
            const customers = await Api.put(`customer/update/password/withoutcheck/${_id}`,{ newpassword: newPassword })
            response.data = customers.data
            return response
        } catch (error) {
            response.error = error
            return response
        }
    }

}