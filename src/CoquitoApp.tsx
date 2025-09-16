import { RouterProvider } from "react-router"
import { appRouter } from "@/router/app.route"

export const CoquitoApp = () => {
  return (
    <RouterProvider router={appRouter} />
  )
}
