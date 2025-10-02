import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { Outlet } from "react-router"

export function ThemeProvider({
  ...props
}) {
  return <NextThemesProvider {...props}>
    <Outlet />
  </NextThemesProvider>
}