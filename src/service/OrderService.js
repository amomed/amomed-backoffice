import Api from "../utils/Api";
import { NotificationService } from "./NotificationService";

export class OrderService {

  async getAllOrders(lazyParams, totalRecords){
    const {first, rows, page, filters : {date, status, customer,numOrder}, sortfield, sortorder } = lazyParams
    let response = {}
    const _sortfield = sortfield == null ? '_id' : sortfield
    let parameters = `totalSkip=${first}&currentPage=${page}&totalDocuments=${totalRecords}&sortfield=${_sortfield}&sortorder=${sortorder}`
    if(date != null) parameters += `&date=${date.toString()}`
    if(status != null) parameters += `&status=${status}`
    if(customer != null) parameters += `&status=${customer}`
    if(numOrder != null) parameters += `&numOrder=${numOrder}`
    try {
      const orders = await Api.get(`order/backoffice?${parameters}`)
      response.data = orders.data
      return response
    } catch (error) {
      console.log("error : ",error)
      response.error = error
      return response
    }
  }

  async updateOrderStatus (order){

    let response = {}
    try {
      const notificationService = new NotificationService()
      const updatedOrder = await Api.put(`order/update/${order._id}`,order)
      await notificationService.pushNotification(order)
      response.data = updatedOrder.data
      return response
    } catch (error) {
      response.error = error
      return response
    }
  }

}