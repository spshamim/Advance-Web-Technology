"use client"
import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
   } = useForm();  

  const formSubmiited = async (data:any) => {
    try {
      const backResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/auth/login`, {
        u_name: data.username,
        u_password: data.password,
      },
      {withCredentials: true});

      if(backResponse.status == 201){
        toast({
          variant: "success",  
          title: "Login success!",
        });

        router.push("/patient/info");
      }
      
    } catch (error:any) {
        if (error.response && error.response.status === 400) {
          toast({
            variant: "destructive",  
            title: "Login failed!",
              description: "Invalid username or password!",
          });
      } else {
          toast({
              variant: "destructive",
              title: "An error occurred!",
              description: "Please try again later.",
          });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(formSubmiited)}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                {...register("username",{
                    required: "Username is required",
                    pattern: { value: /^[A-Za-z0-9]{3,16}$/, message: "Username should be between 3 and 16 characters and contain only letters and numbers" }
                })}
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            {errors.username && typeof errors.username.message === "string" && (
            <span className="text-red-700 text-sm font-bold">{errors.username.message}</span>)}
            </div>
            <div>
              <input
                {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Password should be at least 8 characters long" },
                    pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, message: "Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character" }
                })}
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            {errors.password && typeof errors.password.message === "string" && (
            <span className="text-red-700 text-sm font-bold">{errors.password.message}</span>)}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
            <Link href="/auth/reset-request" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot your password?</Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button><br />
            <button
              type="button"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              onClick={()=> router.push('/signup')}
            >
              Need an account ?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;