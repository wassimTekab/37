import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/useAuth";
const dynamicRoutes = [
  {
    path: "/appconfigs",
    meta: {
      requiresAuth: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
      ),
    children: [
      {
        path: "",
        name: "list-appconfig",
        component: () =>
          import(
            /* webpackChunkName: "list-appConfig" */ "@/views/main/appConfig/AppConfigList.vue"
          ),
      },
      {
        path: "create",
        name: "create-appconfig",
        component: () =>
          import(
            /* webpackChunkName: "create-appConfig" */ "@/views/main/appConfig/AppConfigCreate.vue"
          ),
      },
      {
        path: "edit/:id",
        name: "edit-appconfig",
        component: () =>
          import(
            /* webpackChunkName: "edit-appConfig" */ "@/views/main/appConfig/AppConfigEdit.vue"
          ),
      },
      {
        path: ":id",
        name: "detail-appconfig",
        component: () =>
          import(
            /* webpackChunkName: "detail-appConfig" */ "@/views/main/appConfig/AppConfigDetail.vue"
          ),
      },
    ],
  },
  {
    path: "/books",
    meta: {
      requiresAuth: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
      ),
    children: [
      {
        path: "",
        name: "list-book",
        component: () =>
          import(
            /* webpackChunkName: "list-book" */ "@/views/main/book/BookList.vue"
          ),
      },
      {
        path: "create",
        name: "create-book",
        component: () =>
          import(
            /* webpackChunkName: "create-book" */ "@/views/main/book/BookCreate.vue"
          ),
      },
      {
        path: "edit/:id",
        name: "edit-book",
        component: () =>
          import(
            /* webpackChunkName: "edit-book" */ "@/views/main/book/BookEdit.vue"
          ),
      },
      {
        path: ":id",
        name: "detail-book",
        component: () =>
          import(
            /* webpackChunkName: "detail-book" */ "@/views/main/book/BookDetail.vue"
          ),
      },
    ],
  },
];

const staticRoutes = [
  {
    path: "/auth",
    redirect: "/",
    component: () =>
      import(
        /* webpackChunkName: "auth_layout" */ "@/components/layouts/Auth.vue"
      ),
    children: [
      {
        path: "sign-in",
        name: "sign-in",
        meta: {
          auth: true,
        },
        component: () =>
          import(/* webpackChunkName: "sign_in" */ "@/views/auth/SignIn.vue"),
      },
      {
        path: "sign-up",
        name: "sign-up",
        meta: {
          auth: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "sign_up" */
            "@/views/auth/SignUp.vue"
          ),
      },
      {
        path: "password-reset",
        name: "password-reset",
        meta: {
          auth: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "password_reset" */ "@/views/auth/ResetPassword.vue"
          ),
      },
      {
        path: "email-reset-password",
        name: "email-reset-password",
        meta: {
          auth: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "password_reset" */ "@/views/auth/EmailResetPassword.vue"
          ),
      },
      {
        path: "msg-reset-password",
        name: "msg-reset-password",
        meta: {
          auth: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "password_reset" */ "@/views/auth/MsgResetPassword.vue"
          ),
      },
    ],
  },
  {
    path: "",
    meta: {
      requiresAuth: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
      ),
    children: [
      {
        name: "home",
        path: "/",
        meta: {
          requiresAuth: true,
        },
        component: () =>
          import(/* webpackChunkName: "HomePage" */ "@/views/Home.vue"),
      },
    ],
  },
  {
    // the 404 route, when none of the above matches
    path: "/404",
    name: "404",
    component: () =>
      import(/* webpackChunkName: "error_404" */ "@/views/errors/Error404.vue"),
  },
  {
    path: "/doc",
    name: "doc",
    component: () =>
      import(/* webpackChunkName: "doc" */ "@/views/doc/doc.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
  {
    path: "/callback",
    name: "callback",
    meta: {
      auth: false,
    },
    component: () =>
      import(/* webpackChunkName: "callback" */ "@/components/Callback.vue"),
  },
];

const routes: Array<RouteRecordRaw> = [...staticRoutes, ...dynamicRoutes];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const authRoute = to.matched.some((record) => record.meta.auth);
  const store = useAuthStore();

  const { currentUser, isLoggedIn } = storeToRefs(useAuthStore());
  currentUser.value ? undefined : await store.getCurrent();

  if (isLoggedIn.value && authRoute && !to.fullPath.includes("type=recovery")) {
    next({ name: "home" });
    return;
  }

  if (requiresAuth && !isLoggedIn.value) {
    next({ name: "sign-in" });
    return;
  }
  next();
  return;
});

export default router;
