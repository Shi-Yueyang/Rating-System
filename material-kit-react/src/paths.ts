export const paths = {
  home: '/',
  auth: {
    base: '/auth',
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    resetPassword: '/auth/reset-password',
  },
  dashboard: {
    base: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    assignment: {
      base: '/dashboard/assignment',
      create: '/dashboard/assignment/create',
      details: '/dashboard/assignment/details',
    },
    rating: {
      base: '/dashboard/rating',
      tasks: '/dashboard/rating/tasks',
      details: '/dashboard/rating/details',
    },
  },
  errors: {
    base: '/errors',
    notFound: '/errors/not-found',
  },
} as const;