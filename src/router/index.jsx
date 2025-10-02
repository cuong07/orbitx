import MainLayout from "@/components/layouts/MainLayout";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/components/ui/not-found";
import { Particles } from "@/components/ui/particles";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

export const router = createBrowserRouter([
  {
    path: "",
    element: <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    />,
    children: [
      {
        index: true,
        path: "/",
        element: <MainLayout />,
      },
      {
        path: "/trade",
        element: React.createElement(React.lazy(() => import('@/components/layouts/TradingLayout'))),
      }
    ]
  }, {
    path: "*",
    element: <div className="relative bg-black w-full h-[400px]">
      <Particles
        color="#fffff"
        particleCount={25000}
        particleSize={5}
        animate={false}
        className="z-0"
      />
    </div>
  }

]);