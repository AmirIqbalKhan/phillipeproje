"use client"

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { useEventMashups } from '@/context/EventMingleContext'
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
// Remove Role import if not exported
// import { Role } from '@prisma/client';
import EventCard from '@/components/EventCard';

interface UserEvent {
  id: string
  name: string
  date: string
  location: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [edit, setEdit] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [name, setName] = useState("")
  const [interests, setInterests] = useState("")
  const [avatar, setAvatar] = useState("")
  const [userEvents, setUserEvents] = useState<UserEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Change promotionRole type to string
  const [promotionRole, setPromotionRole] = useState<string | ''>('');
  const [promotionStatus, setPromotionStatus] = useState<string | null>(null)
  const [promotionLoading, setPromotionLoading] = useState(false)
  const [bio, setBio] = useState("");
  const [uploading, setUploading] = useState(false);
  const [createdAt, setCreatedAt] = useState("");
  const [lastLoginAt, setLastLoginAt] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [role, setRole] = useState("");
  const [savedEvents, setSavedEvents] = useState<any[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [savedError, setSavedError] = useState<string | null>(null);
  const [socialFeed, setSocialFeed] = useState<any[]>([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [rewards, setRewards] = useState<any[]>([]);
  const [referredUsers, setReferredUsers] = useState<any[]>([]);
  const [rewardsReferralCode, setRewardsReferralCode] = useState<string | null>(null);
  const [rewardsLoading, setRewardsLoading] = useState(false);
  const [rewardsError, setRewardsError] = useState<string | null>(null);

  const TABS = [
    { id: 'profile', label: 'Profile' },
    { id: 'events', label: 'My Events' },
    { id: 'saved', label: 'Saved Events' },
    { id: 'feed', label: 'Social Feed' },
    { id: 'rewards', label: 'Rewards' },
  ];
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    async function fetchProfile() {
      if (session?.user?.id) {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/user/${session.user.id}`);
          const data = await res.json();
          setProfile(data.user);
          setName(data.user.name || "");
          setInterests((data.user.interests || []).join(", "));
          setAvatar(data.user.avatar || "");
          setBio(data.user.bio || "");
          setCreatedAt(data.user.createdAt ? new Date(data.user.createdAt).toLocaleDateString() : "");
          setLastLoginAt(data.user.lastLoginAt ? new Date(data.user.lastLoginAt).toLocaleString() : "");
          setReferralCode(data.user.referralCode || "");
          setRole(data.user.role || "");
        } catch (err) {
          setError("Failed to load profile");
        } finally {
          setLoading(false);
        }
      }
    }
    fetchProfile();
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/user/${session.user.id}/events`).then(res => res.json()).then(data => setUserEvents(data.events || []))
    }
  }, [session?.user?.id])

  useEffect(() => {
    if (activeTab === 'saved' && session?.user?.id) {
      setSavedLoading(true);
      setSavedError(null);
      fetch(`/api/user/${session.user.id}/saved-events`)
        .then(res => res.json())
        .then(data => {
          setSavedEvents(data.savedEvents || []);
          setSavedLoading(false);
        })
        .catch(() => {
          setSavedError('Failed to load saved events');
          setSavedLoading(false);
        });
    }
  }, [activeTab, session?.user?.id]);

  useEffect(() => {
    if (activeTab === 'feed' && session?.user?.id) {
      setFeedLoading(true);
      setFeedError(null);
      fetch(`/api/user/${session.user.id}/social-feed`)
        .then(res => res.json())
        .then(data => {
          setSocialFeed(data.feed || []);
          setFeedLoading(false);
        })
        .catch(() => {
          setFeedError('Failed to load social feed');
          setFeedLoading(false);
        });
    }
  }, [activeTab, session?.user?.id]);

  useEffect(() => {
    if (activeTab === 'rewards' && session?.user?.id) {
      setRewardsLoading(true);
      setRewardsError(null);
      fetch(`/api/user/${session.user.id}/rewards`)
        .then(res => res.json())
        .then(data => {
          setRewardsReferralCode(data.referralCode || null);
          setReferredUsers(data.referredUsers || []);
          setRewards(data.rewards || []);
          setRewardsLoading(false);
        })
        .catch(() => {
          setRewardsError('Failed to load rewards');
          setRewardsLoading(false);
        });
    }
  }, [activeTab, session?.user?.id]);

  if (status === 'loading' || loading) {
    return <div className="min-h-screen flex items-center justify-center text-white text-xl sm:text-2xl">Loading...</div>
  }
  if (!session) {
    if (typeof window !== 'undefined') router.push('/login')
    return <div className="min-h-screen flex items-center justify-center text-white text-xl sm:text-2xl">Redirecting to login...</div>
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">{error}</div>
  }
  if (!profile) return null

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profile.email,
          name,
          interests: interests.split(',').map((s: string) => s.trim()).filter(Boolean),
          avatar,
          bio,
        }),
      })
      if (!res.ok) throw new Error('Failed to update profile')
      const data = await res.json()
      setProfile(data.user)
      setEdit(false)
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  async function handlePromotionRequest(e: React.FormEvent) {
    e.preventDefault()
    setPromotionStatus(null)
    setPromotionLoading(true)
    try {
      const res = await fetch('/api/user/role-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestedRole: promotionRole }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit request')
      setPromotionStatus('Request submitted! You will be notified by email.')
      setPromotionRole('')
    } catch (err: any) {
      setPromotionStatus(err.message || 'Failed to submit request')
    } finally {
      setPromotionLoading(false)
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload image');
      setAvatar(data.url);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Section with background image */}
      <section className="relative min-h-[60vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1500&q=80"
          alt="Profile background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark blur overlay for readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        {/* Top and bottom black blends */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-32 sm:pt-40 pb-16 sm:pb-24">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white text-center mb-4 sm:mb-6 md:mb-8 leading-tight drop-shadow-2xl px-2">
            Your Profile
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl sm:max-w-2xl mx-auto text-center drop-shadow-lg px-4">
            Manage your account and view your event history
          </p>
          
          {/* Profile Content */}
          <div className="w-full max-w-4xl mx-auto px-4">
            {/* Tabs */}
            <div className="flex gap-2 sm:gap-4 mb-6">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm sm:text-base
                    ${activeTab === tab.id ? 'bg-purple-600 text-white shadow' : 'bg-black/40 text-white/70 hover:bg-black/60'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Tab Content */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Profile Details (as before) */}
                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg">Profile Details</h2>
                  {edit ? (
                    <form onSubmit={handleSave} className="space-y-4 sm:space-y-6">
                      <div>
                        <label className="block mb-2 font-semibold text-white drop-shadow-lg text-sm sm:text-base">Name</label>
                        <input 
                          value={name} 
                          onChange={e => setName(e.target.value)} 
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm sm:text-base" 
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-semibold text-white drop-shadow-lg text-sm sm:text-base">Interests (comma separated)</label>
                        <input 
                          value={interests} 
                          onChange={e => setInterests(e.target.value)} 
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm sm:text-base" 
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-semibold text-white drop-shadow-lg text-sm sm:text-base">Bio</label>
                        <textarea
                          value={bio}
                          onChange={e => setBio(e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm sm:text-base"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-semibold text-white drop-shadow-lg text-sm sm:text-base">Profile Picture</label>
                        <div className="flex items-center gap-4">
                          {avatar && <img src={avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-white" />}
                          <input type="file" accept="image/*" onChange={handleAvatarUpload} className="text-white" />
                          {uploading && <span className="text-white text-xs ml-2">Uploading...</span>}
                        </div>
                      </div>
                      <button type="submit" className="bg-white text-black font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-gray-200 transition-all shadow-lg text-sm sm:text-base">
                        Save Changes
                      </button>
                    </form>
                  ) : (
                    <>
                      {/* Show more details in view mode */}
                      <ul className="space-y-3 sm:space-y-4 text-white/80 text-sm sm:text-base lg:text-lg">
                        <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="font-bold text-white drop-shadow-lg">Name:</span> 
                          <span className="truncate">{profile.name}</span>
                        </li>
                        <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="font-bold text-white drop-shadow-lg">Email:</span> 
                          <span className="truncate">{profile.email}</span>
                        </li>
                        <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="font-bold text-white drop-shadow-lg">Role:</span>
                          <span className="truncate">{role}</span>
                        </li>
                        <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="font-bold text-white drop-shadow-lg">Bio:</span>
                          <span className="truncate">{profile.bio}</span>
                        </li>
                        <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="font-bold text-white drop-shadow-lg">Interests:</span> 
                          <span className="flex-1">{(profile.interests || []).join(', ')}</span>
                        </li>
                        <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="font-bold text-white drop-shadow-lg">Account Created:</span>
                          <span className="truncate">{createdAt}</span>
                        </li>
                        <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="font-bold text-white drop-shadow-lg">Last Login:</span>
                          <span className="truncate">{lastLoginAt}</span>
                        </li>
                        {referralCode && (
                          <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="font-bold text-white drop-shadow-lg">Referral Code:</span>
                            <span className="truncate">{referralCode}</span>
                          </li>
                        )}
                        {avatar && (
                          <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="font-bold text-white drop-shadow-lg">Avatar:</span>
                            <img src={avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-white" />
                          </li>
                        )}
                      </ul>
                      <button onClick={() => setEdit(true)} className="mt-4 sm:mt-6 bg-white text-black font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-gray-200 transition-all shadow-lg text-sm sm:text-base">
                        Edit Profile
                      </button>
                    </>
                  )}
                </div>
                
                {/* User Events (summary) */}
                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg">Your Events</h2>
                  <ul className="space-y-2 sm:space-y-3 text-white/80 text-sm sm:text-base lg:text-lg">
                    {userEvents.length === 0 && (
                      <li className="text-center py-6 sm:py-8">No events registered yet.</li>
                    )}
                    {userEvents.map(e => (
                      <li key={e.id} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 p-2 sm:p-3 bg-black/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-purple-300">•</span>
                          <a href={`/event/${e.id}`} className="underline hover:text-purple-400 truncate">{e.name}</a>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-white/60 text-xs sm:text-sm">
                          {e.date && (
                            <span>{new Date(e.date).toLocaleDateString()}</span>
                          )}
                          {e.location && (
                            <span className="truncate">{e.location}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {activeTab === 'events' && (
              <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg">My Events</h2>
                <ul className="space-y-2 sm:space-y-3 text-white/80 text-sm sm:text-base lg:text-lg">
                  {userEvents.length === 0 && (
                    <li className="text-center py-6 sm:py-8">No events registered yet.</li>
                  )}
                  {userEvents.map(e => (
                    <li key={e.id} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 p-2 sm:p-3 bg-black/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-300">•</span>
                        <a href={`/event/${e.id}`} className="underline hover:text-purple-400 truncate">{e.name}</a>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-white/60 text-xs sm:text-sm">
                        {e.date && (
                          <span>{new Date(e.date).toLocaleDateString()}</span>
                        )}
                        {e.location && (
                          <span className="truncate">{e.location}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === 'saved' && (
              <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20 text-white">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 drop-shadow-lg">Saved Events</h2>
                {savedLoading ? (
                  <div className="text-white/70">Loading...</div>
                ) : savedError ? (
                  <div className="text-red-400">{savedError}</div>
                ) : savedEvents.length === 0 ? (
                  <div className="text-white/70">You have no saved events yet.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedEvents.map((saved) => (
                      <EventCard key={saved.event.id} event={{
                        id: saved.event.id,
                        title: saved.event.name,
                        description: saved.event.description,
                        location: saved.event.location,
                        startDate: new Date(saved.event.date),
                        endDate: new Date(saved.event.date),
                        price: saved.event.price,
                        capacity: saved.event.capacity,
                        category: saved.event.category,
                        organizer: { name: saved.event.organizer?.name || '', avatar: undefined },
                        images: saved.event.images || [],
                        tags: saved.event.tags || [],
                        isFeatured: saved.event.isFeatured || false,
                      }} />
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'feed' && (
              <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20 text-white">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 drop-shadow-lg">Social Feed</h2>
                {feedLoading ? (
                  <div className="text-white/70">Loading...</div>
                ) : feedError ? (
                  <div className="text-red-400">{feedError}</div>
                ) : socialFeed.length === 0 ? (
                  <div className="text-white/70">No recent activity from your friends yet.</div>
                ) : (
                  <ul className="space-y-4">
                    {socialFeed.map((item, idx) => (
                      <li key={idx} className="bg-black/30 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="font-bold text-purple-300">{item.user?.name || 'A friend'}</span>
                        <span className="text-white/80">registered for</span>
                        <a href={`/event/${item.event?.id}`} className="underline text-purple-400 hover:text-purple-200 font-semibold">{item.event?.name || 'an event'}</a>
                        <span className="text-white/60 text-xs">{item.event?.date ? new Date(item.event.date).toLocaleDateString() : ''}</span>
                        {item.event?.location && <span className="text-white/60 text-xs">@ {item.event.location}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {activeTab === 'rewards' && (
              <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20 text-white">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 drop-shadow-lg">Rewards & Referrals</h2>
                {rewardsLoading ? (
                  <div className="text-white/70">Loading...</div>
                ) : rewardsError ? (
                  <div className="text-red-400">{rewardsError}</div>
                ) : (
                  <>
                    <div className="mb-6">
                      <div className="font-semibold text-lg mb-2">Your Referral Code:</div>
                      <div className="bg-black/30 rounded-lg px-4 py-2 text-purple-300 font-mono text-xl inline-block select-all">{rewardsReferralCode || 'N/A'}</div>
                    </div>
                    <div className="mb-6">
                      <div className="font-semibold text-lg mb-2">Users You Referred:</div>
                      {referredUsers.length === 0 ? (
                        <div className="text-white/70">You haven't referred anyone yet.</div>
                      ) : (
                        <ul className="list-disc pl-6 space-y-1">
                          {referredUsers.map((user: any) => (
                            <li key={user.id} className="text-white/80">{user.name} ({user.email})</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-lg mb-2">Your Rewards:</div>
                      {rewards.length === 0 ? (
                        <div className="text-white/70">You have no rewards yet.</div>
                      ) : (
                        <ul className="space-y-2">
                          {rewards.map((reward: any) => (
                            <li key={reward.id} className="bg-black/30 rounded-lg px-4 py-2 flex flex-col sm:flex-row sm:items-center gap-2">
                              <span className="text-green-300 font-bold">{reward.type}</span>
                              <span className="text-white/80">{reward.amount}</span>
                              <span className="text-white/60 text-xs">{reward.status}</span>
                              <span className="text-white/60 text-xs">{reward.createdAt ? new Date(reward.createdAt).toLocaleDateString() : ''}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Navigation overlays hero image */}
      <div className="absolute top-0 left-0 w-full z-20">
        <Navigation />
      </div>
      
      {/* Footer with top blend */}
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none z-10"></div>
        <Footer />
      </div>

      {/* Role Promotion Request Section */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20 mt-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 drop-shadow-lg">Request Role Promotion</h2>
        <form onSubmit={handlePromotionRequest} className="flex flex-col sm:flex-row gap-4 items-center">
          <select
            value={promotionRole}
            onChange={e => setPromotionRole(e.target.value as string)}
            className="px-3 py-2 rounded bg-black/60 border border-white/20 text-white"
            required
          >
            <option value="">Select a role</option>
            <option value="ORGANIZER">Organizer</option>
            <option value="SUPPORT_STAFF">Support Staff</option>
            <option value="EVENT_MODERATOR">Event Moderator</option>
            <option value="FINANCE_TEAM">Finance Team</option>
            <option value="MARKETING_TEAM">Marketing Team</option>
            <option value="TECHNICAL_STAFF">Technical Staff</option>
          </select>
          <button
            type="submit"
            className="bg-purple-600 text-white font-bold px-4 py-2 rounded hover:bg-purple-700 transition"
            disabled={promotionLoading}
          >
            {promotionLoading ? 'Submitting...' : 'Request Promotion'}
          </button>
        </form>
        {promotionStatus && <div className="mt-2 text-center text-sm text-white">{promotionStatus}</div>}
      </div>
    </div>
  )
} 