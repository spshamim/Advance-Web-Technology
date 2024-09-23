"use client"
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
export default async function Logout() {
    const { toast } = useToast();
    const router = useRouter();

    try {
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/auth/logout`,{},
            { withCredentials: true }
        );
        toast({
            variant: "logout",  
            title: "Logout success!",
        });
        router.push('/auth/login');
    } catch (error: any) {
        if (error.response && error.response.status === 400) {
            toast({
            variant: "destructive",  
            title: "Logout failed!",
            });
        } else {
            toast({
                variant: "destructive",
                title: "An error occurred!",
                description: "Please try again later.",
            });
        }
    }
    
    return (
        <></>
    );
}