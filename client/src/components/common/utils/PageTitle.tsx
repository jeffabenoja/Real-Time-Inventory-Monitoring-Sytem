import { ReactNode } from "react";

interface props {
    children: ReactNode
}

export default function PageTitle({children}: props){
    return <h1 className='text-3xl font-bold mb-5'>{children}</h1>
}