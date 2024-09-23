"use client";
import { useForm } from "react-hook-form";
import Titlebar from '../../components/titlebar';
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Signup() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();    

    const formSubmitted = (data:any) => {
        (()=> toast.success("Signup Successfull..",{duration: 2000}))()
        console.log(data);
        router.push("/about/user");
    }
 
    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-3xl p-8 mt-10 mb-10">
            <Toaster/>
            <Titlebar title="Signup"/>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Registration Form</h2>

            <form onSubmit={handleSubmit(formSubmitted)}>
                <div className="grid grid-cols-2 gap-8">

                    {/* Left Column */}
                    <div>
                        {/* Name */}
                        <div className="mb-4">
                            <label htmlFor="fullname" className="block text-gray-700 font-medium mb-2">Full Name</label>
                            <input {...register("fullname", {
                                required: "Name is required",
                                minLength: {value:6, message: "Name must be at least 6 characters"},
                                maxLength: {value:50, message: "Name must be at most 50 characters"},
                                pattern: {value: /^[a-zA-Z\s]+$/, message: "Full name should contain only alphabetic characters and spaces."}
                            })} 
                            type="text"
                            placeholder="Type your Full Name"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600"
                            />
                            {errors.fullname && typeof errors.fullname.message === "string" && (
                            <span className="text-red-700 text-sm font-bold">{errors.fullname.message}</span>)}
                        </div> 

                        {/* ID */}
                        <div className="mb-4">
                            <label htmlFor="id" className="block text-gray-700 font-medium mb-2">ID</label>
                            <input {...register("id", {
                                required: "ID is required",
                                pattern: { value: /^[0-9]{8}$/, message: "ID should be exactly 8 digits" }
                            })}
                            type="text"
                            placeholder="Type your ID"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600"
                            />
                            {errors.id && typeof errors.id.message === "string" && (
                            <span className="text-red-700 text-sm font-bold">{errors.id.message}</span>)}
                        </div>

                        {/* Email */}
                        <div className="mb-4">  
                            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                            <input {...register("email", {
                                required: "Email is required",
                                pattern: {value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, message: "Enter a valid email address."}
                            })}
                            type="email"
                            placeholder="Type your email"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600"
                            />
                            {errors.email && typeof errors.email.message === "string" && (
                            <span className="text-red-700 text-sm font-bold">{errors.email.message}</span>)}
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
                            <input
                            {...register("password", {
                                required: "Password is required",
                                minLength: {value: 8, message: "Password must be at least 8 characters."},
                                pattern: { value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, message: "Password must include at least one uppercase letter, one lowercase letter, one number, one special character, and no spaces." }
                            })}
                            type="password"
                            placeholder="Type your Password"
                            className="w-full px-3 py-2 border rounded-lg"
                            />
                            {errors.password && typeof errors.password.message === "string" && (
                            <span className="text-red-700 text-sm font-bold">{errors.password.message}</span>)}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div>
                        {/* Gender */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Gender</label>
                            <div className="flex items-center">
                                <label className="mr-4">
                                    <input {...register("gender", { required: "Gender is required" })} type="radio" value="Male" className="mr-2"/>
                                    Male
                                </label>
                                <label className="mr-4">
                                    <input {...register("gender", { required: "Gender is required" })} type="radio" value="Female" className="mr-2"/>
                                    Female
                                </label>
                                <label>
                                    <input {...register("gender", { required: "Gender is required" })} type="radio" value="Others" className="mr-2"/>
                                    Others
                                </label>
                            </div>
                            {errors.gender && typeof errors.gender.message === "string" && (
                            <span className="text-red-700 text-sm font-bold">{errors.gender.message}</span>)}
                        </div>

                        {/* Date of Birth */}
                        <div className="mb-4">
                            <label htmlFor="dob" className="block text-gray-700 font-medium mb-2">Date of Birth</label>
                            <input {...register("dob", { required: "Date of Birth is required" })} 
                            type="date" 
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600"
                            />
                            {errors.dob && typeof errors.dob.message === "string" && (
                            <span className="text-red-700 text-sm font-bold">{errors.dob.message}</span>)}
                        </div>

                        {/* Skills */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Skills</label>
                            <div className="flex items-center">
                                <label className="mr-4">
                                    <input {...register("skills")} type="checkbox" value="React" className="mr-2"/>
                                    React
                                </label>
                                <label className="mr-4">
                                    <input {...register("skills")} type="checkbox" value="Nest" className="mr-2"/>
                                    Nest
                                </label>
                                <label className="mr-4">
                                    <input {...register("skills")} type="checkbox" value="Python" className="mr-2"/>
                                    Python
                                </label>
                                <label className="mr-4">
                                    <input {...register("skills")} type="checkbox" value="C++" className="mr-2"/>
                                    C++
                                </label>
                                <label>
                                    <input {...register("skills")} type="checkbox" value="C#" className="mr-2"/>
                                    C#
                                </label>
                            </div>
                        </div>

                        {/* Education */}
                        <div className="mb-4">
                            <label htmlFor="education" className="block text-gray-700 font-medium mb-2">Education</label>
                            <select {...register("education", { required: "Education level is required" })} 
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600">
                                <option value="">Select your education level</option>
                                <option value="Phd">PhD</option>
                                <option value="MSc">MSc</option>
                                <option value="BSc">BSc</option>
                                <option value="HSC">HSC</option>
                                <option value="SSC">SSC</option>
                            </select>
                            {errors.education && typeof errors.education.message === "string" && (
                            <span className="text-red-700 text-sm font-bold">{errors.education.message}</span>)}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="col-span-2 flex justify-center">
                    <button type="submit" className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-20 py-2.5 text-center mt-4 cursor-pointer">Submit</button>
                </div>
            </form>
        </div>
    )
}