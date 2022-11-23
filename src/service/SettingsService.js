import Api from '../utils/Api'

export class SettingsService {
    
    async getAmomedInfo (){
        let response  = {}
        try {
            const amomedInfo = await Api.get(`amomedinfo`)
            response.data = amomedInfo.data
            return response
        } catch (error) {
            response.error = error
            return response
        }
    }

    async addAmomedInfo (amomedInfo){
        let response = {}
        try {
            const _amomedInfo = await Api.post(`amomedinfo/create`,amomedInfo)
            response.data = _amomedInfo.data
            return response
        } catch (error) {
            response.error = error
            return response
        }
    }

    async deleteAmomedInfo(amomedInfo){
        let response = {}
        try {
            console.log(amomedInfo)
            const updatedAmomedInfo = await Api.delete('amomedinfo/delete', {data: amomedInfo})
            response.data = updatedAmomedInfo.data
            return response
        } catch (error) {
            response.error = error
            return response
        }
    }
}