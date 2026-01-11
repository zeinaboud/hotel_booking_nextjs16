import { logoutAction } from '@/actions/serverActions';
import
  {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import Link from 'next/link';
import { IoPersonCircleSharp } from "react-icons/io5";

interface NavbarProps {
  image?: string | null;
  name?: string | null;
  user?: string | null;
}
const Userbutton = ({ image, name ,user}: NavbarProps) => {
    return (
      <>
        <div className='flex items-center'>
            {user ? (<DropdownMenu>
                <DropdownMenuTrigger  asChild>
                   <button
                        className=' flex items-center'
                    >
                        { image ? (
                            <img
                            src={image}
                            alt={name || "profile"}
                            className="w-8 h-8 rounded-full cursor-pointer"
                            />
                        ) : (
                            <Link href="/signin">
                            <IoPersonCircleSharp size={24} />
                            </Link>
                        )}
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className='w-48'>
                    <DropdownMenuLabel className='color-primary'>{ name || "user"}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem  >
                       <button type="submit" className='w-full h-full '>
                                  setting
                        </button>
                    </DropdownMenuItem>
                    < DropdownMenuGroup>
                        <DropdownMenuSeparator />
                         <DropdownMenuItem >
                            <form action={logoutAction} className='w-full h-full'>
                                <button type="submit" className='w-full h-full '>
                                    Sign out
                                </button>
                            </form>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
          </DropdownMenu>
          ) : (
              <button
                className=' flex items-center'
              >
                        { image ? (
                            <img
                            src={image}
                            alt={name || "profile"}
                            className="w-8 h-8 rounded-full cursor-pointer"
                            />
                        ) : (
                            <Link href="/signin">
                            <IoPersonCircleSharp size={24} />
                            </Link>
                        )}
              </button>
          ) }


          </div>
        </>
    )
}

export default Userbutton
