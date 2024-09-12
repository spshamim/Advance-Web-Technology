"use client"

import { Toaster, toast } from "react-hot-toast";

export default function Test() {
    const notify = () => {
        //toast("Your request is being processed...");

        // toast('Hello World', {
        //     duration: 2000,
        //     position: 'top-center',
          
        //     // Styling
        //     style: {},
        //     className: '',
          
        //     // Custom Icon
        //     icon: '👏',
          
        //     // Change colors of success/error/loading icon
        //     iconTheme: {
        //       primary: '#000',
        //       secondary: '#fff',
        //     },
          
        //     // Aria
        //     ariaProps: {
        //       role: 'status',
        //       'aria-live': 'polite',
        //     },
        //   });

        //toast.success("Your request is being processed.",{duration: 2000});
        //toast.error("Your request is denied.",{duration: 2000, icon: '❌'});
        toast("Notification turned off.",{duration: 2000, icon: '🔕'});
    }
    
    
    return (
        <>
            <Toaster/>
            <button type="button" className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-10 ml-10"
            onClick={notify}
            >Make a toast</button>
        </>
    );
}