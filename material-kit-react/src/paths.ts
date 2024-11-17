export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    activity: '/dashboard/assignment', 
    rating: '/dashboard/rating',
  },
  createEvent:'/dashboard/assignment/create',
  eventDetails:'/dashboard/assignment/details/',
  ratingTasks:'/dashboard/rating/tasks/',
  ratingDetails:'/dashboard/rating/details/',
  errors: { notFound: '/errors/not-found' },
} as const;
