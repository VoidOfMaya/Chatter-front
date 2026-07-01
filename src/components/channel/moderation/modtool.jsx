import { useParams } from "react-router-dom"
import { Settings, ShieldIcon } from "../../iconhelper/iconHelper";

const ModPanel = ({props}) =>{
    const {groupId} = useParams();
    return(
        <div>
            <Settings size={40}/>
            settings for {groupId}
            <ul>
                <li>-[]get channel info</li>
                <li>-[]leave channel </li>
            </ul>
            <ShieldIcon size={40}/>
            mod tools
            <ul>
                <li>-[] MOD: get all join requests by id</li>
                <li>-[] MOD: approve join request by id</li>
                <li>-[] MOD: reject join request by id</li>
                <li>-[] MOD: remove user from group/ban</li>
                <li>-[] MOD: enable mod Privillage</li>
                <li>-[] MOD: remove mod privillage</li>

            </ul>
        </div>
    )
}

export{
    ModPanel
}