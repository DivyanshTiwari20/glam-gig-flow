import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Star, ExternalLink, Mail, Instagram, Twitter, Facebook, Linkedin, Youtube } from 'lucide-react';
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
  profile_template: string | null;
}

// Classic Template
const ClassicTemplate = ({ profile, onBook, onPay, setSelectedImage }: { profile: Profile; onBook: () => void; onPay: () => void; setSelectedImage: (img: string) => void }) => {
  const portfolioImages = profile.portfolio_images || [];
  const availableDays = profile.available_days || [];

  return (
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
              <Button size="lg" onClick={onBook}><Mail className="w-4 h-4 mr-2" />Book Me</Button>
              <Button size="lg" variant="secondary" onClick={onPay}>Pay Now</Button>
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
  );
};

// Modern Card Template
const ModernTemplate = ({ profile, onBook, onPay, setSelectedImage }: { profile: Profile; onBook: () => void; onPay: () => void; setSelectedImage: (img: string) => void }) => {
  const portfolioImages = profile.portfolio_images || [];
  const availableDays = profile.available_days || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Main Card */}
        <Card className="overflow-hidden shadow-2xl border-0">
          <CardContent className="p-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="w-28 h-28 border-4 border-white shadow-xl rounded-2xl">
                  <AvatarImage src={profile.avatar_url || ''} className="rounded-2xl" />
                  <AvatarFallback className="text-3xl rounded-2xl">{profile.full_name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2">{profile.full_name || 'Anonymous User'}</h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                    {profile.category && <Badge variant="secondary">{profile.category}</Badge>}
                    {profile.city && <Badge variant="outline" className="flex items-center gap-1"><MapPin className="w-3 h-3" />{profile.city}</Badge>}
                    {profile.price_range && <Badge variant="outline">{profile.price_range}</Badge>}
                  </div>
                  {profile.bio && <p className="text-muted-foreground mb-4 max-w-xl">{profile.bio}</p>}
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <Button size="lg" onClick={onBook}><Mail className="w-4 h-4 mr-2" />Book Me</Button>
                    <Button size="lg" variant="outline" onClick={onPay}>Pay Now</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {availableDays.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">Available</h3>
                  <div className="flex flex-wrap gap-2">{availableDays.map((day, i) => (<Badge key={i}>{day}</Badge>))}</div>
                </div>
              )}
              
              {portfolioImages.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Portfolio</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {portfolioImages.map((img, i) => (
                      <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all" onClick={() => setSelectedImage(img)}>
                        <img src={img} alt={`Work ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Minimal Elegant Template
const MinimalTemplate = ({ profile, onBook, onPay, setSelectedImage }: { profile: Profile; onBook: () => void; onPay: () => void; setSelectedImage: (img: string) => void }) => {
  const portfolioImages = profile.portfolio_images || [];
  const availableDays = profile.available_days || [];
  const socialAccounts = profile.social_accounts || {};

  const socialIcons: { [key: string]: any } = { instagram: Instagram, twitter: Twitter, facebook: Facebook, linkedin: Linkedin, youtube: Youtube };

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Centered Header */}
        <div className="text-center mb-12">
          <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-primary/20">
            <AvatarImage src={profile.avatar_url || ''} />
            <AvatarFallback className="text-4xl">{profile.full_name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <h1 className="text-4xl font-bold mb-3">{profile.full_name || 'Anonymous User'}</h1>
          <p className="text-lg text-muted-foreground mb-2">{profile.category || 'Beauty Professional'}</p>
          {profile.city && <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><MapPin className="w-4 h-4" />{profile.city}</p>}
          
          {/* Social Links */}
          <div className="flex justify-center gap-4 mt-6 mb-8">
            {Object.entries(socialAccounts).filter(([_, v]) => v).map(([key, _]) => {
              const Icon = socialIcons[key];
              return Icon ? <div key={key} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer"><Icon className="w-5 h-5" /></div> : null;
            })}
          </div>

          {profile.bio && <p className="text-muted-foreground max-w-xl mx-auto mb-8">{profile.bio}</p>}
          
          <div className="flex justify-center gap-4 mb-8">
            <Button size="lg" onClick={onBook}>Book Me</Button>
            <Button size="lg" variant="outline" onClick={onPay}>Pay Now</Button>
          </div>

          {availableDays.length > 0 && (
            <div className="flex justify-center flex-wrap gap-2 mb-8">
              {availableDays.map((day, i) => (<Badge key={i} variant="secondary">{day}</Badge>))}
            </div>
          )}

          {profile.price_range && <Badge variant="outline" className="mb-8">{profile.price_range}</Badge>}
        </div>

        {/* Portfolio Grid */}
        {portfolioImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {portfolioImages.map((img, i) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden cursor-pointer group" onClick={() => setSelectedImage(img)}>
                <img src={img} alt={`Portfolio ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

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
          email: null,
          profile_template: profileData.profile_template || 'classic'
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

  const templateProps = {
    profile,
    onBook: () => setIsModalOpen(true),
    onPay: () => setIsPaymentOpen(true),
    setSelectedImage
  };

  const renderTemplate = () => {
    switch (profile.profile_template) {
      case 'modern': return <ModernTemplate {...templateProps} />;
      case 'minimal': return <MinimalTemplate {...templateProps} />;
      case 'classic':
      default: return <ClassicTemplate {...templateProps} />;
    }
  };

  return (
    <>
      {renderTemplate()}

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
