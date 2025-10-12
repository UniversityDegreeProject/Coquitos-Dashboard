import { createBrowserRouter, Navigate } from "react-router";

// components Layouts
import { CoquitoLayout } from "@/coquitos/dashboard/layouts/CoquitoLayout";
import { AuthLayout } from "@/auth/layout/AuthLayout";

// components Route Guards
import { PrivateRoute, PublicRoute, RootRedirect } from "./components";

// components Pages
import { DashboardPage } from "@/coquitos/dashboard/pages/DashboardPage";
import { OrdersPage } from "@/coquitos/orders/pages/OrdersPage";
import { ProductPage } from "@/coquitos/products/pages/ProductPage";
import { CategoriesPage } from "@/coquitos/categories/pages/CategoriesPage";
import { ClientsPage } from "@/coquitos/clients/pages/ClientsPage";
import { UsersPage } from "@/coquitos/users/pages/UsersPage";
import { ReportPage } from "@/coquitos/reports/pages/ReportPage";
import { CashClosePage } from "@/coquitos/cash-closing/pages/CashClosePage";
import { SettingPage } from "@/coquitos/settings/pages/SettingPage";
import LoginPage from "@/auth/pages/LoginPage";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "/auth",
    element: <PublicRoute />,
    children: [
      {
        path: "",
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/dashboard",
    element: <PrivateRoute />,
    children: [
      {
        path: "",
        element: <CoquitoLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard/home" replace />,
          },
          {
            path: "home",
            element: <DashboardPage />,
          },
          {
            path: "orders",
            element: <OrdersPage />,
          },
          {
            path: "products",
            element: <ProductPage />,
          },
          {
            path: "categories",
            element: <CategoriesPage />,
          },
          {
            path: "clients",
            element: <ClientsPage />,
          },
          {
            path: "users",
            element: <UsersPage />,
          },
          {
            path: "reports",
            element: <ReportPage />,
          },
          {
            path: "cash-closing",
            element: <CashClosePage />,
          },
          {
            path: "settings",
            element: <SettingPage />,
          },
        ],
      },
    ],
  },
])