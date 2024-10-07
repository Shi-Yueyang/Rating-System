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
async function fetchData<T>(endPoint:string,headers:Record<string, string>):Promise<T[]>{
    const response = await axios.get(endPoint,{headers});
    return response.data;
}

async function fetchSingleData<T>(endPoint:string,headers:Record<string, string>):Promise<T>{
  const response = await axios.get(endPoint,{headers});
  return response.data;
}


async function mutateData<T>(endPoint:string, data:T,config:AxiosRequestConfig):Promise<T>{
    const response = await axios.post(endPoint,data,config);
    return response.data;
}

interface Props{
    endPoint:string;
    accessToken?:string|null;
    queryKey:string[]
}

export function UseApiResources<T>({endPoint,accessToken,queryKey}:Props){
    const headers: Record<string, string> = {
        // 'Content-Type': 'multipart/form-data',
        'Content-Type': 'application/json',
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

      const useFetchResources = () =>{
        return useQuery<T[],Error>({
            queryKey,
            queryFn: ()=>fetchData<T>(endPoint,headers),
            staleTime: 5*60*1000
        })
      }

      const useMutateResources = (method:'POST'|'PATCH'|'PUT') =>{
        return useMutation({
            mutationFn:(data:T)=>mutateData<T>(endPoint,data,{method,headers}),
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