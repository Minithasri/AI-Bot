// import { Link } from 'react-router-dom'
import { useEffect } from "react";
import PopoverLayout from "./HeadlessUI/PopoverLayout";
import { useDispatch, useSelector } from "react-redux";
import { profileRequest } from "@/redux/domo/profile/actions";
import { RootState } from "@/redux/store";
import profilePic from "@/assets/images/users/avatar-1.jpg";

const ProfileDropDown = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(profileRequest());
  }, [dispatch]);

  const authProfile = useSelector((state: RootState) => state.profile);

  const { data } = authProfile;

  if (data) {
    sessionStorage.setItem("domo_profile", `/domo/avatars/v2/USER/${data?.userId}`);
  }

  const PopoverToggler = (user: any) => {
    return (
      <>
        <img
          src={user?.user?.userId ? `/domo/avatars/v2/USER/${user?.user?.userId}` : profilePic}
          alt="user-image"
          className="rounded-full h-8"
        />
        <span className="md:flex flex-col gap-0.5 text-start hidden text-white">
          <h5 className="text-sm">{user?.user?.userName ?? "Domo User"}</h5>
        </span>
      </>
    );
  };

  return (
    <>
      <PopoverLayout
        placement="bottom-end"
        togglerClass="nav-link flex items-center gap-2.5 px-3 bg-black/5 border-x border-black/10"
        toggler={<PopoverToggler user={data} />}
      >
        {/* <div className="mt-1 end-0 absolute w-44 z-50 transition-all duration-300 bg-white shadow-lg border rounded-lg py-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800">
					<h6 className="flex items-center py-2 px-3 text-xs text-gray-800 dark:text-gray-400">Welcome !</h6>

					{(props.menuItems || []).map((item, idx) => {
						return (
							<Link key={idx} to={item.redirectTo} className="flex items-center gap-2 py-1.5 px-4 text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300">
								<i className={`${item.icon} text-lg align-middle`}></i>
								<span>{item.label}</span>
							</Link>
						)
					})}
				</div> */}
        <></>
      </PopoverLayout>
    </>
  );
};

export default ProfileDropDown;
