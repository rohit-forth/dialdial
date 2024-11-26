"use client"
import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useGlobalContext } from "../providers/Provider"
const DialogContentCommon = (props: any) => {
    const {logout}=useGlobalContext();
    
    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle >{props?.title}</AlertDialogTitle>
                <AlertDialogDescription>
                    {props?.des}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={()=>logout()} className={"bg-red-400 text-white"}>Yes, log me out</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}
export default DialogContentCommon