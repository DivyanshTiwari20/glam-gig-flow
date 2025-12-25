import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookingModal from '@/components/app/BookingModal';
import { RazorpayPaymentDialog } from '@/components/payment/RazorpayPaymentDialog';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  bio: string | null;
  city: string | null;
  category: string | null;
  services: string | null;
  price_range: string | null;
  portfolio_images: string[] | null;
  available_days: string[] | null;
  email: string | null;
  social_accounts: any | null;
  expected_payment_amount: number | null;
}

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      
      try {
        const { data, error } = await supabase.rpc('get_public_profile_safe', { profile_id: userId });

        if (error) throw error;
        if (!data || data.length === 0) {
          setProfile(null);
          return;
        }
        
        const profileData = data[0];
        setProfile({
          ...profileData,
          social_accounts: profileData.social_accounts ? (typeof profileData.social_accounts === 'string' ? JSON.parse(profileData.social_accounts) : profileData.social_accounts) : null,
          email: null
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground">This profile doesn't exist or is not available.</p>
        </Card>
      </div>
    );
  }

  const portfolioImages = profile.portfolio_images || [];
  const availableDays = profile.available_days || [];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        {/* Header Section */}
        <div className="relative border-b">
          {profile.banner_url ? (
            <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden">
              <img src={profile.banner_url} alt="Banner" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            </div>
          ) : (
            <div className="h-48 md:h-56 lg:h-64 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
          )}
          
          <div className="container mx-auto px-4 relative">
            <div className="relative -mt-16 md:-mt-20 mb-4">
              <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-background shadow-xl">
                <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || 'User'} />
                <AvatarFallback className="text-3xl md:text-4xl">{profile.full_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </div>
            <div className="pb-6">
              <h1 className="text-3xl lg:text-4xl mb-2">{profile.full_name || 'Anonymous User'}</h1>
              {profile.bio && <p className="text-md text-muted-foreground mb-6 max-w-2xl">{profile.bio}</p>}
              <div className="flex flex-wrap gap-3 mb-4">
                <Button size="lg" onClick={() => setIsModalOpen(true)}><Mail className="w-4 h-4 mr-2" />Book Me</Button>
                <Button size="lg" variant="secondary" onClick={() => setIsPaymentOpen(true)}>Pay Now</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {portfolioImages.length > 0 && (
                <Card className="border-2 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-8">
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                      {portfolioImages.map((image, index) => (
                        <div key={index} className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300" onClick={() => setSelectedImage(image)}>
                          <img src={image} alt={`Portfolio ${index + 1}`} className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-4 left-4 text-white"><p className="text-sm font-semibold">View Full Image</p></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="space-y-6">
              {availableDays.length > 0 && (
                <Card><CardContent className="p-6 shadow-md bg-white/80 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold mb-4 flex items-center"><Calendar className="w-5 h-5 mr-2" />Available Days</h3>
                  <div className="space-y-2">{availableDays.map((day, i) => (<Badge key={i} variant="outline" className="mr-2 mb-2">{day}</Badge>))}</div>
                </CardContent></Card>
              )}
              <Card><CardContent className="p-6 shadow-md bg-white/80 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4">Quick Info</h3>
                <div className="space-y-3">
                  {profile.category && <div><span className="text-sm font-medium text-muted-foreground">Category</span><p className="text-sm">{profile.category}</p></div>}
                  {profile.city && <><Separator /><div><span className="text-sm font-medium text-muted-foreground">Location</span><p className="text-sm">{profile.city}</p></div></>}
                  {profile.price_range && <><Separator /><div><span className="text-sm font-medium text-muted-foreground">Price Range</span><p className="text-sm">{profile.price_range}</p></div></>}
                </div>
              </CardContent></Card>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-6xl w-full">
            <button className="absolute -top-12 right-0 text-white text-4xl hover:text-pink-400 transition-colors" onClick={() => setSelectedImage(null)}>×</button>
            <img src={selectedImage} alt="Portfolio" className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl" />
          </div>
        </div>
      )}

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} profile={profile} />
      <RazorpayPaymentDialog isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} providerId={userId || ''} providerName={profile.full_name || 'Provider'} expectedAmount={profile.expected_payment_amount || 0} />
    </>
  );
};

export default PublicProfile;
