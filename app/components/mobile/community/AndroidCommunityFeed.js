"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./AndroidCommunityFeed.module.css";
import BottomNav from "../home/BottomNav";
import { Bell, Heart, MessageCircle, Share2, Plus, MoreHorizontal } from "lucide-react";

export default function AndroidCommunityFeed({ 
  posts, 
  currentUser, 
  handleLike, 
  setShowModal 
}) {
  const [activeTab, setActiveTab] = useState("For You");
  const tabs = ["For You", "Trending", "New", "Following"];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.iconBtn}>
          <Bell size={20} />
        </button>
        <h1 className={styles.headerTitle}>Community</h1>
        <div className={styles.avatar}>
          {/* User avatar or placeholder */}
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button 
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className={styles.postList}>
        {posts.map(post => (
          <div key={post.id} className={styles.postCard}>
            <div className={styles.postHeader}>
              <div className={styles.postUser}>
                <div className={styles.postAvatar}>
                   {post.author_avatar_url && (
                     <Image src={post.author_avatar_url} alt="avatar" fill style={{ borderRadius: '50%', objectFit: 'cover' }} />
                   )}
                </div>
                <div className={styles.postUserInfo}>
                  <h4>{post.author_name}</h4>
                  <span>{post.timeAgo || "2h ago"}</span>
                </div>
              </div>
              <MoreHorizontal size={20} color="#A67B5B" />
            </div>

            <div className={styles.postContent}>
              {post.content}
            </div>

            {post.media_url && (
              <img src={post.media_url} alt="post" className={styles.postImage} />
            )}

            <div className={styles.postActions}>
              <button 
                className={`${styles.actionBtn} ${post.hasLiked ? styles.liked : ''}`}
                onClick={() => handleLike(post.id, post.hasLiked)}
              >
                <Heart size={22} />
                {post.likesCount || 0}
              </button>
              <button className={styles.actionBtn}>
                <MessageCircle size={22} />
                {post.commentsCount || 0}
              </button>
              <button className={styles.actionBtn}>
                <Share2 size={22} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className={styles.fab} onClick={() => setShowModal(true)}>
        <Plus size={28} />
      </button>

      <BottomNav />
    </div>
  );
}
