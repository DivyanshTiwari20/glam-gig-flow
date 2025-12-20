import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, X, User, Instagram, Twitter, Facebook, Linkedin, Youtube, Plus } from "lucide-react";

// Image Crop Dialog Component
function ImageCropDialog({ 
  imageSrc, 
  onCropComplete, 
  onClose, 
  aspect 
}: { 
  imageSrc: string | null; 
  onCropComplete: (croppedImage: string) => void; 
  onClose: () => void; 
  aspect: number;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useState<HTMLDivElement | null>(null);

  if (!imageSrc) return null;

  const calculateCropBox = () => {
    if (!imageDimensions.width || !imageDimensions.height) return { width: 0, height: 0 };
    
    const containerWidth = 600; // max width
    const containerHeight = 400; // max height
    
    let cropWidth, cropHeight;
    
    if (aspect === 1) {
      // Square crop (1:1)
      const size = Math.min(containerWidth, containerHeight, imageDimensions.width, imageDimensions.height);
      cropWidth = size * 0.8;
      cropHeight = size * 0.8;
    } else {
      // Banner crop (16:9)
      cropWidth = Math.min(containerWidth * 0.8, imageDimensions.width);
      cropHeight = cropWidth / aspect;
      
      if (cropHeight > containerHeight * 0.8) {
        cropHeight = containerHeight * 0.8;
        cropWidth = cropHeight * aspect;
      }
    }
    
    return { width: cropWidth, height: cropHeight };
  };

  const cropBox = calculateCropBox();

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    
    // Set initial crop area
    const cropWidth = aspect === 1 ? img.naturalWidth * 0.6 : img.naturalWidth * 0.8;
    const cropHeight = cropWidth / aspect;
    
    setCroppedAreaPixels({
      x: (img.naturalWidth - cropWidth) / 2,
      y: (img.naturalHeight - cropHeight) / 2,
      width: cropWidth,
      height: cropHeight
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startCropX = crop.x;
    const startCropY = crop.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      setCrop({
        x: startCropX + deltaX,
        y: startCropY + deltaY
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    // Set canvas size to match crop area
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return canvas.toDataURL('image/jpeg', 0.95);
  };

  const handleCrop = async () => {
    try {
      if (!croppedAreaPixels) return;
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  const getRatioText = () => {
    if (aspect === 1) return "1:1 (Square)";
    if (aspect === 16/9) return "16:9 (Banner)";
    return `${aspect}:1`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Crop Image</h2>
            <p className="text-sm text-muted-foreground">Adjust to {getRatioText()} ratio</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="relative flex-1 bg-black/50 flex items-center justify-center overflow-hidden" style={{ minHeight: '400px' }}>
          <div className="relative" style={{ maxWidth: '100%', maxHeight: '100%' }}>
            <img 
              src={imageSrc} 
              alt="Crop preview" 
              className="max-w-full max-h-[500px] object-contain"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'center',
                transition: 'transform 0.1s'
              }}
              onLoad={onImageLoad}
            />
            
            {/* Crop overlay */}
            {cropBox.width > 0 && (
              <div 
                className="absolute border-2 border-white shadow-lg cursor-move"
                style={{
                  width: `${cropBox.width}px`,
                  height: `${cropBox.height}px`,
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translate(${crop.x}px, ${crop.y}px)`,
                  boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)'
                }}
                onMouseDown={handleMouseDown}
              >
                {/* Grid lines */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="border border-white/30" />
                  ))}
                </div>
                
                {/* Corner handles */}
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-white border border-black" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white border border-black" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border border-black" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border border-black" />
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 space-y-4 border-t">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm">Zoom</Label>
              <span className="text-sm text-muted-foreground">{zoom.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleCrop} disabled={!croppedAreaPixels}>
              Crop & Upload
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  category: string | null;
  services: string | null;
  price_range: string | null;
  bio: string | null;
  portfolio_images: string[] | null;
  available_days: string[] | null;
  avatar_url: string | null;
  banner_url: string | null;
  email: string | null;
  social_accounts: { [key: string]: string } | null;
  expected_payment_amount: number | null;
};

type CropConfig = {
  aspect: number;
  isAvatar: boolean;
  isBanner: boolean;
  isPortfolio: boolean;
};

const socialPlatforms = [
  { name: 'Instagram', icon: Instagram, placeholder: '@username', key: 'instagram' },
  { name: 'Twitter', icon: Twitter, placeholder: '@handle', key: 'twitter' },
  { name: 'Facebook', icon: Facebook, placeholder: 'facebook.com/profile', key: 'facebook' },
  { name: 'LinkedIn', icon: Linkedin, placeholder: 'linkedin.com/in/profile', key: 'linkedin' },
  { name: 'YouTube', icon: Youtube, placeholder: 'youtube.com/channel', key: 'youtube' },
];

const categories = [
  'Makeup',
  'Hair Styling',
  'Bridal Makeup',
  'Nail Art',
  'Skincare',
  'Massage Therapy',
  'Waxing & Hair Removal',
  'Eyelash Extensions',
  'Brow Shaping',
  'Spa Treatments',
  'Beauty Consulting',
  'Other'
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState<Partial<Profile>>({
    social_accounts: {}
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [customPrice, setCustomPrice] = useState("");
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [cropConfig, setCropConfig] = useState<CropConfig | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to view your profile.",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        const profileData = {
          ...data,
          social_accounts: data.social_accounts || {}
        };
        setProfile({
          ...profileData,
          banner_url: profileData.banner_url || null
        } as Profile);
        setFormData({
          ...profileData,
          banner_url: profileData.banner_url || null
        });
      } else if (error && error.code === 'PGRST116') {
        const defaultProfile = {
          id: user.id,
          email: user.email,
          social_accounts: {}
        };
        setFormData(defaultProfile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Profile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      social_accounts: {
        ...prev.social_accounts,
        [platform]: value
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to save your profile.",
          variant: "destructive"
        });
        return;
      }

      const updates = { 
        ...formData, 
        id: user.id,
        social_accounts: formData.social_accounts || {},
        price_range: formData.price_range === "Custom" ? customPrice : formData.price_range
      };
      
      const { error } = await supabase.from("profiles").upsert(updates as any);
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      setProfile(formData as Profile);
      toast({
        title: "Success!",
        description: "Your profile has been updated successfully."
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: `Failed to save profile changes: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, isAvatar: boolean, isBanner: boolean = false) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset the input value so the same file can be selected again
    event.target.value = '';

    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result as string);
      setSelectedFile(file);
      setCropConfig({
        aspect: isAvatar ? 1 : isBanner ? 16/9 : 1,
        isAvatar,
        isBanner,
        isPortfolio: !isAvatar && !isBanner
      });
    };
    reader.readAsDataURL(file);
  };

  const dataURLtoBlob = (dataURL: string): Blob => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleCropComplete = async (croppedImageUrl: string) => {
    if (!cropConfig || !selectedFile) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to upload images.",
          variant: "destructive"
        });
        setUploading(false);
        return;
      }

      const blob = dataURLtoBlob(croppedImageUrl);
      const fileExt = selectedFile.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      let bucket: string;
      if (cropConfig.isAvatar) {
        bucket = "avatars";
      } else if (cropConfig.isBanner) {
        bucket = "banners";
      } else {
        bucket = "portfolio";
      }

      const { data, error } = await supabase.storage.from(bucket).upload(filePath, blob, {
        contentType: 'image/jpeg',
        upsert: false
      });
      
      if (error) {
        if (error.message.includes('Bucket not found') && cropConfig.isBanner) {
          console.warn('Banners bucket not found, using portfolio bucket instead');
          const { data: fallbackData, error: fallbackError } = await supabase.storage
            .from('portfolio')
            .upload(filePath, blob, {
              contentType: 'image/jpeg',
              upsert: false
            });
          if (fallbackError) throw fallbackError;
          const url = supabase.storage.from('portfolio').getPublicUrl(filePath).data.publicUrl;
          handleInputChange("banner_url", url);
          toast({
            title: "Success!",
            description: "Banner uploaded successfully."
          });
          setUploading(false);
          return;
        }
        throw error;
      }

      if (data) {
        const url = supabase.storage.from(bucket).getPublicUrl(filePath).data.publicUrl;
        
        if (cropConfig.isAvatar) {
          handleInputChange("avatar_url", url);
          toast({
            title: "Success!",
            description: "Avatar uploaded successfully."
          });
        } else if (cropConfig.isBanner) {
          handleInputChange("banner_url", url);
          toast({
            title: "Success!",
            description: "Banner uploaded successfully."
          });
        } else {
          const currentImages = formData.portfolio_images || [];
          if (currentImages.length >= 10) {
            toast({
              title: "Upload limit reached",
              description: "You can only upload up to 10 portfolio images.",
              variant: "destructive"
            });
            setUploading(false);
            return;
          }
          handleInputChange("portfolio_images", [...currentImages, url]);
          toast({
            title: "Success!",
            description: "Portfolio image uploaded successfully."
          });
        }
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error?.message || "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setImageToCrop(null);
      setCropConfig(null);
      setSelectedFile(null);
    }
  };

  const removePortfolioImage = (indexToRemove: number) => {
    const updatedImages = formData.portfolio_images?.filter((_, index) => index !== indexToRemove) || [];
    handleInputChange("portfolio_images", updatedImages);
  };

  const toggleAvailableDay = (day: string) => {
    const currentDays = formData.available_days || [];
    const updatedDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    handleInputChange("available_days", updatedDays);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ImageCropDialog
        imageSrc={imageToCrop}
        onCropComplete={handleCropComplete}
        onClose={() => {
          setImageToCrop(null);
          setCropConfig(null);
        }}
        aspect={cropConfig?.aspect || 1}
      />

      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="grid gap-6 lg:gap-8">
            {/* Avatar and Basic Info */}
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10"></div>
              <CardContent className="relative p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center gap-4">
                    <div 
                      className="relative group cursor-pointer"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                    >
                      <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-lg">
                        <AvatarImage src={formData.avatar_url || ""} />
                        <AvatarFallback className="text-xl md:text-2xl">
                          <User className="w-8 h-8 md:w-12 md:h-12" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e, true, false)}
                      disabled={uploading}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <Label
                      htmlFor="avatar-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                    >
                      <Upload className="w-4 h-4" />
                      {uploading ? "Uploading..." : "Change Avatar"}
                    </Label>
                  </div>

                  {/* Basic Info */}
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name || ""}
                          placeholder="Your full name"
                          onChange={(e) => handleInputChange("full_name", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone || ""}
                          placeholder="Your phone number"
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.city || ""}
                          placeholder="Your city"
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category || ""}
                          onValueChange={(val) => handleInputChange("category", val)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Banner Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    Banner Image
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Upload a banner image that will be displayed at the top of your public profile
                  </p>
                  
                  {formData.banner_url ? (
                    <div 
                      className="relative group cursor-pointer"
                      onClick={() => document.getElementById('banner-upload')?.click()}
                    >
                      <div className="w-full h-48 md:h-64 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={formData.banner_url}
                          alt="Profile banner"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-white text-center">
                          <Camera className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">Click to change banner</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => document.getElementById('banner-upload')?.click()}
                    >
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-2">No banner image uploaded</p>
                      <p className="text-sm text-muted-foreground">Click to upload a banner (16:9 ratio)</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e, false, true)}
                      disabled={uploading}
                      className="hidden"
                      id="banner-upload"
                    />
                    <Label
                      htmlFor="banner-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm flex-1 justify-center"
                    >
                      <Upload className="w-4 h-4" />
                      {uploading ? "Uploading..." : formData.banner_url ? "Change Banner" : "Upload Banner"}
                    </Label>
                    {formData.banner_url && (
                      <Button
                        variant="outline"
                        onClick={() => handleInputChange("banner_url", null)}
                        disabled={uploading}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services and Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    Services & Pricing
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="services">Services Offered</Label>
                  <Textarea
                    id="services"
                    value={formData.services || ""}
                    placeholder="Describe the services you offer (e.g., Bridal makeup, Photography sessions, Event planning...)"
                    onChange={(e) => handleInputChange("services", e.target.value)}
                    className="mt-1 min-h-[80px]"
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio || ""}
                    placeholder="Tell clients about yourself, your experience, and what makes you unique..."
                    maxLength={500}
                    onChange={(e) => handleInputChange("bio", e.target.value.slice(0, 500))}
                    className="mt-1 min-h-[120px]"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {(formData.bio || "").length}/500 characters
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    Social Media
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {socialPlatforms.map((platform) => {
                    const IconComponent = platform.icon;
                    return (
                      <div key={platform.key}>
                        <Label htmlFor={platform.key} className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          {platform.name}
                        </Label>
                        <Input
                          id={platform.key}
                          value={formData.social_accounts?.[platform.key] || ""}
                          placeholder={platform.placeholder}
                          onChange={(e) => handleSocialChange(platform.key, e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="px-3 py-1">
                      Portfolio
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ({(formData.portfolio_images || []).length}/10)
                    </span>
                  </div>
                  {(formData.portfolio_images || []).length < 10 && (
                    <>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e, false, false)}
                        disabled={uploading}
                        className="hidden"
                        id="portfolio-upload"
                      />
                      <Label
                        htmlFor="portfolio-upload"
                        className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add Image
                      </Label>
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(formData.portfolio_images || []).length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No portfolio images yet</p>
                    <p className="text-sm">Add up to 10 images to showcase your work</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.portfolio_images?.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                          <img
                            src={url}
                            alt={`Portfolio ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePortfolioImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    Availability
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label>Available Days</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {daysOfWeek.map((day) => (
                      <Button
                        key={day}
                        type="button"
                        variant={(formData.available_days || []).includes(day) ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => toggleAvailableDay(day)}
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFormData(profile ? { ...profile, social_accounts: profile.social_accounts || {} } : { social_accounts: {} });
                  setCustomPrice("");
                }}
                disabled={loading}
              >
                Reset Changes
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading || uploading}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                {loading ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}