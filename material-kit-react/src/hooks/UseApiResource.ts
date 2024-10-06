import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";



async function fetchData<T>(endPoint:string):Promise<T[]>{
    const response = await axios.get(endPoint);
    return response.data;
}

async function mutateData<T>(endPoint:string, data:T|T[],config:AxiosRequestConfig):Promise<T>{
    const response = await axios.post(endPoint,data,config);
    return response.data;
}

interface Props<T>{
    endPoint:string;
    accessToken?:string|null;
    queryKey:string[]
}

export function UseApiResources<T>({endPoint,accessToken,queryKey}:Props<T>){
    const headers: Record<string, string> = {
        'Content-Type': 'multipart/form-data',
      };
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const useFetchResources = () =>{
        return useQuery<T[],Error>({
            queryKey,
            queryFn: ()=>fetchData<T>(endPoint),
            staleTime: 5*60*1000
        })
      }

      const useMutateResources = (method:'POST'|'PATCH'|'PUT') =>{
        return useMutation({
            mutationFn:(data:T|T[])=>mutateData<T>(endPoint,data,{method,headers}),
            onError:(error:AxiosError)=>{
                console.error("[useApiResource onError]:", error.response?.data);
                throw error;
            }
        })
      }

      return{
        useFetchResources,
        useMutateResources
      }
}