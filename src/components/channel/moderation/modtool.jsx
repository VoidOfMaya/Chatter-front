import { useParams } from "react-router-dom"

const ModPanel = ({props}) =>{
    const {groupId} = useParams();
    return(
        <div>
            mod tools for {groupId}
        </div>
    )
}

export{
    ModPanel
}