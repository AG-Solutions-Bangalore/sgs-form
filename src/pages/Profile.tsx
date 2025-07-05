
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, Heart, Phone, Mail, MapPin, Calendar, 
  User, ArrowLeft, CheckCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileData {
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
  spouse_imagess: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('membershipData');
    if (savedData) {
      setProfileData(JSON.parse(savedData));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

 

  return (
    <div className="min-h-screen relative  py-8">

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
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <img
              src="https://samyuktgujaratisamaj.com/assets/logoss.png"
              alt="Samyukt Gujarati Samaj"
              className="h-20 mx-auto mb-4"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            
            <h1 className="text-3xl font-bold text-gray-800">
              Membership Application Submitted
            </h1>
          </div>
       
          
          
        </div>

        {/* Success Message */}
        <Card className="shadow-lg border-0 bg-green-50 mb-8">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              Application Submitted Successfully!
            </h2>
            <p className="text-green-700">
              Your membership application has been received. You will be contacted soon for further processing.
            </p>
            <p className="text-sm text-green-600 mt-2">
              For any queries, call us at <a className="font-semibold underline" href="tel:8867171060">8867171060</a>
            </p>
          </CardContent>
        </Card>

       

      
      </div>
    </div>
  );
};

export default Profile;
