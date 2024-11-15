import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

export interface Activity {
    id?: number;
    name: string;
    dueDate: string;
  }
  
export interface Aspect{
    name:string;
    description:string;
    percentage:number;
}  

export interface ActivityWithAspect {
  name:string;
  dueDate:string;
  aspects:Aspect[];
}
async function fetchData<T>(endPoint:string, headers:Record<string, string>, params?: Record<string,any>):Promise<T[]>{
    const response = await axios.get(endPoint,{headers,params});
    return response.data;
}

async function fetchSingleData<T>(endPoint:string,headers:Record<string, string>):Promise<T>{
  const response = await axios.get(endPoint,{headers});
  return response.data;
}


async function mutateData<T>(endPoint:string, data:T|FormData,config:AxiosRequestConfig):Promise<T>{
  if (config.method === 'PUT') {
    const response = await axios.put(endPoint, data, config);
    return response.data;
  } else if (config.method === 'POST') {
    const response = await axios.post(endPoint, data, config);
    return response.data;
  } else if (config.method === 'PATCH') {
    const response = await axios.patch(endPoint, data, config);
    return response.data;
  } else {
    throw new Error('Invalid method');
  }
}

interface Props{
    endPoint:string;
    accessToken?:string|null;
    queryKey:string[];
    contentType?: 'application/json' | 'multipart/form-data';
}

export function UseApiResources<T>({endPoint,accessToken,queryKey,contentType='application/json'}:Props){
    const headers: Record<string, string> = {
        'Content-Type': contentType,
      };
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const useFetchSingleResource = () =>{
        return useQuery<T,Error>({
            queryKey,
            queryFn: ()=>fetchSingleData<T>(endPoint,headers),
            staleTime: 5*60*1000
        })
      }

      const useFetchResources = (params?: Record<string, any>) =>{
        return useQuery<T[],Error>({
            queryKey,
            queryFn: ()=>fetchData<T>(endPoint,headers,params),
            staleTime: 5*60*1000
        })
      }

      const useMutateResources = (method:'POST'|'PATCH'|'PUT') =>{
        return useMutation({
            mutationFn:(data:T|FormData)=>mutateData<T>(endPoint,data,{method,headers}),
            onError:(error:AxiosError)=>{
                console.error("[useApiResource onError]:", error.response?.data);
                throw error;
            }
        })
      }

      return{
        useFetchSingleResource,
        useFetchResources,
        useMutateResources
      }
}