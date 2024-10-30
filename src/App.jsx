import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import UserInfoPage from "./pages/userinfo";
import Admin from "./pages/admin/index";
import Layout from "./components/layout";
import RegisterForm from "./pages/register";
import AboutPage from "./pages/about";
import ManageFish from "./pages/admin/manageFish";
import ContactPage from "./pages/contact";
import ComparePage from "./pages/compare";
import ManageOrder from "./pages/admin/manageOrders";
import ProductPage from "./pages/product";
import ProductComboPage from "./pages/productCombo";
import SinglepProduct from "./components/single-product";
import SingleProductCombo from "./components/single-productCombo";
import BlogList from "./pages/blogList";
import BlogDetail from "./pages/blogList/blogPost/blogDetail";
import RecoveryPassword from "./pages/forgot-password/recovery-password";
import AdminMembers from "./pages/admin/admin-members";
import ManageConsignment from "./pages/admin/manageConsignment";
import PrivacyPolicy from "./components/footer/footer page/privacy-policy";
import SupportPolicy from "./components/footer/footer page/support-policy";
import OrderPolicy from "./components/footer/footer page/order-policy";
import RefundPolicy from "./components/footer/footer page/refund-policy";
import LayoutTitle from "./components/layout/title";
import ShoppingCartPage from "./pages/shopping-cart";
import ManageProductCombo from "./pages/admin/manageProductCombo";
import ManageTransactions from "./pages/admin/manageTransactions";
import WalletPage from "./pages/wallet";
import Consignment from "./pages/consignment";
import CarePackageDetail from "./pages/consignment/carePackage-detail";
import ConsignmentForm from "./pages/consignment-form";
import CarePackageList from "./pages/consignment/carePackage-list";
import PaymentPage from "./pages/consignment-form/payment";
import SellPayment from "./pages/consignment-form/payment/sell-payment";
import OrderTracking from "./pages/orderTracking";
import ConsignmentTracking from "./pages/consignmentTracking";
import VnpayResponsePage from "./components/vnpay";
import CheckoutPage from "./pages/checkout";
import OrderSuccess from "./pages/orderSuccess";
import ConsignmentSuccess from "./pages/consignmentSuccess";

import ManageContact from "./pages/admin/manageContact";
import OwnTransaction from "./pages/ownTransaction";
import DashboardPage from "./pages/admin/dashboard";
import AdminRoute from "./components/admin-components/admin-route";

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <HomePage />,
        },
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/register",
          element: <RegisterForm />,
        },
        {
          path: "/singleproduct/:id",
          element: <SinglepProduct />,
        },
        {
          path: "/singleproductcombo/:id",
          element: <SingleProductCombo />,
        },
        {
          path: "/recoveryPassword",
          element: <RecoveryPassword />,
        },
        {
          path: "/carepackagedetail/:id",
          element: <CarePackageDetail />,
        },
        {
          path: "/userinfo",
          element: <UserInfoPage />,
        },
        {
          path: "/carePackageList",
          element: <CarePackageList />,
        },
        {
          path: "/consignment",
          element: <Consignment />,
        },
      ],
    },
    {
      path: "",
      element: <LayoutTitle />,
      children: [
        {
          path: "/about",
          element: <AboutPage />,
        },
        {
          path: "/consignmentTracking",
          element: <ConsignmentTracking />,
        },
        {
          path: "/blog",
          element: <BlogList />,
        },
        {
          path: "/contact",
          element: <ContactPage />,
        },
        {
          path: "/compare",
          element: <ComparePage />,
        },
        {
          path: "/shoppingcart",
          element: <ShoppingCartPage />,
        },
        {
          path: "/product",
          element: <ProductPage />,
        },
        {
          path: "/productcombo",
          element: <ProductComboPage />,
        },
        {
          path: "/privacy-policy",
          element: <PrivacyPolicy />,
        },
        {
          path: "/support-policy",
          element: <SupportPolicy />,
        },
        {
          path: "/order-policy",
          element: <OrderPolicy />,
        },
        {
          path: "/refund-policy",
          element: <RefundPolicy />,
        },
        {
          path: "/consignmentFrom",
          element: <ConsignmentForm />,
        },
        {
          path: "/consignmentPayment",
          element: <PaymentPage />,
        },
        {
          path: "/consignmentSellPayment",
          element: <SellPayment />,
        },
        {
          path: "/wallet",
          element: <WalletPage />,
        },
        {
          path: "/wallet/vnpay/response",
          element: <VnpayResponsePage />,
        },
        {
          path: "/orderTracking",
          element: <OrderTracking />,
        },
        {
          path: "/consignmentTracking",
          element: <ConsignmentTracking />,
        },

        {
          path: "/checkout",
          element: <CheckoutPage />,
        },

        {
          path: "/orderSuccess",
          element: <OrderSuccess />,
        },
        {
          path: "/consignmentSuccess",
          element: <ConsignmentSuccess />,
        },
        {
          path: "/ownTransaction",
          element: <OwnTransaction />,
        },
      ],
    },
    {
      path: "/admin",
      element: <AdminRoute element={<Admin />} />,
    },
    {
      path: "/managefish",
      element: <AdminRoute element={<ManageFish />} />,
    },
    {
      path: "/manageOrder",
      element: <AdminRoute element={<ManageOrder />} />,
    },
    {
      path: "/members",
      element: <AdminRoute element={<AdminMembers />} />,
    },
    {
      path: "/manageConsignment",
      element: <AdminRoute element={<ManageConsignment />} />,
    },
    {
      path: "/manageProductCombo",
      element: <AdminRoute element={<ManageProductCombo />} />,
    },
    {
      path: "/manageTransaction",
      element: <AdminRoute element={<ManageTransactions />} />,
    },
    {
      path: "/manageContact",
      element: <AdminRoute element={<ManageContact />} />,
    },

    {
      path: "/blog/:id",
      element: <BlogDetail />,
    },
    {
      path: "/dashboard",
      element: <AdminRoute element={<DashboardPage />} />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
