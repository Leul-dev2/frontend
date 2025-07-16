import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Login from "./pages/Login";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Orders from "./pages/Orders";
import Dashboard from "./pages/Dashboard"; // ✅ You forgot to import this
import ProtectedRoute from "./components/protectedRoute";
import CategoryManagement from "./pages/CategoryManagement";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* ✅ Dashboard route added */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 p-6">
                  <Dashboard />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 p-6">
                  <Products />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
         <Route
          path="/products/category-management"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 p-6">
                  <CategoryManagement />
                </div>
              </div>
            </ProtectedRoute>
          }
          />
        <Route
          path="/products/add"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 p-6">
                  <AddProduct />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/edit/:sku"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 p-6">
                  <EditProduct />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 p-6">
                  <Orders />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
