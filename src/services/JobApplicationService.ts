import { FILE_UPLOAD } from "../constants/endpoints";
import { request } from "./Request";
import axios from "axios";

export const uploadFile=async(file:any)=>{
    var formData = new FormData();
    formData.append("file", file);
    const r:any= await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}${FILE_UPLOAD}`, formData, {
        headers: {
        'Content-Type': 'multipart/form-data'
        }
    })
    return r;
}