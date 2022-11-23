import Api from "../utils/Api";

export class ProposalsService {

    async getPropsals(lazyParams, totalRecords){
        const {first, rows, page} = lazyParams
        let response = {}
        let parameters = `totalSkip=${first}&currentPage=${page}&totalDocuments=${totalRecords}`
        try {
            const proposals = await Api.get(`suggestion?${parameters}`)
            response.data = proposals.data
            return response
        } catch (error) {
            response.error = error
            return response
        }
    }
}
