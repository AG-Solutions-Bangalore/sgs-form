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
  User,
  PhoneCall,
  Building,
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

const DateDropdowns = ({
  id,
  label,
  value,
  onChange,
  error,
  required,
  icon: Icon,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  icon: any;
}) => {
  const [year, month, day] = value ? value.split("-") : ["", "", ""];

  const handleUpdate = (part: "year" | "month" | "day", partValue: string) => {
    let y = year;
    let m = month;
    let d = day;

    if (part === "year") y = partValue;
    if (part === "month") m = partValue;
    if (part === "day") d = partValue;

    // Use placeholder values to avoid broken strings if only one part is selected
    // but the final string should ideally be YYYY-MM-DD
    onChange(`${y || ""}-${m || ""}-${d || ""}`);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) =>
    (currentYear - i).toString(),
  );
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
  const days = Array.from({ length: 31 }, (_, i) =>
    (i + 1).toString().padStart(2, "0"),
  );

  return (
    <div className="space-y-1">
      <Label
        htmlFor={id}
        className="text-sm font-semibold text-gray-700 flex items-center"
      >
        <Icon className="w-4 h-4 inline mr-1" />
        {label} {required && <span className="text-red-600 ml-1"> *</span>}
      </Label>
      {/* Date Dropdowns Row */}
      <div className="grid grid-cols-3 gap-2 mt-1">
        <Select
          value={day || undefined}
          onValueChange={(v) => handleUpdate("day", v)}
        >
          <SelectTrigger className={error ? "border-red-500" : ""}>
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            {days.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={month || undefined}
          onValueChange={(v) => handleUpdate("month", v)}
        >
          <SelectTrigger className={error ? "border-red-500" : ""}>
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={year || undefined}
          onValueChange={(v) => handleUpdate("year", v)}
        >
          <SelectTrigger className={error ? "border-red-500" : ""}>
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

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
    user_type: "Life Membership",
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

    if (
      !formData.user_dob ||
      formData.user_dob.split("-").some((part) => !part)
    ) {
      newErrors.user_dob = "Complete date of birth is required";
    }

    if (!formData.user_add.trim()) {
      newErrors.user_add = "Address is required";
    }

    if (formData.user_spouse_dob) {
      const spouseDobParts = formData.user_spouse_dob.split("-");
      if (
        spouseDobParts.some((part) => part) &&
        spouseDobParts.some((part) => !part)
      ) {
        newErrors.user_spouse_dob = "Please complete the spouse date of birth";
      }
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
        },
      );
      if (response.data.code == 201) {
        localStorage.setItem("membershipData", JSON.stringify(formData));

        toast({
          title: "Success!",
          description:
            response.data.message ||
            "Your membership application has been submitted successfully.",
        });
        navigate("/profile");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response.data.message ||
          "Failed to submit form. Please try again.",
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

  const samajOptions = [
    "Dasha Shreemali Jain Murti Pujak Samaj",
    "Kankrej Pragati Samaj",
    "Shree Bangalore Brahmkshatriya Samaj (Regd)",
    "Shri Ahir Samaj Bangalore",
    "Shri Bangalore Bhatia Samaj",
    "Shri Bangalore Ghoghari Visa Shreemali Jain Sangh",
    "Shri Bangalore Gujarati Brahm Samaj",
    "Shri Bangalore Kadhayata Samaj",
    "Shri Bangalore Kapol Samaj",
    "Shri Bangalore Lohana Samaj",
    "Shri Bangalore Patidar Samaj (Peenya)",
    "Shri Bangalore Sagar Samaj",
    "Shri Dasa Shrimali Jain Murthi Poojak Samaj",
    "Shri Dasa Shrimali Vaishno Vanik Gyanti",
    "Shri Dasa Sorathia Vanik Gyanti",
    "Shri Devanahalli Patidar Samaj",
    "Shri Gujrati Vardhaman Sthanakvashi Jain Sangha",
    "Shri Gurjar Kashtriya Kadiya Samaj",
    "Shri Halari Visa Oswal Samaj",
    "Shri Kadava Patidar Samaj (KR Puram)",
    "Shri Kadva Patidar Samaj (Doddabellapur)",
    "Shri Katch Kaduva Patidar Sanatan Samaj (Yelhanka)",
    "Shri Katchi Gurjar Jain Pariwar",
    "Shri Kutch Vaghad Leva Patidar Samaj",
    "Shri Kutchi Dasa Oswal Jain Gnati Mahajan Bangalore",
    "Shri Kutchi Visa Oswal Jain Samaj",
    "Shri Lakshminarayan Patidar Samaj (Nalmangala)",
    "Shri Lalbhag Patidar Samaj",
    "Shri Matchhukantha Jain Mandal",
    "Shri Modh Bandhu Samaj",
    "Shri Patidar Parivar Samaj",
    "Shri Samast Leva Patel Samaj",
    "Shri Satwara Samaj Bangalore",
    "Shri Saurashtra Uma Parivar Bangalore",
    "Shri Shrimali Soni Samaj",
    "Shri Umiya Patidar Sanatan Samaj",
    "Shri Uttar Gujrati Patidar Samaj",
    "Shri Vansh Suthar Samaj Bangalore",
    "Shri Vishwakarma Gujarati Samaj",
    "Sri Umiya Patidar Samaj (Indiranagar)",
    "Others",
  ];

  return (
    <div className="min-h-screen relative pb-10 pt-8 md:pt-0 flex items-center">
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

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row text-center justify-evenly gap-5 md:gap-10 mb-5 md:mb-8 p-2">
          <div>
            <img
              src="/logo.png"
              alt="Samyukt Gujarati Samaj"
              className="h-18 mx-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-800 mb-2">
              Membership Form
            </p>
            <p className="text-sm text-gray-600">
              Call us at{" "}
              <a
                className="font-semibold text-orange-600 underline"
                href="tel:8867171060"
              >
                8867171060
              </a>{" "}
              if you have any questions.
            </p>
          </div>
        </div>

        {/*  Form */}
        <div className="bg-white/50 rounded-2xl p-6 pt-8 shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label
                  htmlFor="user_full_name"
                  className="text-sm font-semibold text-gray-700 flex items-center"
                >
                  <User className="w-4 h-4 inline mr-1" />
                  Full Name <span className="text-red-600 ml-1"> *</span>
                </Label>
                <Input
                  id="user_full_name"
                  placeholder="Enter your full name"
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
                  className="text-sm font-semibold text-gray-700 flex items-center"
                >
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Id <span className="text-red-600 ml-1"> *</span>
                </Label>
                <Input
                  id="user_email"
                  type="email"
                  placeholder="Enter email id"
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

              <div>
                <Label
                  htmlFor="user_mobile"
                  className="text-sm font-semibold text-gray-700 flex items-center"
                >
                  <Phone className="w-4 h-4 inline mr-1" />
                  Mobile No <span className="text-red-600 ml-1"> *</span>
                </Label>
                <Input
                  id="user_mobile"
                  placeholder="Enter mobile no"
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
                  className="text-sm font-semibold text-gray-700 flex items-center"
                >
                  <Phone className="w-4 h-4 inline mr-1" />
                  WhatsApp No
                </Label>
                <Input
                  id="user_whatsapp"
                  placeholder="Enter whatsapp no"
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="col-span-1">
                <DateDropdowns
                  id="user_dob"
                  label="Date of Birth"
                  value={formData.user_dob}
                  onChange={(val) => handleInputChange("user_dob", val)}
                  error={errors.user_dob}
                  required
                  icon={Calendar}
                />
              </div>
              <div className="md:col-span-3">
                <Label
                  htmlFor="user_add"
                  className="text-sm font-semibold text-gray-700 flex items-center"
                >
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Address <span className="text-red-600 ml-1"> *</span>
                </Label>
                <Textarea
                  id="user_add"
                  placeholder="Enter your complete address"
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

            {/* Membership Details Section */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label
                    htmlFor="user_type"
                    className="text-sm font-semibold text-gray-700 flex items-center"
                  >
                    <User className="w-4 h-4 inline mr-1" />
                    Membership Type
                    <span className="text-red-600 ml-1"> *</span>
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
                    className="text-sm font-semibold text-gray-700 flex items-center"
                  >
                    <Building className="w-4 h-4 inline mr-1" />
                    Your Samaj <span className="text-red-600 ml-1"> *</span>
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
                      {samajOptions.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.user_cat && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.user_cat}
                    </p>
                  )}
                </div>

                <div>
                  <PhotoUpload
                    label="Member Photo *"
                    value={formData.user_image}
                    onChange={(value) => handleInputChange("user_image", value)}
                    hasError={!!errors.user_image}
                  />
                </div>
              </div>
            </div>

            {formData.user_type == "Couple Membership" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label
                      htmlFor="user_spouse_name"
                      className="text-sm font-semibold text-gray-700 flex items-center"
                    >
                      <User className="w-4 h-4 inline mr-1" />
                      Spouse Name
                    </Label>
                    <Input
                      id="user_spouse_name"
                      placeholder="Enter spouse name"
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
                      className="text-sm font-semibold text-gray-700 flex items-center"
                    >
                      <Phone className="w-4 h-4 inline mr-1" />
                      Spouse Mobile
                    </Label>
                    <Input
                      id="user_spouse_mobile"
                      placeholder="Enter spouse mobile no"
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
                    <DateDropdowns
                      id="user_spouse_dob"
                      label="Spouse Date of Birth"
                      value={formData.user_spouse_dob}
                      onChange={(val) =>
                        handleInputChange("user_spouse_dob", val)
                      }
                      error={errors.user_spouse_dob}
                      icon={Calendar}
                    />
                  </div>
                  {formData.user_type == "Couple Membership" && (
                    <PhotoUpload
                      label="Spouse Photo"
                      value={formData.spouse_image}
                      onChange={(value) =>
                        handleInputChange("spouse_image", value)
                      }
                    />
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center pt-5">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MembershipForm;
