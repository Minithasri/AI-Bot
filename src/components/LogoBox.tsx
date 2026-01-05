/* eslint-disable react/react-in-jsx-scope */
import { Link } from "react-router-dom";

//image
// import logo from "@/assets/images/logo.png";
const logo = "/thumbnail.png";
// import logoSm from '@/assets/images/logo-sm.png'
// import logoDark from '@/assets/images/logo-dark.png'

const LogoBox = () => {
  return (
    <>
      <Link to="/" className="flex items-center">
        <img src={logo} className="w-24 mr-2" alt="GWC Logo" />
        {/* <div className="logo-light">
					<img src={logo} className="logo-lg h-[22px]" alt="Light logo" />
					<img src={logo} className="logo-sm h-[22px]" alt="Small logo" />
				</div>

				<div className="logo-dark">
					<img src={logo} className="logo-lg h-[22px]" alt="Dark logo" />
					<img src={logo} className="logo-sm h-[22px]" alt="Small logo" />
				</div> */}
      </Link>
    </>
  );
};

export default LogoBox;
