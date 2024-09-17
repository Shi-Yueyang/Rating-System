'use client';

import type { User } from '@/types/user';
import axios from 'axios';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'Sofia',
  lastName: 'Rivers',
  email: 'sofia@devias.io',
} satisfies User;

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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

class AuthClient {
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    // Make API request

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);
    return {};
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
    .get('http://127.0.0.1:8000/rate/users/me', {
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
