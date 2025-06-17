import axios, { AxiosResponse } from "axios";
import { ParamsApiCallInteface } from "../interfaces/params-api-call.interface";

export class CallApiService {
  constructor() {}
  async callApiWithGetAndParams(url: string, params: ParamsApiCallInteface): Promise<AxiosResponse<any, any>> {
    try {
      return await axios.get(url, { params });
    } catch (error: any) {
      throw Error(error?.message);
    }
  }
}
