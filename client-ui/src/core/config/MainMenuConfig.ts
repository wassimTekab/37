const DocMenuConfig = [
  {
    pages: [
      {
        heading: "Home",
        route: "/",
        svgIcon: "svg/icons/art002.svg",
        fontIcon: "bi-app-indicator",
      },
    ],
  },
  {
    heading: "appconfigs",
    route: "/appconfigs",
    pages: [
      {
        heading: "All appconfigs",
        route: "/appconfigs",
        svgIcon: "svg/icons/gen014.svg",
        fontIcon: "bi-calendar3-event",
      },
      {
        heading: "create appconfigs",
        route: "/appconfigs/create",
        svgIcon: "svg/icons/gen014.svg",
        fontIcon: "bi-calendar3-event",
      },
    ],
  },
  {
    heading: "books",
    route: "/books",
    pages: [
      {
        heading: "All books",
        route: "/books",
        svgIcon: "svg/icons/gen014.svg",
        fontIcon: "bi-calendar3-event",
      },
      {
        heading: "create books",
        route: "/books/create",
        svgIcon: "svg/icons/gen014.svg",
        fontIcon: "bi-calendar3-event",
      },
    ],
  },

  {
    sectionTitle: "authentication",
    svgIcon: "svg/icons//teh004.svg",
    fontIcon: "bi-sticky",
    sub: [
      {
        sectionTitle: "basicFlow",
        sub: [
          {
            heading: "signIn",
            route: "/auth/sign-in",
          },
          {
            heading: "signUp",
            route: "/auth/sign-up",
          },
          {
            heading: "passwordReset",
            route: "/auth/password-reset",
          },
          {
            heading: "emailResetPassword",
            route: "/auth/email-reset-password",
          },
          {
            heading: "msgResetPassword",
            route: "/auth/msg-reset-password",
          },
        ],
      },
      {
        heading: "error404",
        route: "/404",
      },
    ],
  },
  {
    pages: [],
  },
];
export default DocMenuConfig;
