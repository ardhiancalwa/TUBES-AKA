"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../../../public/logo-2.png";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/modulo-calculator", label: "Features" },
    { href: "/analyze-algorithm", label: "Analyze Algorithm" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav
      className={`${
        isScrolled
          ? "bg-blue-950/60 backdrop-blur-3xl"
          : "bg-white border-gray-200 dark:bg-blue-950"
      } transition-all fixed z-50 top-0 left-0 right-0`}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image src={Logo} alt="EasyModulo Logo" className="w-12 h-12" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            EasyModulo
          </span>
        </Link>
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`hidden w-full md:block md:w-auto ${
            isOpen ? "block" : "hidden"
          }`}
          id="navbar-default"
        >
          <ul
            className={`font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 dark:border-gray-700`}
          >
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent ${
                    pathname === href
                      ? "text-blue-700 font-bold"
                      : "text-gray-900"
                  }`}
                >
                  <p class="group relative w-max">
                    <span>{label}</span>
                    <span class="absolute -bottom-1 left-1/2 w-0 transition-all h-0.5 duration-300 bg-white group-hover:w-3/6"></span>
                    <span class="absolute -bottom-1 right-1/2 w-0 transition-all h-0.5 duration-300 bg-white group-hover:w-3/6"></span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
