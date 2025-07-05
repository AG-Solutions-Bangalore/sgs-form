import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Heart,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Camera,
} from "lucide-react";
import PhotoUpload from "./PhotoUpload";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useNumericInput from "@/hooks/useNumericInput";
interface FormData {
  user_full_name: string;
  user_email: string;
  user_mobile: string;
  user_whatsapp: string;
  user_dob: string;
  user_add: string;
  user_spouse_name: string;
  user_spouse_mobile: string;
  user_spouse_dob: string;
  user_type: string;
  user_cat: string;
  user_image: string;
  spouse_image: string;
}

const MembershipForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const keydown = useNumericInput();
  const [formData, setFormData] = useState<FormData>({
    user_full_name: "",
    user_email: "",
    user_mobile: "",
    user_whatsapp: "",
    user_dob: "",
    user_add: "",
    user_spouse_name: "",
    user_spouse_mobile: "",
    user_spouse_dob: "",
    user_type: "",
    user_cat: "",
    user_image: "",
    spouse_image: "",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const dataURLtoBlob = (dataURL: string): Blob => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    const newErrors: Record<string, string> = {};

    if (!formData.user_full_name.trim()) {
      newErrors.user_full_name = "Full name is required";
    }

    if (!formData.user_email.trim()) {
      newErrors.user_email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email)) {
      newErrors.user_email = "Please enter a valid email";
    }

    if (!formData.user_mobile.trim()) {
      newErrors.user_mobile = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(formData.user_mobile)) {
      newErrors.user_mobile = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.user_dob) {
      newErrors.user_dob = "Date of birth is required";
    }

    if (!formData.user_add.trim()) {
      newErrors.user_add = "Address is required";
    }

    if (!formData.user_type) {
      newErrors.user_type = "Membership type is required";
    }

    if (!formData.user_cat) {
      newErrors.user_cat = "Samaj selection is required";
    }
    if (!formData.user_image) {
      newErrors.user_image = "Member Photo  is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "user_image" || key === "spouse_image") {
          if (value instanceof File) {
            data.append(key, value);
          } else if (typeof value === "string" && value.startsWith("data:")) {
            const blob = dataURLtoBlob(value);
            data.append(key, blob, `${key}.jpg`);
          }
        } else {
          if (value !== null && value !== undefined) {
            data.append(key, value.toString());
          }
        }
      });

      const response = await axios.post(
        "https://samyuktgujaratisamaj.com/admin/public/api/create-member",
        data,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.code == 201) {
        localStorage.setItem("membershipData", JSON.stringify(formData));

        toast({
          title: "Success!",
          description:
            response.data.message ||
            "Your membership application has been submitted successfully.",
        });
     navigate('/profile')
      } 
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message || "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const hasError = (fieldName: string) => {
    return errors[fieldName]
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "";
  };
  return (
    <div className=" relative py-8">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/70 to-red-50/70">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `
          url("data:image/svg+xml,%3Csvg viewBox='0 0 800 800' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E"),
          radial-gradient(circle at 75% 30%, #f97316 0%, transparent 25%),
          radial-gradient(circle at 25% 70%, #ea580c 0%, transparent 25%),
          radial-gradient(circle at 50% 90%, #c2410c 0%, transparent 30%)
        `,
              backgroundSize: "auto, 400px 400px, 400px 400px, 400px 400px",
              backgroundPosition: "0 0, 0 0, 100px 100px, 200px 200px",
              filter: "blur(40px)",
            }}
          ></div>

          <div className="absolute inset-0 overflow-hidden opacity-15">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full mix-blend-multiply"
                style={{
                  background: `radial-gradient(circle, ${
                    i % 2 ? "#fb923c" : "#ea580c"
                  }, transparent)`,
                  width: `${Math.random() * 200 + 100}px`,
                  height: `${Math.random() * 200 + 100}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 20 + 10}s infinite ${
                    Math.random() * 5
                  }s alternate ease-in-out`,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>

          <div
            className="absolute inset-0 opacity-100"
            style={{
              backgroundImage: `
      linear-gradient(to right, #fb923c0d 1px, transparent 1px),
      linear-gradient(to bottom, #fb923c0d 1px, transparent 1px)
    `,
              backgroundSize: "20px 20px",
              backgroundPosition: "center center",
            }}
          ></div>
        </div>
      </div>

      <style>{`
  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(10px, 15px) rotate(2deg); }
    50% { transform: translate(-5px, 20px) rotate(-2deg); }
    75% { transform: translate(15px, -10px) rotate(3deg); }
  }
`}</style>

      <div className="container mx-auto px-4   max-w-7xl">
        <div className="text-center mb-8">
          <div className="mb-6">
            <img
              src="https://samyuktgujaratisamaj.com/assets/logoss.png"
              alt="Samyukt Gujarati Samaj"
              className="h-20 mx-auto mb-4"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Samyukt Gujarati Samaj
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Membership Registration Form
          </p>
          <p className="text-sm text-gray-500">
            Call us at{" "}
            <a className="font-semibold text-orange-600 underline" href="tel:8867171060">8867171060</a> if
            you have any questions.
          </p>
        </div>

        {/*  Form */}
        <div className="bg-white/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="user_full_name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Full Name *
                  </Label>
                  <Input
                    id="user_full_name"
                    value={formData.user_full_name}
                    onChange={(e) =>
                      handleInputChange("user_full_name", e.target.value)
                    }
                    className={`mt-1 ${hasError("user_full_name")}`}
                  />
                  {errors.user_full_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.user_full_name}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="user_email"
                    className="text-sm font-semibold text-gray-700"
                  >
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address *
                  </Label>
                  <Input
                    id="user_email"
                    type="email"
                    value={formData.user_email}
                    onChange={(e) =>
                      handleInputChange("user_email", e.target.value)
                    }
                    className={`mt-1 ${hasError("user_email")}`}
                  />
                  {errors.user_email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.user_email}
                    </p>
                  )}
                </div>

                
              </div >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                  <Label
                    htmlFor="user_mobile"
                    className="text-sm font-semibold text-gray-700"
                  >
                    <Phone className="w-4 h-4 inline mr-1" />
                    Mobile Number *
                  </Label>
                  <Input
                    id="user_mobile"
                    value={formData.user_mobile}
                    onChange={(e) =>
                      handleInputChange("user_mobile", e.target.value)
                    }
                    onKeyDown={keydown}
                    minLength={1}
                    maxLength={10}
                    className={`mt-1 ${hasError("user_mobile")}`}
                  />
                  {errors.user_mobile && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.user_mobile}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="user_whatsapp"
                    className="text-sm font-semibold text-gray-700"
                  >
                    WhatsApp Number
                  </Label>
                  <Input
                    id="user_whatsapp"
                    value={formData.user_whatsapp}
                    onChange={(e) =>
                      handleInputChange("user_whatsapp", e.target.value)
                    }
                    onKeyDown={keydown}
                    minLength={1}
                    maxLength={10}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="user_dob"
                    className="text-sm font-semibold text-gray-700"
                  >
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date of Birth *
                  </Label>
                  <Input
                    id="user_dob"
                    type="date"
                    value={formData.user_dob}
                    onChange={(e) =>
                      handleInputChange("user_dob", e.target.value)
                    }
                    className={`mt-1 ${hasError("user_dob")}`}
                  />
                  {errors.user_dob && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.user_dob}
                    </p>
                  )}
                </div>
                  </div>
              <div>
                <Label
                  htmlFor="user_add"
                  className="text-sm font-semibold text-gray-700"
                >
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Address *
                </Label>
                <Textarea
                  id="user_add"
                  value={formData.user_add}
                  onChange={(e) =>
                    handleInputChange("user_add", e.target.value)
                  }
                  className={`mt-1 ${hasError("user_add")}`}
                  rows={3}
                />
                {errors.user_add && (
                  <p className="mt-1 text-sm text-red-600">{errors.user_add}</p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Spouse Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-pink-500" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Spouse Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label
                    htmlFor="user_spouse_name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Spouse Name
                  </Label>
                  <Input
                    id="user_spouse_name"
                    value={formData.user_spouse_name}
                    onChange={(e) =>
                      handleInputChange("user_spouse_name", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="user_spouse_mobile"
                    className="text-sm font-semibold text-gray-700"
                  >
                    <Phone className="w-4 h-4 inline mr-1" />
                    Spouse Mobile
                  </Label>
                  <Input
                    id="user_spouse_mobile"
                    value={formData.user_spouse_mobile}
                    onChange={(e) =>
                      handleInputChange("user_spouse_mobile", e.target.value)
                    }
                    onKeyDown={keydown}
                    minLength={1}
                    maxLength={10}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="user_spouse_dob"
                    className="text-sm font-semibold text-gray-700"
                  >
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Spouse Date of Birth
                  </Label>
                  <Input
                    id="user_spouse_dob"
                    type="date"
                    value={formData.user_spouse_dob}
                    onChange={(e) =>
                      handleInputChange("user_spouse_dob", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Membership Details Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Membership Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="user_type"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Membership Type *
                  </Label>
                  <Select
                    value={formData.user_type}
                    onValueChange={(value) =>
                      handleInputChange("user_type", value)
                    }
                  >
                    <SelectTrigger className={`mt-1 ${hasError("user_type")}`}>
                      <SelectValue placeholder="Select membership type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Trustee">Trustee</SelectItem>
                      <SelectItem value="Life Membership">
                        Life Membership
                      </SelectItem>
                      <SelectItem value="Couple Membership">
                        Couple Membership
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.user_type && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.user_type}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="user_cat"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Your Samaj *
                  </Label>
                  <Select
                    value={formData.user_cat}
                    onValueChange={(value) =>
                      handleInputChange("user_cat", value)
                    }
                  >
                    <SelectTrigger className={`mt-1 ${hasError("user_cat")}`}>
                      <SelectValue placeholder="Select your samaj" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dasha Shreemali Jain Murti Pujak Samaj">
                        Dasha Shreemali Jain Murti Pujak Samaj
                      </SelectItem>
                      <SelectItem value="Kankrej Pragati Samaj">
                        Kankrej Pragati Samaj
                      </SelectItem>
                      <SelectItem value="Shree Bangalore Brahmkshatriya Samaj (Regd)">
                        Shree Bangalore Brahmkshatriya Samaj (Regd){" "}
                      </SelectItem>
                      <SelectItem value="Shri Ahir Samaj Bangalore">
                        Shri Ahir Samaj Bangalore{" "}
                      </SelectItem>
                      <SelectItem value="halShri Bangalore Bhatia Samajhari">
                        {" "}
                        Shri Bangalore Bhatia Samaj
                      </SelectItem>
                      <SelectItem value="Shri Bangalore Ghoghari Visa Shreemali Jain Sangh">
                        {" "}
                        Shri Bangalore Ghoghari Visa Shreemali Jain Sangh
                      </SelectItem>
                      <SelectItem value="Shri Bangalore Gujarati Brahm Samaj">
                        Shri Bangalore Gujarati Brahm Samaj{" "}
                      </SelectItem>
                      <SelectItem value="Shri Bangalore Kadhayata Samaj">
                        Shri Bangalore Kadhayata Samaj{" "}
                      </SelectItem>
                      <SelectItem value="Shri Bangalore Kapol Samaj">
                        Shri Bangalore Kapol Samaj{" "}
                      </SelectItem>
                      <SelectItem value="Shri Bangalore Lohana Samaj">
                        {" "}
                        Shri Bangalore Lohana Samaj
                      </SelectItem>
                      <SelectItem value="Shri Bangalore Patidar Samaj (Peenya)">
                        Shri Bangalore Patidar Samaj (Peenya){" "}
                      </SelectItem>
                      <SelectItem value="Shri Bangalore Sagar Samaj">
                        Shri Bangalore Sagar Samaj{" "}
                      </SelectItem>
                      <SelectItem value="Shri Dasa Shrimali Jain Murthi poojak Samaj">
                        {" "}
                        Shri Dasa Shrimali Jain Murthi poojak Samaj
                      </SelectItem>
                      <SelectItem value="Shri Dasa Shrimali Vaishno Vanik Gyanti">
                        Shri Dasa Shrimali Vaishno Vanik Gyanti{" "}
                      </SelectItem>
                      <SelectItem value="Shri Dasa Sorathia Vanik Gyanti">
                        {" "}
                        Shri Dasa Sorathia Vanik Gyanti
                      </SelectItem>
                      <SelectItem value="Shri Devanahalli Patidar Samaj">
                        {" "}
                        Shri Devanahalli Patidar Samaj
                      </SelectItem>
                      <SelectItem value="Shri Gujrati Vardhaman Sthanakvashi Jain Sangha">
                        {" "}
                        Shri Gujrati Vardhaman Sthanakvashi Jain Sangha
                      </SelectItem>
                      <SelectItem value="Shri Gurjar Kashtriya Kadiya Samaj">
                        Shri Gurjar Kashtriya Kadiya Samaj{" "}
                      </SelectItem>
                      <SelectItem value="Shri Halari Visa Oswal Samaj">
                        {" "}
                        Shri Halari Visa Oswal Samaj
                      </SelectItem>
                      <SelectItem value="Shri Kadava Patidar Samaj (KR Puram)">
                        Shri Kadava Patidar Samaj (KR Puram){" "}
                      </SelectItem>
                      <SelectItem value="Shri Kadva Patidar Samaj (Doddabellapur)">
                        Shri Kadva Patidar Samaj (Doddabellapur){" "}
                      </SelectItem>
                      <SelectItem value="Shri Katch Kaduva Patidar Sanatan Samaj (Yelhanka)">
                        {" "}
                        Shri Katch Kaduva Patidar Sanatan Samaj (Yelhanka)
                      </SelectItem>
                      <SelectItem value="Shri Katchi Gurjar Jain Pariwar">
                        {" "}
                        Shri Katchi Gurjar Jain Pariwar
                      </SelectItem>
                      <SelectItem value="Shri Katchi Gurjar Jain Pariwar">
                        {" "}
                        Shri Katchi Gurjar Jain Pariwar
                      </SelectItem>
                      <SelectItem value="Shri Katchi Gurjar Jain Pariwar">
                        {" "}
                        Shri Katchi Gurjar Jain Pariwar
                      </SelectItem>
                      <SelectItem value="Shri Kutch Vaghad Leva Patidar Samaj">
                        Shri Kutch Vaghad Leva Patidar Samaj{" "}
                      </SelectItem>
                      <SelectItem value="Shri Kutchi Dasa Oswal Jain Gnati Mahajan Bangalore">
                        Shri Kutchi Dasa Oswal Jain Gnati Mahajan Bangalore{" "}
                      </SelectItem>
                      <SelectItem value="Shri Kutchi Visa Oswal Jain Samaj">
                        Shri Kutchi Visa Oswal Jain Samaj{" "}
                      </SelectItem>
                      <SelectItem value="Shri Lakshminarayan Patidar Samaj (Nalmangala)">
                        Shri Lakshminarayan Patidar Samaj (Nalmangala){" "}
                      </SelectItem>
                      <SelectItem value="Shri Lalbhag Patidar Samaj">
                        {" "}
                        Shri Lalbhag Patidar Samaj
                      </SelectItem>
                      <SelectItem value="Shri Matchhukantha Jain Mandal">
                        Shri Matchhukantha Jain Mandal{" "}
                      </SelectItem>
                      <SelectItem value="Shri Modh Bandhu Samaj">
                        Shri Modh Bandhu Samaj{" "}
                      </SelectItem>
                      <SelectItem value="Shri Patidar Parivar Samaj">
                        Shri Patidar Parivar Samaj{" "}
                      </SelectItem>
                      <SelectItem value="Shri Samast Leva Patel Samaj">
                        Shri Samast Leva Patel Samaj{" "}
                      </SelectItem>
                      <SelectItem value="Shri Satwara Samaj Bangalore">
                        Shri Satwara Samaj Bangalore{" "}
                      </SelectItem>
                      <SelectItem value="Shri Saurashtra Uma Parivar Bangalore">
                        Shri Saurashtra Uma Parivar Bangalore{" "}
                      </SelectItem>
                      <SelectItem value="Shri Shrimali Soni Samaj">
                        Shri Shrimali Soni Samaj{" "}
                      </SelectItem>
                      <SelectItem value="Shri Umiya Patidar Sanatan Samaj">
                        {" "}
                        Shri Umiya Patidar Sanatan Samaj
                      </SelectItem>
                      <SelectItem value="Shri Uttar Gujrati Patidar Samaj">
                        Shri Uttar Gujrati Patidar Samaj{" "}
                      </SelectItem>
                      <SelectItem value="Shri Vansh Suthar Samaj Bangalore">
                        Shri Vansh Suthar Samaj Bangalore{" "}
                      </SelectItem>
                      <SelectItem value="Shri Vansh Suthar Samaj Bangalore">
                        Shri Vansh Suthar Samaj Bangalore{" "}
                      </SelectItem>
                      <SelectItem value="Shri Vishwakarma Gujarati Samaj">
                        {" "}
                        Shri Vishwakarma Gujarati Samaj
                      </SelectItem>
                      <SelectItem value="Sri Umiya Patidar Samaj (Indiranagar)">
                        {" "}
                        Sri Umiya Patidar Samaj (Indiranagar)
                      </SelectItem>
                      <SelectItem value="Others"> Others</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.user_cat && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.user_cat}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Photo Upload Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-5 h-5 text-green-500" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Photo Upload
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PhotoUpload
                  label="Member Photo *"
                  value={formData.user_image}
                  onChange={(value) => handleInputChange("user_image", value)}
                  placeholder="Upload your photo for membership card"
                  hasError={!!errors.user_image}
                />

                <PhotoUpload
                  label="Spouse Photo (Only Couple Membership)"
                  value={formData.spouse_image}
                  onChange={(value) => handleInputChange("spouse_image", value)}
                  placeholder="Upload spouse photo (optional)"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MembershipForm;
