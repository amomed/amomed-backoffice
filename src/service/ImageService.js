import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../utils/firebase";
import { CategoryService } from "./CategoryService";

export class ImageService {

    // UPLOAD IMAGE TO FIREBASE
    async uploadImage (image,path) {
        let response = {}
        try {
            const imageRef = ref(storage, path);
            await uploadBytes(imageRef, image)
            const url = await getDownloadURL(imageRef)
            response.data = url
            return response
        } catch (error) {
            response.error = error
            return response
        }
    }

    // DELETE IMAGE FROM FIREBASE
    async deletImage(url){
        const imageRef = ref(storage, url);
        let res= {}
        try {
            await deleteObject(imageRef)
            res.data = "success"
            return res
        } catch (error) {
            res.error = error
            return res
        }

    }
}