interface Props {
    error?: string
}

export default function Error({error}: Props){
    if(!error){
        return
    } else {
        return <p className="text-sm font-medium text-red-500">{error}</p>
    }
}