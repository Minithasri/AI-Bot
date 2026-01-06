/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect } from "react";
import { Link } from "react-router-dom";

//image
import logo from "@/assets/images/only.png";

// components
import AuthContainer from "../../components/AuthPageLayout/AuthContainer";
import { PageBreadcrumb } from "../../components";

const Error404 = () => {
  useEffect(() => {
    if (document.body) {
      document.body.classList.add("authentication-bg");
    }
    return () => {
      if (document.body) {
        document.body.classList.remove("authentication-bg");
      }
    };
  }, []);
  return (
    <>
      <PageBreadcrumb title="Error 404" />
      <AuthContainer>
        <div className="relative flex flex-col items-center justify-center h-screen">
          <div className="flex justify-center">
            <div className="max-w-md px-4 mx-auto">
              <div className="card overflow-hidden">
                <div className="p-9 bg-[#EE161F]">
                  <Link to="/" className="flex justify-center">
                    <img src={logo} alt="logo-light" className="w-20" />
                  </Link>
                </div>

                <div className="px-6 py-10">
                  <div className="text-center">
                    <h1 className="text-primary text-7xl drop-shadow-xl">
                      4<i className="ri-emotion-sad-line"></i>4
                    </h1>
                    <h4 className="text-[#EE161F] text-lg uppercase my-7">Page Not Found</h4>
                    <p>
                      It's looking like you may have taken a wrong turn. Don't worry... it happens
                      to the best of us. Here's a little tip that might help you get back on track.
                    </p>
                    <Link type="button" className="btn bg-[#EE161F] text-white mt-10" to="/">
                      <i className="ri-home-4-line me-2"></i> Back to Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthContainer>
    </>
  );
};

export default Error404;
