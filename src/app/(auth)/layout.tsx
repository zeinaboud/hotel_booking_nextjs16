import {ReactNode} from 'react'
import "../globals.css";
import { IoLogoGithub } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
const ReactLayout = ({ children }:
    Readonly<{ children: ReactNode }>) => {
    return (
        <body>
            {children}
        </body>

    )
}

export default ReactLayout