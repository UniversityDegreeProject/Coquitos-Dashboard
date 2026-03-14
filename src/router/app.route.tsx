import { createBrowserRouter, Navigate } from "react-router";
import { lazy } from "react";

// components Layouts
import { CoquitoLayout } from "@/coquitos-features/dashboard/layouts/CoquitoLayout";

// components Route Guards & Wrapper
import {
  PrivateRoute,
  PublicRoute,
  RootRedirect,
  SuspenseWrapper,
} from "./components";

// Lazy-loaded Pages (code-splitting para mejor rendimiento en móvil)
const DashboardPage = lazy(() =>
  import("@/coquitos-features/dashboard/pages/DashboardPage").then((m) => ({
    default: m.DashboardPage,
  })),
);
const SalesPage = lazy(() =>
  import("@/coquitos-features/sales/pages/SalesPage").then((m) => ({
    default: m.SalesPage,
  })),
);
const SaleDetailPage = lazy(() =>
  import("@/coquitos-features/sales/pages/SaleDetailPage").then((m) => ({
    default: m.SaleDetailPage,
  })),
);
const ProductPage = lazy(() =>
  import("@/coquitos-features/products/pages/ProductPage").then((m) => ({
    default: m.ProductPage,
  })),
);
const CategoriesPage = lazy(() =>
  import("@/coquitos-features/categories/pages/CategoriesPage").then((m) => ({
    default: m.CategoriesPage,
  })),
);
const ClientsPage = lazy(() =>
  import("@/coquitos-features/clients/pages/ClientsPage").then((m) => ({
    default: m.ClientsPage,
  })),
);
const UsersPage = lazy(() =>
  import("@/coquitos-features/users/pages/UsersPage").then((m) => ({
    default: m.UsersPage,
  })),
);
const UserDetailPage = lazy(() =>
  import("@/coquitos-features/users/pages/UserDetailPage").then((m) => ({
    default: m.UserDetailPage,
  })),
);
const ReportPage = lazy(() =>
  import("@/coquitos-features/reports/pages/ReportPage").then((m) => ({
    default: m.ReportPage,
  })),
);
const CashClosePage = lazy(() =>
  import("@/coquitos-features/cash-closing/pages/CashClosePage").then((m) => ({
    default: m.CashClosePage,
  })),
);
const SettingPage = lazy(() =>
  import("@/coquitos-features/settings/pages/SettingPage").then((m) => ({
    default: m.SettingPage,
  })),
);
const StockMovementsPage = lazy(() =>
  import("@/coquitos-features/stock-movements/pages/StockMovementsPage").then(
    (m) => ({ default: m.StockMovementsPage }),
  ),
);
const ActivityLogPage = lazy(() =>
  import("@/coquitos-features/activity-log/pages/ActivityLogPage").then(
    (m) => ({ default: m.ActivityLogPage }),
  ),
);
const LoginPage = lazy(() =>
  import("@/auth/pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const NotFoundPage = lazy(() =>
  import("@/shared/pages").then((m) => ({ default: m.NotFoundPage })),
);

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
        path: "login",
        element: (
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        ),
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
            element: (
              <SuspenseWrapper>
                <DashboardPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "sales",
            element: (
              <SuspenseWrapper>
                <SalesPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "sales/:saleId",
            element: (
              <SuspenseWrapper>
                <SaleDetailPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "products",
            element: (
              <SuspenseWrapper>
                <ProductPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "categories",
            element: (
              <SuspenseWrapper>
                <CategoriesPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "clients",
            element: (
              <SuspenseWrapper>
                <ClientsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "users",
            element: (
              <SuspenseWrapper>
                <UsersPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "users/:userId",
            element: (
              <SuspenseWrapper>
                <UserDetailPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "reports",
            element: (
              <SuspenseWrapper>
                <ReportPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "cash-closing",
            element: (
              <SuspenseWrapper>
                <CashClosePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "settings",
            element: (
              <SuspenseWrapper>
                <SettingPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "stock-movements",
            element: (
              <SuspenseWrapper>
                <StockMovementsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "activity-log",
            element: (
              <SuspenseWrapper>
                <ActivityLogPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "404",
            element: (
              <SuspenseWrapper>
                <NotFoundPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "*",
            element: (
              <SuspenseWrapper>
                <NotFoundPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: (
      <SuspenseWrapper>
        <NotFoundPage />
      </SuspenseWrapper>
    ),
  },
]);
