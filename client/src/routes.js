import { createBrowserRouter, Navigate } from "react-router-dom";

import SignIn from "./pages/SignIn";
import Users from "./pages/Users";
import UserEdit, { userLoader } from "./pages/UserEdit";
import PrivateRoute from "./components/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/users" replace />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/users",
    element: (
      <PrivateRoute>
        <Users />
      </PrivateRoute>
    ),
  },
  {
    path: "/users/:userId",
    element: (
      <PrivateRoute>
        <UserEdit />
      </PrivateRoute>
    ),
    loader: userLoader,
  },
]);

export default router;
