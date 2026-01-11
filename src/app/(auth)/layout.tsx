import {ReactNode} from 'react'
import "../globals.css";
import { IoLogoGithub } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { Github, signInAction } from '@/actions/serverActions';

const ReactLayout = ({ children }:
    Readonly<{ children: ReactNode }>) => {
    return (
        <section className=' max-w-2xl mx-auto  shadow-2xl dark:shadow-accent dark:shadow-xl my-20 rounded-lg  boeder-1 border-accent  dark:border-1 dark:border-accent'>
                 
                       {children}
        
                    
                </section>
    )
}

export default ReactLayout