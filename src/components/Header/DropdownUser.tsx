"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getUserById } from "@/lib/api/user";
import Link from "next/link";
import Image from "next/image";
import ClickOutside from "@/components/ClickOutside";

import Logo from "@/components/ui/assets/logo";
import { WishlistIcon, HamburgerMenu, ChatIcon } from "@/components/ui/assets/svg";
import NavLinks from "@/components/ui/navbar/navLinks";
import NavMobile from "@/components/ui/navbar/navMobile";
import { cn } from "@/lib/utils";

const DropdownUser = () => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [navSearch, setNavSearch] = useState("");
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      getUserById(userId)
        .then(setUser)
        .catch((err) => console.error("Failed to fetch user:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/auth/signin");
  };

  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  //if (!user) return <div className="p-6">Loading profile...</div>;

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      {user ? (
        <>
          <Link
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-4"
            href="#"
          >
            <span className="hidden text-right lg:block">
              <span className="block text-sm font-medium text-black dark:text-white">
                {user?.username || "User"}
              </span>
              <span className="block text-xs">Admin</span>
            </span>

            <span className="h-12 w-12 rounded-full">
              <Image
                width={112}
                height={112}
                src={user?.profilePicture || "/images/default-profile.png"}
                style={{ width: "auto", height: "auto" }}
                alt="User"
              />
            </span>

            <svg
              className="hidden fill-current sm:block"
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
                fill=""
              />
            </svg>
          </Link>

          {dropdownOpen && (
            <div className="absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
                <li>
                  <Link
                    href={`/profile/${user.userId}`}
                    //href={`/profile`}
                    className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                  >
                    {/* Profile Icon */}
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 9.62499C8.42188 9.62499 6.35938 7.59687 6.35938 5.12187C6.35938 2.64687 8.42188 0.618744 11 0.618744C13.5781 0.618744 15.6406 2.64687 15.6406 5.12187C15.6406 7.59687 13.5781 9.62499 11 9.62499ZM11 2.16562C9.28125 2.16562 7.90625 3.50624 7.90625 5.12187C7.90625 6.73749 9.28125 8.07812 11 8.07812C12.7188 8.07812 14.0938 6.73749 14.0938 5.12187C14.0938 3.50624 12.7188 2.16562 11 2.16562Z"
                        fill=""
                      />
                      <path
                        d="M17.7719 21.4156H4.2281C3.5406 21.4156 2.9906 20.8656 2.9906 20.1781V17.0844C2.9906 13.7156 5.7406 10.9656 9.10935 10.9656H12.925C16.2937 10.9656 19.0437 13.7156 19.0437 17.0844V20.1781C19.0094 20.8312 18.4594 21.4156 17.7719 21.4156ZM4.53748 19.8687H17.4969V17.0844C17.4969 14.575 15.4344 12.5125 12.925 12.5125H9.07498C6.5656 12.5125 4.5031 14.575 4.5031 17.0844V19.8687H4.53748Z"
                        fill=""
                      />
                    </svg>
                    My Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3.5 text-sm font-medium text-red-500 hover:text-red-700 lg:text-base"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </>
      ) : (
        <Link
          href="/auth/signin"
          className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-opacity-90 transition-all text-sm font-medium"
        >
          Login
        </Link>
      )}
    </ClickOutside>
  );

};

export default DropdownUser;
