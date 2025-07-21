// src/route.ts

const route = {
  dashboard: "/dashboard",
  login: "/auth/login",
  signup: "/auth/signup",

  projects: "/projects",
  projectsNew: "/projects/new",

  technicalDebt: "/technical-debt",

  deprecations: "/deprecations",
  deprecationsNew: "/deprecations/new",
  deprecationsEdit: (id: string) => `/deprecations/${id}/edit`,
};

export default route;
