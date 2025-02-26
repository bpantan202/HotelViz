import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HotelIcon from "@mui/icons-material/Hotel";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import Link from "next/link";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

export default async function TopMenu() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="h-12 grid grid-cols-5 backdrop-blur bg-slate-100/70 fixed top-0 left-0 right-0 z-30 border-gray-200 shadow-lg px-5">
      <div className="flex flex-1 items-center h-full ">
        <Link
          href="/"
          className="flex items-center space-x-2 text-gray-700 duration-300 ease-in-out hover:text-blue-900"
        >
          <img
            src={"/images/LOGO.jpeg"}
            className="w-8 h-8 rounded-xl" // Example dimensions
            alt="logo Icon"
          ></img>
          <span className="self-center text-xl font-sans font-semibold whitespace-nowrap">
            Hotel Wisdom
          </span>
        </Link>
      </div>
      <div className="flex items-center h-full w-fit col-span-3 justify-items-center place-self-center justify-content-center">
        <Link
          href="/hotel"
          className="rounded-lg py-2 pr-4 pl-3 text-gray-700 duration-300 ease-in-out hover:bg-blue-100 hover:text-blue-900 flex items-center space-x-2"
        >
          <HotelIcon />
          <span className="text-lg font-medium">Hotels</span>
        </Link>
        {/* <Link
          href="/account/favorites"
          className="rounded-lg py-2 pr-4 pl-3 duration-300 ease-in-out text-gray-700 hover:bg-blue-100 hover:text-blue-900 flex items-center space-x-2"
        >
          <FavoriteIcon />
          <span className="text-lg font-medium">My Favorites</span>
        </Link> */}
        {session ? (
          <Link
            href="/account/mybookings"
            className="rounded-lg py-2 pr-4 pl-3 text-gray-700 duration-300 ease-in-out hover:bg-blue-100 hover:text-blue-900 flex items-center space-x-2"
          >
            <BookmarkIcon />
            <span className="text-lg font-medium">
              {session?.user.role === "admin" ? "Manage" : "My"} Bookings
            </span>
          </Link>
        ) : (
          <Link
            href="/api/auth/signin?callbackUrl=%2F"
            className="rounded-lg py-2 pr-4 pl-3 text-gray-700 duration-300 ease-in-out hover:bg-blue-100 hover:text-blue-900 flex items-center space-x-2"
          >
            <BookmarkIcon />
            <span className="text-lg font-medium">My Bookings</span>
          </Link>
        )}
        {session?.user.role === "admin" ? (
          <Link
            href="/admin/allHotels"
            className="rounded-lg py-2 pr-4 pl-3 text-gray-700 duration-300 ease-in-out hover:bg-blue-100 hover:text-blue-900 flex items-center space-x-2"
          >
            <ListAltIcon />
            <span className="text-lg font-medium">Manage Hotels</span>
          </Link>
        ) : (
          ""
        )}
        {session?.user.role === "admin" ? (
          <Link 
            href="/admin/managecoupon"
            className="rounded-lg py-2 pr-4 pl-3 text-gray-700 duration-300 ease-in-out hover:bg-blue-100 hover:text-blue-900 flex items-center space-x-2"
          >
            <ConfirmationNumberIcon/>
            <span data-testid="Manage-Coupon" className="text-lg font-medium">Manage Coupon</span>
          </Link>
        ) : (
          ""
        )}
      </div>

      <div className="flex flex-1 items-center justify-items-end place-self-end h-full">
        {session ? (
          <div className="flew-row flex">
            <Link
              className="rounded-xl py-2 pr-4 pl-3 text-gray-700 duration-300 ease-in-out hover:bg-blue-100 hover:text-blue-900 flex items-center space-x-2"
              href="/member">
              <PersonIcon />
              <div className="underline text-lg font-sans font-semibold whitespace-nowrap">
                {session.user.name}
              </div>
            </Link>
          <Link
            className="rounded-xl py-2 pr-4 pl-3 text-gray-700 duration-300 ease-in-out hover:bg-blue-100 hover:text-blue-900 flex items-center space-x-2"
            href="/api/auth/signout?callbackUrl=%2F">
            <div className="underline text-lg font-sans font-semibold whitespace-nowrap">
              <LogoutIcon />
              Sign-Out 
              {/* of {session.user.name} */}
            </div>
          </Link>
          
          </div>
        ) : (
          <div className="flew-row flex">
            <Link
              className="rounded-xl py-2 pr-4 pl-3 text-gray-700 duration-300 ease-in-out hover:bg-blue-100 hover:text-blue-900 flex items-center space-x-2"
              href="/api/auth/signin?callbackUrl=%2F"
            >
              <LoginIcon />
              <div data-testid="Sign-In" className="underline text-lg font-sans font-semibold whitespace-nowrap">
                Sign-In
              </div>
            </Link>
            <Link
              className="rounded-xl py-2 pr-4 pl-3 text-gray-700 duration-300 ease-in-out hover:bg-blue-100 hover:text-blue-900 flex items-center space-x-2"
              href="/signup"
            >
              <PersonIcon />
              <div className="underline text-lg font-sans font-semibold whitespace-nowrap">
                Sign-Up
              </div>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
