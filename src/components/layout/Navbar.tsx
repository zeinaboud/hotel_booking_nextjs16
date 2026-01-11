"use client";
import
  {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
  } from "@/components/ui/dropdown-menu";
import navbarLink from '@/constants/navbarLink';
import { useTheme } from "next-themes";
import Link from 'next/link';
import React from 'react';
import { HiMenu } from "react-icons/hi";
import { MdDarkMode, MdOutlineDarkMode } from "react-icons/md";
import Userbutton from "../Userbutton";
interface NavbarProps {
  image?: string | null;
    name?: string | null;
    user?: string | null;
}
const Navbar = ({ image, name,user }: NavbarProps) => {
    const { theme, setTheme } = useTheme();
    return (
        <div className='max-w-7xl px-4 mx-auto py-4'>
            <nav className='flex justify-between items-center  relative'>
                <div>
                    <Link href="/">
                        <img src="" alt='logo' />
                    </Link>
                </div>
                {/* Navigation menu */}
                {/* Desktop */}
                <div className="hidden md:flex gap-5">
                {navbarLink.map((item, index) => (
                    <Link key={index} href={item.link}>
                    {item.name}
                    </Link>
                ))}
                </div>


                {/* Mobile controls - visible only on mobile */}
                <div className='flex items-center  md:justify-between gap-2  z-20'>
                    <button >
                        <Userbutton image={image} name={name} user={user}/>
                    </button>
                    <button
                        className='p-2'
                        onClick={()=> setTheme(theme === "dark" ? "light" : "dark") }
                    >
                        {theme === "dark" ? (
                            <MdDarkMode size={24} />
                        ) : (
                            < MdOutlineDarkMode size={24} />
                        )}
                    </button>
                    {/* Mobile */}
                    <DropdownMenu>
                    <DropdownMenuTrigger className="md:hidden py-3 ">
                        <HiMenu size={24} />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48">
                        {navbarLink.map((item, index) => (
                        <React.Fragment key={index}>
                            <DropdownMenuItem asChild>
                            <Link href={item.link}>{item.name}</Link>
                            </DropdownMenuItem>

                            {index !== navbarLink.length - 1 && (
                            <DropdownMenuSeparator />
                            )}
                        </React.Fragment>
                        ))}
                    </DropdownMenuContent >

                </DropdownMenu>

                </div>
            </nav>
        </div>
    )
    }

export default Navbar
