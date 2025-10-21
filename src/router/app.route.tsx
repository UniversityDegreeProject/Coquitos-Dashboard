import { createBrowserRouter, Navigate } from "react-router";

// components Layouts
import { CoquitoLayout } from "@/coquitos-features/dashboard/layouts/CoquitoLayout";
import { AuthLayout } from "@/auth/layout/AuthLayout";

// components Route Guards
import { PrivateRoute, PublicRoute, RootRedirect } from "./components";

// components Pages
import { DashboardPage } from "@/coquitos-features/dashboard/pages/DashboardPage";
import { OrdersPage } from "@/coquitos-features/orders/pages/OrdersPage";
import { ProductPage } from "@/coquitos-features/products/pages/ProductPage";
import { CategoriesPage } from "@/coquitos-features/categories/pages/CategoriesPage";
import { ClientsPage } from "@/coquitos-features/clients/pages/ClientsPage";
import { UsersPage } from "@/coquitos-features/users/pages/UsersPage";
import { UserDetailPage } from "@/coquitos-features/users/pages/UserDetailPage";
import { ReportPage } from "@/coquitos-features/reports/pages/ReportPage";
import { CashClosePage } from "@/coquitos-features/cash-closing/pages/CashClosePage";
import { SettingPage } from "@/coquitos-features/settings/pages/SettingPage";
import { StockMovementsPage } from "@/coquitos-features/stock-movements/pages/StockMovementsPage";
import LoginPage from "@/auth/pages/LoginPage";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "/login",
    element: <Navigate to="/auth/login" replace />,
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
            path: "users/:userId",
            element: <UserDetailPage />,
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
          {
            path: "stock-movements",
            element: <StockMovementsPage />,
          },
        ],
      },
    ],
  },
])