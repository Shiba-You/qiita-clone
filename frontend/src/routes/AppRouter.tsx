// src/routes/AppRouter.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "../pages/signup/index";
import Login from "../pages/login/index";
import Dashboard from "../pages/dashboard/index";
import Mypage from "../pages/mypage/index";
import DefaultLyaouts from "../layouts/DefaultLyaouts";
import React from "react";
import { AuthProvider, PrivateRoute } from "./AuthProvider";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<DefaultLyaouts />}>
            <Route element={<PrivateRoute />}>
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/mypage" element={<Mypage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;
