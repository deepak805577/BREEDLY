"use client";
import "./avatar.css";
import { useEffect, useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { supabase } from "@/lib/supabase";
import { getCroppedImg } from "@/app/utils/cropImage";
import { compressImage } from "@/app/utils/compressImage";

export default function ProfileAvatarModal({ open, onClose }) {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");

  // ✅ Separated states
  const [avatarUrl, setAvatarUrl] = useState(null);       // existing avatar
  const [editImageSrc, setEditImageSrc] = useState(null); // new image only

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  /* ================= CLEANUP ================= */
  const cleanup = useCallback(() => {
    if (editImageSrc?.startsWith("blob:")) {
      URL.revokeObjectURL(editImageSrc);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, [editImageSrc]);

  /* ================= RESET ================= */
  const resetState = useCallback(() => {
    cleanup();
    setUser(null);
    setUsername("");
    setAvatarUrl(null);
    setEditImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedPixels(null);
    setUploading(false);
    setError("");
    setIsInitialized(false);
  }, [cleanup]);

  /* ================= FETCH USER ================= */
  useEffect(() => {
    if (!open) {
       // 🔥 HARD RESET edit mode
  setEditImageSrc(null);
  setCroppedPixels(null);
  setCrop({ x: 0, y: 0 });
  setZoom(1);
    }
    if (isInitialized) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (controller.signal.aborted) return;

        if (error || !data?.user) {
          setError("User not authenticated");
          return;
        }

        const currentUser = data.user;
        setUser(currentUser);
        setUsername(
          currentUser.user_metadata?.name ||
          currentUser.user_metadata?.full_name ||
          ""
        );
    const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_url, full_name")
        .eq("id", currentUser.id)
        .single();

      // ✅ NAME PRIORITY
      setUsername(
        profile?.full_name ||
        currentUser.user_metadata?.name ||
        currentUser.user_metadata?.full_name ||
        ""
      );
        if (profile?.avatar_url) {
          setAvatarUrl(profile.avatar_url);
        }

        setIsInitialized(true);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error(err);
          setError("Failed to load user");
        }
      }
    };

    fetchUser();
    return () => controller.abort();
  }, [open, isInitialized, resetState]);

  /* ================= CROP COMPLETE ================= */
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    if (croppedAreaPixels?.width && croppedAreaPixels?.height) {
      setCroppedPixels(croppedAreaPixels);
    }
  }, []);

  /* ================= AUTO INIT CROP ================= */

  /* ================= FILE VALIDATION ================= */
  const validateFile = (file) => {
    if (!file) throw new Error("No file selected");
    if (!file.type.startsWith("image/")) throw new Error("Only image files allowed");
    if (file.size > 5 * 1024 * 1024) throw new Error("Image must be under 5MB");
  };

  /* ================= FILE SELECT ================= */
  const onFileChange = useCallback((file) => {
    if (!file) return;

    try {
      validateFile(file);

      if (editImageSrc?.startsWith("blob:")) {
        URL.revokeObjectURL(editImageSrc);
      }

      setEditImageSrc(URL.createObjectURL(file));
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedPixels(null);
      setError("");
    } catch (err) {
      setError(err.message);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [editImageSrc]);

  /* ================= UPLOAD ================= */
  const uploadAvatar = async () => {
    if (!editImageSrc || !croppedPixels || !user) {
      setError("Missing data for upload");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const croppedBlob = await getCroppedImg(editImageSrc, croppedPixels);
      const croppedFile = new File([croppedBlob], "avatar.png", {
        type: "image/png",
        lastModified: Date.now(),
      });

      const compressedFile = await compressImage(croppedFile);

      const filePath = `${user.id}/avatar_${Date.now()}.png`;

      const { error: uploadError } = await supabase.storage
        .from("profile-pics")
        .upload(filePath, compressedFile, {
          contentType: "image/png",
          cacheControl: "3600",
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("profile-pics")
        .getPublicUrl(filePath);

      await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            avatar_url: data.publicUrl,
            full_name: username || null,
            email: user.email,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );

      onClose();
    } catch (err) {
      console.error(err);
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    setUploading(true);
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (!open) return null;

  /* ================= UI ================= */
  return (
    <div className="avatar-overlay">
      <div className="profile-modal scale-in">
        <button className="modal-close" onClick={onClose} disabled={uploading}>✕</button>

        <div className="profile-top">
          <div className="profile-avatar">
            {editImageSrc || avatarUrl ? (
              <img src={editImageSrc || avatarUrl} alt="Avatar" />
            ) : (
              <span>{user?.email?.[0]?.toUpperCase() || "?"}</span>
            )}
          </div>

          <label className="change-photo">
            Change photo
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/*"
              disabled={uploading}
              onChange={(e) => onFileChange(e.target.files[0])}
            />
          </label>
        </div>

        <div className="profile-info">
          <input
            className="profile-name"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // ✅ This WORKS
            placeholder="Your name"
            disabled={uploading}
            maxLength={50}
          />
          <p className="profile-email">{user?.email}</p>
        </div>

        {Boolean(editImageSrc) && (
          <>
            <div className="profile-cropper">
              <Cropper
      image={editImageSrc}
      crop={crop}
      zoom={zoom}
      aspect={1}
      onCropChange={setCrop}
      onZoomChange={setZoom}
      onCropComplete={onCropComplete}
    />
            </div>

            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(+e.target.value)}
            />

            <button
              className="btn-save"
              onClick={uploadAvatar}
              disabled={uploading || !editImageSrc}
            >
              {uploading ? "Saving..." : "Save changes"}
            </button>
          </>
        )}

        <button className="btn-logout" onClick={handleLogout} disabled={uploading}>
          Logout
        </button>

        {error && <p className="profile-error">{error}</p>}
      </div>
    </div>
  );
}
