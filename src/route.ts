// src/route.ts

const route = {
  dashboard: "/dashboard",
  login: "/auth/login",
  signup: "/auth/signup",

  projects: "/projects",
  projectsNew: "/projects/new",

  technicalDebt: "/technical-debt",
  newTechnicalDebt: "/technical-debt/new",
  editTechnicalDebt: (id: string) => `/technical-debt/${id}/edit`,

  deprecations: "/deprecations",
  deprecationsNew: "/deprecations/new",
  deprecationsEdit: (id: string) => `/deprecations/${id}/edit`,


    sessions: "/sessions",
};

export default route;
