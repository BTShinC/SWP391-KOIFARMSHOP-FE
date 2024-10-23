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
import BlogList from "./pages/blogList";
import RecoveryPassword from "./pages/forgot-password/recovery-password";
import AdminMembers from "./pages/admin/admin-members";
import ManageConsignment from "./pages/admin/manageConsignment";
import BlogDetail from "./pages/blogList/blogPost/blogDetail";
import PrivacyPolicy from "./components/footer/footer page/privacy-policy";
import SupportPolicy from "./components/footer/footer page/support-policy";
import OrderPolicy from "./components/footer/footer page/order-policy";
import RefundPolicy from "./components/footer/footer page/refund-policy";
import LayoutTitle from "./components/layout/title";
import SinglepProduct from "./components/single-product";
import SingleProductCombo from "./components/single-productCombo";
import ShoppingCartPage from "./pages/shopping-cart";
import ManageProductCombo from "./pages/admin/manageProductCombo";
import ManageTransactions from "./pages/admin/manageTransactions";
import WalletPage from "./pages/wallet";
import Consignment from "./pages/consignment";
import CarePackageDetail from "./pages/consignment/carePackage-detail";
import ConsignmentForm from "./pages/consignment-form";
import CarePackageList from "./pages/consignment/carePackage-list";
import OrderTracking from "./pages/orderTracking";
import ConsignmentTracking from "./pages/consignmentTracking";
import CheckoutPage from './pages/checkout';


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
          path: "/consignmentFrom",
          element: <ConsignmentForm />,
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
          path  : "/wallet",
          element : <WalletPage />
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
        }
      ],
    },

    {
      path: "/admin",
      element: <Admin />,
    },
    {
      path: "/managefish",
      element: <ManageFish />,
    },

    {
      path: "/manageOrder",
      element: <ManageOrder />,
    },
    {
      path: "/members",
      element: <AdminMembers />,
    },
    {
      path: "/manageConsignment",
      element: <ManageConsignment />,
    },
    {
      path: "/manageProductCombo",
      element: <ManageProductCombo />,
    },
    {

      path: "/manageTransaction",
      element: <ManageTransactions/>,
    },
    {
      path :"/blog/:id" ,
      element :<BlogDetail />

    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
