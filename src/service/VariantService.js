import Api from "../utils/Api";

export class VariantService {

    async addVariant(variant){
        let response = {}
        try {
            const createdVariant = await Api.post(`variant/create`,variant)
            response.data  = createdVariant.data
            return response
        } catch (error) {
            response.error = error
            return response
        }
    }

    async getVariantsByProduct(productId){
        let response = {}
        try {
            const variants = await Api.get(`variant/product/${productId}`)
            response.data = variants.data
            return response
        } catch (error) {
            console.log(error)
            response.error = error
            return response
        }
    }

    async editVariant(variantId, data){
        let response = {}
        try {
            const updatedVariant = await Api.put(`variant/update/${variantId}`,data)
            response.data = updatedVariant.data
            return response
        } catch (error) {
            response.error = error
            return response
        }
        
    }

    async deleteVariant(variantId){
        let response = {}
        try {
            await Api.delete(`variant/delete/${variantId}`)
        } catch (error) {
            response.error = error
            return response
        }
        
    }}