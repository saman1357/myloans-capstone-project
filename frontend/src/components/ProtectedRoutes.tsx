import {Navigate, Outlet} from "react-router-dom";
import {UserWithoutPassword} from "../model/DataModels.ts";

type Props={
    user?:UserWithoutPassword
}
export default function ProtectedRoutes(props: Props){
    const isAuthenticated=props.user?.username!==undefined && props.user?.username!=='anonymousUser';
    return (
        isAuthenticated ? <Outlet/> : <Navigate to={"/login"}/>
    )
}
