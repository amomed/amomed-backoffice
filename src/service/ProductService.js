import Api from '../utils/Api'

export class ProductService {

    async getProducts(lazyParams,totalRecords) {

        const {first, rows, page, filters : {active, selectedCategory, reference, nameProduct}, sortfield, sortorder } = lazyParams
        let response = {}
        const _sortfield = sortfield == null ? '_id' : sortfield
        let parameters = `totalSkip=${first}&currentPage=${page}&totalDocuments=${totalRecords}&sortfield=${_sortfield}&sortorder=${sortorder}`
        if(active != null) parameters += `&active=${active}`
        if(selectedCategory != null) parameters += `&category=${selectedCategory}`
        if(reference != null) parameters += `&reference=${reference}`
        if(nameProduct != null) parameters += `&nameProduct=${nameProduct}`

        try {
            const products = await Api.get(`product/backoffice?${parameters}`)
            response.data = products.data
            return response
        } catch (error) {
            response.error =  error
            return response
        }
    }

    async addProduct (data) {
        let reponse = {}
        try {
            const createdProduct = await Api.post(`product/create`,data)
            reponse.data = createdProduct.data
            return reponse
        } catch (error) {
            reponse.error = error.response.data.message
            return reponse
        }
    }

    async updatedProduct (productId,data) {
        let response = {}
        try {
            const updatedProduct = await Api.put(`product/update/${productId}`,data)
            response.data = updatedProduct.data
            return response
        } catch (error) {
            response.error = error.response.data.message
            return response
        }
    }

    async removeProduct (productId) {
        let response = {}
        try {
            const deletedProduct = await Api.delete(`product/delete/${productId}`)
            response.data = deletedProduct.data
            return response
        } catch (error) {
            response.error = error
            return response
        }
    }



}