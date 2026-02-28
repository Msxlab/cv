import { createBrowserRouter } from "react-router";
import { CVBuilder } from "./pages/cv-builder";
import { Dashboard } from "./pages/dashboard";
import { NotFound } from "./pages/not-found";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Dashboard,
  },
  {
    path: "/builder",
    Component: CVBuilder,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
