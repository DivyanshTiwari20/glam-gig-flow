import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Film,
    Plus,
    Heart,
    MessageCircle,
    Share2,
    Play,
    Pause,
    Volume2,
    VolumeX,
    Loader2,
    Upload,
    User,
    MoreVertical,
    Trash2,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Reel {
    id: string;
    user_id: string;
    video_url: string;
    caption: string | null;
    duration: number | null;
    likes_count: number;
    created_at: string;
    profiles: {
        full_name: string | null;
        avatar_url: string | null;
        user_type: string | null;
    } | null;
}

export default function ReelsPage() {
    const [reels, setReels] = useState<Reel[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [caption, setCaption] = useState("");
    const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [playingReelId, setPlayingReelId] = useState<string | null>(null);
    const [mutedReels, setMutedReels] = useState<Set<string>>(new Set());
    const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        loadReels();
        checkCurrentUser();
    }, []);

    const checkCurrentUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setCurrentUserId(user.id);
        }
    };

    const loadReels = async () => {
        try {
            setLoading(true);
            // @ts-ignore - reels table exists in DB but not in TypeScript types
            const { data, error } = await supabase
                .from("reels")
                .select(`
          *,
          profiles:user_id ( full_name, avatar_url, user_type )
        `)
                .order("created_at", { ascending: false });

            if (error) {
                if (error.code === "PGRST116" || error.message.includes("does not exist")) {
                    console.warn("Reels table not found. Returning empty list.");
                    setReels([]);
                } else {
                    throw error;
                }
            } else {
                setReels((data as unknown as Reel[]) || []);
            }
        } catch (error: any) {
            console.error("Error loading reels:", error);
            toast({
                title: "Error",
                description: "Failed to load reels. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (max 50MB)
            if (file.size > 50 * 1024 * 1024) {
                toast({
                    title: "File too large",
                    description: "Please select a video under 50MB.",
                    variant: "destructive",
                });
                return;
            }

            // Check file type
            if (!file.type.startsWith("video/")) {
                toast({
                    title: "Invalid file type",
                    description: "Please select a video file.",
                    variant: "destructive",
                });
                return;
            }

            setSelectedVideo(file);
            setVideoPreviewUrl(URL.createObjectURL(file));
            setShowUploadModal(true);
        }
    };

    const uploadReel = async () => {
        if (!selectedVideo) return;

        try {
            setUploading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // 1. Upload Video to Storage
            const fileExt = selectedVideo.name.split(".").pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("reels")
                .upload(fileName, selectedVideo, {
                    contentType: selectedVideo.type,
                });

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from("reels")
                .getPublicUrl(fileName);

            // 3. Insert into Reels table
            // @ts-ignore - reels table exists in DB but not in TypeScript types
            const { error: insertError } = await supabase
                .from("reels")
                .insert({
                    user_id: user.id,
                    video_url: publicUrl,
                    caption: caption.trim() || null,
                    duration: 0,
                    likes_count: 0,
                });

            if (insertError) throw insertError;

            toast({
                title: "Success! 🎬",
                description: "Your reel has been uploaded successfully!",
            });

            setShowUploadModal(false);
            setCaption("");
            setSelectedVideo(null);
            setVideoPreviewUrl(null);
            loadReels();
        } catch (error: any) {
            console.error("Upload error:", error);
            toast({
                title: "Upload Failed",
                description: error.message || "Failed to upload reel. Please try again.",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteReel = async (reelId: string, videoUrl: string) => {
        try {
            // Extract file path from URL
            const urlParts = videoUrl.split("/reels/");
            const filePath = urlParts[1];

            // Delete from storage
            if (filePath) {
                await supabase.storage.from("reels").remove([filePath]);
            }

            // Delete from database
            // @ts-ignore - reels table exists in DB but not in TypeScript types
            const { error } = await supabase.from("reels").delete().eq("id", reelId);

            if (error) throw error;

            toast({
                title: "Deleted",
                description: "Reel has been deleted.",
            });
            loadReels();
        } catch (error: any) {
            console.error("Delete error:", error);
            toast({
                title: "Error",
                description: "Failed to delete reel.",
                variant: "destructive",
            });
        }
    };

    const togglePlayPause = (reelId: string) => {
        const video = videoRefs.current[reelId];
        if (video) {
            if (playingReelId === reelId) {
                video.pause();
                setPlayingReelId(null);
            } else {
                // Pause all other videos
                Object.values(videoRefs.current).forEach((v) => (v as HTMLVideoElement)?.pause());
                video.play();
                setPlayingReelId(reelId);
            }
        }
    };

    const toggleMute = (reelId: string) => {
        const video = videoRefs.current[reelId];
        if (video) {
            const newMuted = new Set(mutedReels);
            if (mutedReels.has(reelId)) {
                newMuted.delete(reelId);
                video.muted = false;
            } else {
                newMuted.add(reelId);
                video.muted = true;
            }
            setMutedReels(newMuted);
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                        <Film className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Reels</h1>
                        <p className="text-muted-foreground text-sm">Watch and share short videos</p>
                    </div>
                </div>

                {/* Upload Button */}
                <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Upload Reel
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoSelect}
                    className="hidden"
                />
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-pink-500 mb-4" />
                    <p className="text-muted-foreground">Loading reels...</p>
                </div>
            ) : reels.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 flex items-center justify-center mb-6">
                        <Film className="h-12 w-12 text-pink-500" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">No Reels Yet</h2>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                        Be the first to share your work! Upload a short video to showcase your talent.
                    </p>
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white gap-2"
                    >
                        <Upload className="h-4 w-4" />
                        Upload Your First Reel
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {reels.map((reel) => (
                        <Card key={reel.id} className="overflow-hidden group">
                            <CardContent className="p-0 relative">
                                {/* Video */}
                                <div className="relative aspect-[9/16] bg-black">
                                    <video
                                        ref={(el) => {
                                            if (el) videoRefs.current[reel.id] = el;
                                        }}
                                        src={reel.video_url}
                                        className="w-full h-full object-cover"
                                        loop
                                        playsInline
                                        muted={mutedReels.has(reel.id)}
                                        onClick={() => togglePlayPause(reel.id)}
                                    />

                                    {/* Play/Pause Overlay */}
                                    <div
                                        className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        onClick={() => togglePlayPause(reel.id)}
                                    >
                                        {playingReelId === reel.id ? (
                                            <Pause className="h-12 w-12 text-white drop-shadow-lg" />
                                        ) : (
                                            <Play className="h-12 w-12 text-white drop-shadow-lg" />
                                        )}
                                    </div>

                                    {/* Mute Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleMute(reel.id);
                                        }}
                                        className="absolute bottom-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                                    >
                                        {mutedReels.has(reel.id) ? (
                                            <VolumeX className="h-4 w-4 text-white" />
                                        ) : (
                                            <Volume2 className="h-4 w-4 text-white" />
                                        )}
                                    </button>

                                    {/* Delete Button (for own reels) */}
                                    {currentUserId === reel.user_id && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button
                                                    className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <MoreVertical className="h-4 w-4 text-white" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    className="text-destructive cursor-pointer"
                                                    onClick={() => handleDeleteReel(reel.id, reel.video_url)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Reel
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>

                                {/* Reel Info */}
                                <div className="p-4">
                                    {/* User Info */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center overflow-hidden">
                                            {reel.profiles?.avatar_url ? (
                                                <img
                                                    src={reel.profiles.avatar_url}
                                                    alt={reel.profiles?.full_name || "User"}
                                                    className="h-8 w-8 object-cover"
                                                />
                                            ) : (
                                                <User className="h-4 w-4 text-white" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">
                                                {reel.profiles?.full_name || "Anonymous"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatTimeAgo(reel.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Caption */}
                                    {reel.caption && (
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                            {reel.caption}
                                        </p>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center gap-4 pt-2 border-t">
                                        <button className="flex items-center gap-1.5 text-muted-foreground hover:text-pink-500 transition-colors">
                                            <Heart className="h-4 w-4" />
                                            <span className="text-xs">{reel.likes_count || 0}</span>
                                        </button>
                                        <button className="flex items-center gap-1.5 text-muted-foreground hover:text-blue-500 transition-colors">
                                            <MessageCircle className="h-4 w-4" />
                                            <span className="text-xs">0</span>
                                        </button>
                                        <button className="flex items-center gap-1.5 text-muted-foreground hover:text-green-500 transition-colors">
                                            <Share2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Film className="h-5 w-5 text-pink-500" />
                            Upload New Reel
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Video Preview */}
                        {videoPreviewUrl && (
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                                <video
                                    src={videoPreviewUrl}
                                    className="w-full h-full object-contain"
                                    controls
                                />
                            </div>
                        )}

                        {/* Caption Input */}
                        <div className="space-y-2">
                            <Label htmlFor="caption">Caption</Label>
                            <Textarea
                                id="caption"
                                placeholder="Write a caption for your reel..."
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                rows={3}
                                maxLength={500}
                            />
                            <p className="text-xs text-muted-foreground text-right">
                                {caption.length}/500
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowUploadModal(false);
                                setSelectedVideo(null);
                                setVideoPreviewUrl(null);
                                setCaption("");
                            }}
                            disabled={uploading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={uploadReel}
                            disabled={uploading || !selectedVideo}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Post Reel
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
