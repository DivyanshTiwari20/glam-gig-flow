import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, X, User, Instagram, Twitter, Facebook, Linkedin, Youtube, Plus, Eye, Check, Layout, Palette, Image, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Template Preview Components with Real Data
const ClassicTemplate = ({ profile }: { profile: any }) => (
  <div className="h-full w-full bg-gradient-to-br from-background to-muted overflow-hidden">
    <div className="h-12 bg-primary/20 relative">
      {profile.banner_url && <img src={profile.banner_url} className="w-full h-full object-cover opacity-60" />}
    </div>
    <div className="px-3 -mt-4">
      <div className="flex gap-2 mb-2">
        <div className="w-10 h-10 rounded-full bg-primary/30 border-2 border-background overflow-hidden">
          {profile.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <User className="w-full h-full p-2 text-primary" />}
        </div>
        <div className="flex-1 pt-4">
          <p className="text-xs font-semibold truncate">{profile.full_name || "Your Name"}</p>
          <p className="text-[10px] text-muted-foreground truncate">{profile.category || "Category"}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {(profile.portfolio_images || []).slice(0, 6).map((img: string, i: number) => (
          <div key={i} className="aspect-square bg-primary/10 rounded overflow-hidden">
            <img src={img} className="w-full h-full object-cover" />
          </div>
        ))}
        {[...Array(Math.max(0, 6 - (profile.portfolio_images?.length || 0)))].map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square bg-primary/10 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);

const ModernTemplate = ({ profile }: { profile: any }) => (
  <div className="h-full w-full p-2 bg-gradient-to-br from-primary/5 to-primary/20">
    <div className="bg-card rounded-lg p-2 shadow-sm h-full overflow-hidden">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 overflow-hidden">
          {profile.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <User className="w-full h-full p-2 text-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate">{profile.full_name || "Your Name"}</p>
          <p className="text-[10px] text-muted-foreground truncate">{profile.city || "Your City"}</p>
        </div>
      </div>
      <p className="text-[9px] text-muted-foreground line-clamp-2 mb-2">{profile.bio || "Your bio will appear here..."}</p>
      <div className="grid grid-cols-2 gap-1">
        {(profile.portfolio_images || []).slice(0, 4).map((img: string, i: number) => (
          <div key={i} className="aspect-[4/3] bg-primary/10 rounded-lg overflow-hidden">
            <img src={img} className="w-full h-full object-cover" />
          </div>
        ))}
        {[...Array(Math.max(0, 4 - (profile.portfolio_images?.length || 0)))].map((_, i) => (
          <div key={`empty-${i}`} className="aspect-[4/3] bg-primary/10 rounded-lg"></div>
        ))}
      </div>
    </div>
  </div>
);

const MinimalTemplate = ({ profile }: { profile: any }) => (
  <div className="h-full w-full p-3 bg-background">
    <div className="text-center mb-2">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/40 mx-auto mb-1 overflow-hidden">
        {profile.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <User className="w-full h-full p-3 text-white" />}
      </div>
      <p className="text-xs font-semibold truncate">{profile.full_name || "Your Name"}</p>
      <p className="text-[10px] text-muted-foreground truncate">{profile.category || "Category"}</p>
    </div>
    <div className="flex justify-center gap-1 mb-2">
      {["instagram", "twitter", "facebook", "linkedin"].map((_, i) => (
        <div key={i} className="w-5 h-5 rounded-full bg-muted"></div>
      ))}
    </div>
    <div className="grid grid-cols-3 gap-1">
      {(profile.portfolio_images || []).slice(0, 3).map((img: string, i: number) => (
        <div key={i} className="aspect-square bg-muted rounded overflow-hidden">
          <img src={img} className="w-full h-full object-cover" />
        </div>
      ))}
      {[...Array(Math.max(0, 3 - (profile.portfolio_images?.length || 0)))].map((_, i) => (
        <div key={`empty-${i}`} className="aspect-square bg-muted rounded"></div>
      ))}
    </div>
  </div>
);

const TemplateCard = ({ 
  template, 
  selected, 
  onSelect,
  profile
}: { 
  template: { id: string; name: string; description: string };
  selected: boolean;
  onSelect: () => void;
  profile: any;
}) => {
  const renderPreview = () => {
    switch (template.id) {
      case 'classic': return <ClassicTemplate profile={profile} />;
      case 'modern': return <ModernTemplate profile={profile} />;
      case 'minimal': return <MinimalTemplate profile={profile} />;
      default: return <ClassicTemplate profile={profile} />;
    }
  };

  return (
    <div 
      className={`relative cursor-pointer rounded-xl border-2 transition-all duration-300 overflow-hidden ${
        selected 
          ? 'border-primary shadow-lg shadow-primary/20 scale-[1.02]' 
          : 'border-muted hover:border-primary/50 hover:shadow-md'
      }`}
      onClick={onSelect}
    >
      {selected && (
        <div className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground rounded-full p-1">
          <Check className="w-4 h-4" />
        </div>
      )}
      <div className="aspect-[4/3] overflow-hidden">
        {renderPreview()}
      </div>
      <div className="p-4 bg-card">
        <h3 className="font-semibold">{template.name}</h3>
        <p className="text-sm text-muted-foreground">{template.description}</p>
      </div>
    </div>
  );
};

const templates = [
  { id: 'classic', name: 'Classic Portfolio', description: 'Traditional layout with banner and gallery' },
  { id: 'modern', name: 'Modern Card', description: 'Clean card-based design' },
  { id: 'minimal', name: 'Minimal Elegant', description: 'Simple centered layout' }
];

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
  profile_template: string | null;
};

const socialPlatforms = [
  { name: 'Instagram', icon: Instagram, placeholder: '@username', key: 'instagram' },
  { name: 'Twitter', icon: Twitter, placeholder: '@handle', key: 'twitter' },
  { name: 'Facebook', icon: Facebook, placeholder: 'facebook.com/profile', key: 'facebook' },
  { name: 'LinkedIn', icon: Linkedin, placeholder: 'linkedin.com/in/profile', key: 'linkedin' },
  { name: 'YouTube', icon: Youtube, placeholder: 'youtube.com/channel', key: 'youtube' },
];

const categories = [
  'Makeup', 'Hair Styling', 'Bridal Makeup', 'Nail Art', 'Skincare',
  'Massage Therapy', 'Waxing & Hair Removal', 'Eyelash Extensions',
  'Brow Shaping', 'Spa Treatments', 'Beauty Consulting', 'Other'
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ProfileEditor() {
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [formData, setFormData] = useState<Partial<Profile>>({ social_accounts: {} });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [customPrice, setCustomPrice] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Authentication required", variant: "destructive" });
        navigate("/auth");
        return;
      }
      setUserId(user.id);

      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setFormData({ ...data, social_accounts: data.social_accounts || {} });
        setSelectedTemplate(data.profile_template || 'classic');
      } else if (error?.code === 'PGRST116') {
        setFormData({ id: user.id, email: user.email, social_accounts: {}, profile_template: 'classic' });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({ title: "Error", description: "Failed to load profile.", variant: "destructive" });
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
      social_accounts: { ...prev.social_accounts, [platform]: value }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Authentication required", variant: "destructive" });
        return;
      }

      const updates = { 
        ...formData, 
        id: user.id,
        social_accounts: formData.social_accounts || {},
        price_range: formData.price_range === "Custom" ? customPrice : formData.price_range,
        profile_template: selectedTemplate
      };
      
      const { error } = await supabase.from("profiles").upsert(updates as any);
      if (error) throw error;
      
      toast({ title: "Success!", description: "Profile updated successfully." });
    } catch (error) {
      console.error("Error saving:", error);
      toast({ title: "Error", description: `Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleTemplateSelect = async (templateId: string) => {
    setSelectedTemplate(templateId);
    // Save template immediately
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({ profile_template: templateId }).eq("id", user.id);
        toast({ title: "Template Applied!", description: `${templates.find(t => t.id === templateId)?.name} is now active.` });
      }
    } catch (error) {
      console.error("Error saving template:", error);
    }
    setTemplateDialogOpen(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner' | 'portfolio') => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      const bucket = type === 'avatar' ? 'avatars' : 'portfolio';

      const { error } = await supabase.storage.from(bucket).upload(filePath, file, { upsert: false });
      if (error) throw error;

      const url = supabase.storage.from(bucket).getPublicUrl(filePath).data.publicUrl;

      if (type === 'avatar') handleInputChange("avatar_url", url);
      else if (type === 'banner') handleInputChange("banner_url", url);
      else {
        const current = formData.portfolio_images || [];
        if (current.length >= 10) {
          toast({ title: "Limit reached", description: "Max 10 images.", variant: "destructive" });
          return;
        }
        handleInputChange("portfolio_images", [...current, url]);
      }
      toast({ title: "Uploaded!", description: `${type} uploaded.` });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error?.message, variant: "destructive" });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const removePortfolioImage = (index: number) => {
    handleInputChange("portfolio_images", formData.portfolio_images?.filter((_, i) => i !== index) || []);
  };

  const toggleDay = (day: string) => {
    const current = formData.available_days || [];
    handleInputChange("available_days", current.includes(day) ? current.filter(d => d !== day) : [...current, day]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header with Template Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Edit Public Profile</h1>
            <p className="text-muted-foreground">Customize how clients see you</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setTemplateDialogOpen(true)}>
              <Layout className="w-4 h-4 mr-2" />
              Choose Template
            </Button>
            {userId && (
              <Button variant="secondary" onClick={() => window.open(`/public-profile/${userId}`, '_blank')}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            )}
          </div>
        </div>

        {/* Current Template Badge */}
        <div className="mb-6">
          <Badge variant="secondary" className="text-sm">
            Current Template: {templates.find(t => t.id === selectedTemplate)?.name || 'Classic'}
          </Badge>
        </div>

        <div className="space-y-6">
          {/* Avatar & Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                    <AvatarImage src={formData.avatar_url || ""} />
                    <AvatarFallback><User className="w-10 h-10" /></AvatarFallback>
                  </Avatar>
                  <Label htmlFor="avatar-upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90">
                    <Upload className="w-4 h-4" />{uploading ? "..." : "Avatar"}
                  </Label>
                  <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} disabled={uploading} className="hidden" id="avatar-upload" />
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label>Full Name</Label><Input value={formData.full_name || ""} placeholder="Your name" onChange={(e) => handleInputChange("full_name", e.target.value)} className="mt-1" /></div>
                  <div><Label>Phone</Label><Input value={formData.phone || ""} placeholder="Phone" onChange={(e) => handleInputChange("phone", e.target.value)} className="mt-1" /></div>
                  <div><Label>City</Label><Input value={formData.city || ""} placeholder="City" onChange={(e) => handleInputChange("city", e.target.value)} className="mt-1" /></div>
                  <div>
                    <Label>Category</Label>
                    <Select value={formData.category || ""} onValueChange={(val) => handleInputChange("category", val)}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{categories.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div><Label>Bio</Label><Textarea value={formData.bio || ""} placeholder="About yourself..." onChange={(e) => handleInputChange("bio", e.target.value)} className="mt-1 min-h-[100px]" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Services</Label><Input value={formData.services || ""} placeholder="e.g., Bridal, Party" onChange={(e) => handleInputChange("services", e.target.value)} className="mt-1" /></div>
                <div>
                  <Label>Price Range</Label>
                  <Select value={formData.price_range || ""} onValueChange={(val) => handleInputChange("price_range", val)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="₹500 - ₹1,000">₹500 - ₹1,000</SelectItem>
                      <SelectItem value="₹1,000 - ₹2,500">₹1,000 - ₹2,500</SelectItem>
                      <SelectItem value="₹2,500 - ₹5,000">₹2,500 - ₹5,000</SelectItem>
                      <SelectItem value="₹5,000+">₹5,000+</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.price_range === "Custom" && <Input value={customPrice} placeholder="Enter price" onChange={(e) => setCustomPrice(e.target.value)} className="mt-2" />}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Banner */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Image className="w-5 h-5" /> Banner Image</CardTitle></CardHeader>
            <CardContent>
              <div className="relative aspect-[3/1] bg-muted rounded-lg overflow-hidden">
                {formData.banner_url ? <img src={formData.banner_url} alt="Banner" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Camera className="w-8 h-8 mr-2" />No banner</div>}
              </div>
              <div className="mt-4">
                <Label htmlFor="banner-upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm"><Upload className="w-4 h-4" />Upload Banner</Label>
                <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'banner')} className="hidden" id="banner-upload" />
              </div>
            </CardContent>
          </Card>

          {/* Portfolio */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="w-5 h-5" /> Portfolio ({formData.portfolio_images?.length || 0}/10)</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {formData.portfolio_images?.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img src={img} alt={`Portfolio ${i + 1}`} className="w-full h-full object-cover" />
                    <button onClick={() => removePortfolioImage(i)} className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                  </div>
                ))}
                {(formData.portfolio_images?.length || 0) < 10 && (
                  <Label htmlFor="portfolio-upload" className="aspect-square border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors"><Plus className="w-8 h-8 text-muted-foreground" /></Label>
                )}
              </div>
              <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'portfolio')} className="hidden" id="portfolio-upload" />
            </CardContent>
          </Card>

          {/* Available Days */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Available Days</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <Badge key={day} variant={(formData.available_days || []).includes(day) ? "default" : "outline"} className="cursor-pointer px-4 py-2" onClick={() => toggleDay(day)}>{day}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Social */}
          <Card>
            <CardHeader><CardTitle>Social Links</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {socialPlatforms.map((p) => (
                  <div key={p.key} className="flex items-center gap-3">
                    <p.icon className="w-5 h-5 text-muted-foreground" />
                    <Input placeholder={p.placeholder} value={(formData.social_accounts as any)?.[p.key] || ""} onChange={(e) => handleSocialChange(p.key, e.target.value)} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Profile"}</Button>
          </div>
        </div>
      </div>

      {/* Template Selection Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Layout className="w-5 h-5" /> Choose Your Profile Template</DialogTitle>
            <DialogDescription>Select how your public profile will look to clients</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
            {templates.map((template) => (
              <div key={template.id}>
                <TemplateCard
                  template={template}
                  selected={selectedTemplate === template.id}
                  onSelect={() => handleTemplateSelect(template.id)}
                  profile={formData}
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
