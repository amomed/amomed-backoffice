import Api from "../utils/Api";

export class DashboardService {

    async getTotalProducts(){
        let response = {}
        try {
            const totalProducts = await Api.get(`statistics/product/total`)
            response.data = totalProducts.data
            return response
        } catch (error) {
            response.error = error
            return response
        }
    }

    async getTotalCustomers(){
        let response = {}
        try {
            const totalCustomers = await Api.get(`statistics/customer/total`)
            response.data = totalCustomers.data
            return response
        } catch (error) {
            response.error = error
            return response
        }
    }

    async getStatistics(){
        let response = {}
        try {
            const statistics = await Api.get(`statistics`)
            response.data = statistics.data
            return response
        } catch (error) {
            response.error = error
            return response
        }
    }

    async getBestSellingProducts (lazyParams, totalRecords){
        const {first,  page} = lazyParams
        let response = {}
        let parameters = `totalSkip=${first}&currentPage=${page}&totalDocuments=${totalRecords}`
        try {
            const products = await Api.get(`statistics/product/bestselling?${parameters}`)
            response.data = products.data
            return response
        } catch (error) {
            response.error =  error
            return response
        }        
    }
}