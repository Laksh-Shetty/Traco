import { useState } from "react";
import { Toaster, toast } from "sonner";

const useFetch=(cb)=>{
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const[data, setData]=useState(null);

    const fn= async(...args)=>{
        setLoading(true);
        setError(null);
        try{
            const result= await cb(...args);
            setData(result);
            
            toast.success("Operation successful");
            
        }
        catch(err){
            setError(err);
            toast.error(err.message || "An error occurred");
            
        }   
        finally{
            setLoading(false);
        }
    };

    return {fn,loading,error,data};
}

export default useFetch;