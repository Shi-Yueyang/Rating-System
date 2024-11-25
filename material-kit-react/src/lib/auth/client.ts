'use client';

import { baseURL } from '@/config';
import type { User } from '@/types/user';
import axios from 'axios';



export interface SignUpParams {
  username: string;
  email: string;
  password: string;
  avatar: File | null;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  emailOrUsername: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

interface SignUpFieldErrors {
  username?: string;
  email?: string;
  password?: string;
  avatar?: string;
  [key: string]: string | undefined; // Allow additional error fields
}

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ error?: string,fieldErrors?: SignUpFieldErrors }> {
    // Make API request
    console.log('SignUpParams ',params);
    try{
      const formData = new FormData();
      formData.append('username', params.username);
      formData.append('email', params.email);
      formData.append('password', params.password);
      if(params.avatar){
        console.log("[AuthClient:SignUp] has avatar")
        formData.append('avatar', params.avatar);
      }

      const response = await axios.post(`${baseURL}/rate/users/`,formData,{
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });

      return {}
    }catch (error:any){
      if (error.response && error.response.data) {
        const fieldErrors: SignUpFieldErrors = {};
        const { data } = error.response;
        if (data.username) {
          fieldErrors.username = data.username; // Set username error if it exists
        }
        if (data.email) {
          fieldErrors.email = data.email; // Set email error if it exists
        }
        if (data.password) {
          fieldErrors.password = data.password; // Set password error if it exists
        }
        if (data.avatar) {
          fieldErrors.avatar = data.avatar; // Set avatar error if it exists
        }
  
        // Handle additional error fields dynamically (if any exist in the backend response)
        Object.keys(data).forEach((key) => {
          if (!(key in fieldErrors)) {
            fieldErrors[key] = data[key];
          }
        });
  
        return {
          error: 'Sign-up failed', // General error message
          fieldErrors, // Return the structured field errors
        };
      }

      return { error: 'An unexpected error occurred' }; // Generic fallback
    }
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { emailOrUsername, password } = params;

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username:emailOrUsername,
        password: password
      })
  
      const token = response.data.access;
      localStorage.setItem('custom-auth-token',token);
      console.log('[signInWithPassword] token: '+token);
      return {};
    } catch (error){
      return {error:'invalid credentials'}
    }
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const token = localStorage.getItem('custom-auth-token');
    console.log("[getUser] token:"+token)
    
    if (!token) {
      return {}
    }

    console.log("[getUser] found token")

    return axios
      .get(`${baseURL}/rate/users/me/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log('[getUser] me endpoint response: ', JSON.stringify(response.data, null, 2));
        const user = response.data as User;
        console.log('[getUser] returned User object:', user);
        return { data: user, error: undefined };
      })
      .catch((error) => {
        // Handle the error and return an appropriate message
        return { data: null, error: error.response?.data?.message || 'An error occurred' };
      });
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');

    return {};
  }
}

export const authClient = new AuthClient();
