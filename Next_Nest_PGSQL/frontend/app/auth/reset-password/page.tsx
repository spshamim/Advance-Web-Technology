"use client";
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [sstoken, setSstoken] = useState<string | null>(searchParams.get('token'));   // Track the token in the URL

  useEffect(() => {
    const currentToken = searchParams.get('token'); // Update token dynamically if the search parameter changes
    setSstoken(currentToken);
  }, [searchParams]);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const formSub = async (data: any) => {
    try {
      if (!sstoken) {
        toast({
          variant: "destructive",
          title: "Password reset failed!",
          description: "Invalid or missing token!",
        });
        return;
      }

      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/auth/reset-password?token=${sstoken}`, {
        newPassword: data.password,
      });

      toast({
        variant: "success",
        title: "Password reset success!",
      });
      router.push('/auth/login');

    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast({
          variant: "destructive",
          title: "Password reset failed!",
          description: "Your reset link has expired. Please request a new one.!",
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Password Reset Request</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(formSub)}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
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
                <span className="text-red-700 text-sm font-bold">{errors.password.message}</span>
              )}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button><br />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;