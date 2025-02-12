import { ReactNode } from "react";

interface props {
    children: ReactNode
}

export default function PageTitle({children}: props){
    return <h1 className='font-primary text-2xl font-medium mb-2'>{children}</h1>
}