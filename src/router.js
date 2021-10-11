import { createWebHistory, createRouter } from "vue-router";

const routes =  [
  {
    path: "/",
    alias: "/accounts",
    name: "accounts",
    component: () => import("./components/BankAccountList")
  },
  {
    path: "/accounts/:id",
    name: "account-details",
    component: () => import("./components/BankAccount")
  },
  {
    path: "/accounts/:id/statement",
    name: "account-statement",
    component: () => import("./components/Statement")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;