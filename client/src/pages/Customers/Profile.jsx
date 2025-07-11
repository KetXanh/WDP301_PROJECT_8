import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { getProfile, updateProfile } from "../../services/Customer/ApiAuth";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { useTranslation } from "react-i18next";
const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    avatar: {
      url: "",
      public_id: "",
    },
    address: [
      {
        fullName: "",
        phone: "",
        street: "",
        ward: "",
        district: "",
        province: "",
      },
    ],
  });
  const accessToken = useSelector((state) => state.customer.accessToken);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(['translation']);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const tempUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        avatar: {
          ...prev.avatar,
          url: tempUrl,
        },
      }));
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (
      ["fullName", "phone", "street", "ward", "district", "province"].includes(
        name
      )
    ) {
      setFormData((prev) => ({
        ...prev,
        address: [
          {
            ...prev.address[0],
            [name]: value,
          },
        ],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const form = new FormData();
      form.append("username", formData.username);
      form.append("email", formData.email);

      const address = formData.address[0];
      form.append("fullName", address.fullName);
      form.append("phone", address.phone);
      form.append("street", address.street);
      form.append("ward", address.ward);
      form.append("district", address.district);
      form.append("province", address.province);

      if (avatarFile) {
        form.append("avatar", avatarFile);
      }

      const res = await updateProfile(form);

      if (res.data && res.data.code === 200) {
        toast.success(t("toast.profileUpdateSuccess"));
        setAvatarFile(null);
      } else if (res.data.code === 401) {
        toast.error(t("toast.emailExists_profile"));
      } else if (res.data.code === 402) {
        toast.error(t("toast.usernameExists_profile"));
      } else {
        toast.error(t("toast.profileUpdateFail"));
      }
      setIsEditing(false);

    } catch (error) {
      console.error(error);
      toast.error(t("toast.profileUpdateError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const userProfile = async () => {
    try {
      const res = await getProfile();
      if (res.data && res.data.code === 200) {
        setFormData(res.data.user);
      } else {
        toast.error(t("toast.profileFetchError"));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getDisplayName = () => {
    return formData.address?.[0]?.fullName || formData.username || "User";
  };

  useEffect(() => {
    userProfile();
  }, [accessToken]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("profile.backHome")}
          </Link>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="relative">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage
                  src={formData.avatar?.url}
                  alt={getDisplayName()}
                />
                <AvatarFallback className="bg-gradient-to-r from-green-600 to-amber-600 text-white text-2xl">
                  {getDisplayName().charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("avatar-upload").click()
                    }
                    className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-2"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {t("profile.changePhoto")}
                  </Button>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </>
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
              {t("profile.title")}
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              )}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {isEditing
                ? t("profile.editHint")
                : t("profile.viewHint")}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <Label
                    htmlFor="username"
                    className="text-sm font-medium text-gray-700"
                  >
                    {t("profile.usernameLabel")}
                  </Label>
                  {isEditing ? (
                    <Input
                      id="username"
                      name="username"
                      value={formData.username || ""}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder={t("profile.usernamePlaceholder")}
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">
                      {formData.username || t("profile.updatePrompt")}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <Label
                    htmlFor="fullName"
                    className="text-sm font-medium text-gray-700"
                  >
                    {t("profile.fullNameLabel")}
                  </Label>
                  {isEditing ? (
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData?.address[0]?.fullName}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">
                      {formData?.address[0]?.fullName ||
                        t("profile.updatePrompt")}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">
                      {formData.email || t("profile.updatePrompt")}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    {t("profile.phoneLabel")}
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      name="phone"
                      value={formData?.address[0]?.phone || ''}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{formData?.address[0]?.phone || t("profile.updatePrompt")}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    {t("profile.addressLabel")}
                  </Label>
                  {isEditing ? (
                    <div className="grid grid-cols-1 gap-3 mt-1">
                      <Input
                        id="street"
                        name="street"
                        placeholder={t("profile.streetPlaceholder")}
                        value={formData?.address[0]?.street || ""}
                        onChange={handleInputChange}
                      />
                      <Input
                        id="ward"
                        name="ward"
                        placeholder={t("profile.wardPlaceholder")}
                        value={formData?.address[0]?.ward || ""}
                        onChange={handleInputChange}
                      />
                      <Input
                        id="district"
                        name="district"
                        placeholder={t("profile.districtPlaceholder")}
                        value={formData?.address[0]?.district || ""}
                        onChange={handleInputChange}
                      />
                      <Input
                        id="province"
                        name="province"
                        placeholder={t("profile.provincePlaceholder")}
                        value={formData?.address[0]?.province || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  ) : (
                    <p className="mt-1 text-gray-900">
                      {formData.address.length === 0
                        ? t("profile.updatePrompt")
                        : `${formData.address[0].street} ${formData.address[0].ward} ${formData.address[0].district} ${formData.address[0].province}`}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700"
                >
                  {isLoading ? t("profile.saving") : t("profile.save")}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {t("profile.cancel")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
