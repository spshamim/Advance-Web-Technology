import Titlebar from "../components/titlebar";
import { Toaster } from "react-hot-toast";

export default function Contact() {
    return (
        <>
            <Toaster />
           <Titlebar title="Contact" />
           <hr />
           <h1 className="text-4xl text-rose-800 text-center">This is Contact Page</h1>
        </>
    );
}