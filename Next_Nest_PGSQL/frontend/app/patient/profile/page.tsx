"use client";
import PatientLayout from "@/components/PatientLayout";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  p_name: string;
  p_phone: string;
  p_dob: string;
  p_gender: string;
  p_address: string;
  p_medical_history: string;
}

const UpdateProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { register, handleSubmit, reset } = useForm<ProfileData>();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/profile/show`, {
          withCredentials: true,
        });
        setProfileData(response.data);
        reset(response.data); // reset with current profile data
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [reset]);

  const handleUpdateProfile = async (data: ProfileData) => {
    try {
      const updatedData = Object.keys(data).reduce((acc, key) => {
        const typedKey = key as keyof ProfileData;
        if (profileData && profileData[typedKey] !== data[typedKey]) {
          acc[typedKey] = data[typedKey];
        }
        return acc;
      }, {} as Partial<ProfileData>);

      if (Object.keys(updatedData).length === 0) {
        toast({
          variant: "update",
          title: "No changes made",
          description: "You haven't changed any fields.",
        });
        return;
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/profile/update-details`,
        updatedData,
        {
          withCredentials: true,
        }
      );

      toast({
        variant: "success",
        title: "Profile updated successfully!",
        description: "Your profile details have been updated.",
      });

      if (profileData) {
        setProfileData({ ...profileData, ...updatedData });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Validation failed.",
        description: "Please input valid data.",
      });
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleUploadPicture = async () => {
    if (!selectedImage) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select an image first.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/profile/update-picture`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      toast({
        variant: "success",
        title: "Profile picture updated!",
        description: "Your profile picture has been uploaded successfully.",
      });
    } catch (error) {
      console.error("Error uploading picture:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload profile picture.",
      });
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const Delresponse = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/profile/deleteprofile`, {
        withCredentials: true,
      });

      if (Delresponse.status === 200) {
        toast({
          variant: "success",
          title: "Profile deleted!",
          description: "Your profile has been deleted successfully.",
        });
        reset({
          p_name: '',
          p_phone: '',
          p_dob: '',
          p_gender: '',
          p_address: '',
          p_medical_history: '',
        });
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete profile.",
      });
    }
  };

  return (
    <PatientLayout>
      <div className="bg-gray-100 min-h-screen py-6 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Update Profile</h2>

          {profileData && (
            <form onSubmit={handleSubmit(handleUpdateProfile)}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  className="border p-2 w-full"
                  {...register("p_name")}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  className="border p-2 w-full"
                  {...register("p_phone")}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  className="border p-2 w-full"
                  {...register("p_dob")}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select className="border p-2 w-full" {...register("p_gender")}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  className="border p-2 w-full"
                  {...register("p_address")}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Medical History</label>
                <input
                  type="text"
                  className="border p-2 w-full"
                  {...register("p_medical_history")}
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Update Profile
              </button>
            </form>
          )}

          <div className="mt-6">
            <h3 className="text-xl font-semibold">Upload Profile Picture</h3>
            <input type="file" onChange={handleImageChange} className="mt-2" />
            <button
              onClick={handleUploadPicture}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 mt-4"
            >
              Upload Picture
            </button>
          </div>

          {/* Delete Profile Button */}
          {profileData && (
            <div className="mt-6">
              <button
                onClick={handleDeleteProfile}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Delete Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </PatientLayout>
  );
};

export default UpdateProfile;