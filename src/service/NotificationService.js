import axios from "axios";

export class NotificationService {

    async pushNotification(order){
        const key = "AAAASwMnxhQ:APA91bHN7p7FUJQJMXI_dawKbQWzrlfbzAs8uJjYS8_U6QLc0Q3LWJ7QRWySLZt1L8dT7snT6JDf_tWEloeLp4IxE9lOhhEQ_KuHPTkEcIKHd_0Xhdzr1wopPDD4lNulnm5yab8GkLo4"
        const { customer:{ firebaseToken }, numOrder, status} = order
        const data = {
                to: firebaseToken,
                priority: "high",
                notification: {
                    title: `Status commande`,
                    body: `votre commande numéro ${numOrder} est ${status}`,
                    android_channel_id: "order_status",
                    sound: "default"
                }
        }
        await axios.post("https://fcm.googleapis.com/fcm/send",data,{
            headers: {
              "Content-Type" : "application/json",
              Authorization : `key=${key}`
            }
          })
    }
}