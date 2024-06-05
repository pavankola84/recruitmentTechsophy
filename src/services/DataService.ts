import { GET_CLIENTS, GET_DEPARTMENTS, GET_SKILLS } from "../constants/endpoints";
import { request } from "./Request";

export const getAllClients = async (): Promise<{ success: boolean; data?: any; message?: string }> => {
    const r: any = await request.get(
        `${process.env.REACT_APP_API_GATEWAY_URL}${GET_CLIENTS}`
      );
  
    if (r.status) {
      const form = r.data;
      console.log(form);
      return { success: r.status, data: form, message: r.message };
    }
  
    return { success: false };
};

export const getAllDepartments = async (): Promise<{ success: boolean; data?: any; message?: string }> => {
    const r: any = await request.get(
        `${process.env.REACT_APP_API_GATEWAY_URL}${GET_DEPARTMENTS}`
      );
  
    if (r.status) {
      const form = r.data;
      console.log(form);
      return { success: r.status, data: form, message: r.message };
    }
  
    return { success: false };
};

export const getAllSkills = async (): Promise<{ success: boolean; data?: any; message?: string }> => {
    const r: any = await request.get(
        `${process.env.REACT_APP_API_GATEWAY_URL}${GET_SKILLS}`
      );
  
    if (r.status) {
      const form = r.data;
      console.log(form);
      return { success: r.status, data: form, message: r.message };
    }
  
    return { success: false };
};