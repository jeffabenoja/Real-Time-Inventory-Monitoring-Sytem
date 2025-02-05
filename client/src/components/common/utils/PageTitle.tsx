import { ReactNode } from "react";

interface props {
    children: ReactNode
}

export default function PageTitle({children}: props){
    return <h1 className='font-primary lg:hidden text-2xl font-medium'>{children}</h1>
}