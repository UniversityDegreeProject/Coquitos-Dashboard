import { createBrowserRouter } from "react-router";

// components Layouts
import { CoquitoLayout } from "@/coquitos/dashboard/layouts/CoquitoLayout";

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

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <CoquitoLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: '/orders',
        element: <OrdersPage />,
      },
      {
        path: '/products',
        element: <ProductPage />,
      },
      {
        path: '/categories',
        element: <CategoriesPage />,
      },
      {
        path: '/clients',
        element: <ClientsPage />,
      },
      {
        path: '/users',
        element: <UsersPage />,
      },
      {
        path: '/reports',
        element: <ReportPage />,
      },
      {
        path: '/cash-closing',
        element: <CashClosePage />,
      },
      {
        path: '/settings',
        element: <SettingPage />,
      }
    ],
  },
])