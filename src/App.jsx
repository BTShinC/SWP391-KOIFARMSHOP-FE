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
import ShoppingCartPage from "./pages/shopping-cart";
import ManageProductCombo from "./pages/admin/manageProductCombo";



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
          element: <SinglepProduct/>,
        },
        {
          path: "/recoveryPassword",
          element: <RecoveryPassword/>,
        },
        {
          path: "/blog",
          element: <BlogList/>,
        },
        {
          path: "/userinfo",
          element: <UserInfoPage />,
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

      ],
    },

    

   

    {
      path: "/admin",
      element: <Admin />,
    },
    {
      path: "/managefish",
      element: <ManageFish />,
    }, {
      path: "/manageOrder",
      element: <ManageOrder />,

    },
    {
      path: "/members",
      element: <AdminMembers/>,
    },
    {
      path: "/manageConsignment",
      element: <ManageConsignment/>,
    },
    {
      path: "/manageProductCombo",
      element: <ManageProductCombo/>,
    },
    {
      path :"/blog/:id" ,
      element :<BlogDetail />
    },

  ]);
  return <RouterProvider router={router} />;
}

export default App;
