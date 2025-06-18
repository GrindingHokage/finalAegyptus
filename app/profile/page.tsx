"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  User,
  Languages,
  Bookmark,
  HelpCircle,
  MessageSquare,
  LogOut,
  Lock,
  Camera,
  Shield,
  UserCheck,
  AlertTriangle,
  Trash2,
  Star,
  ChevronRight,
  Mail,
  Edit,
  X,
  Clock,
  MapPin,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { toast } from "@/hooks/use-toast"

// Types for local data
type Translation = {
  id: string
  originalText: string
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
  timestamp: Date
}

type SavedSite = {
  id: string
  name: string
  description: string
  location: string
  image: string
  dateAdded: Date
}

type UserProfile = {
  name: string
  email: string
  profileImage: string | null
}

export default function ProfilePage() {
  const { user, logout, loading } = useAuth()

  // Local state for profile data
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: user?.name || "Mohsen Ibrahim",
    email: user?.email || "mohsen.ibrahim@example.com",
    profileImage: null,
  })

  // Local state for translations and saved sites
  const [translations, setTranslations] = useState<Translation[]>([])
  const [savedSites, setSavedSites] = useState<SavedSite[]>([])

  // Modal states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [isContactSupportOpen, setIsContactSupportOpen] = useState(false)
  const [isReportIssueOpen, setIsReportIssueOpen] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false)

  // Form states
  const [editForm, setEditForm] = useState({ name: "", email: "" })
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" })
  const [supportForm, setSupportForm] = useState({ email: "", message: "" })
  const [issueForm, setIssueForm] = useState({ email: "", title: "", description: "" })
  const [feedbackForm, setFeedbackForm] = useState({ email: "", rating: 0, comment: "" })
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadLocalData = () => {
      // Load profile data
      const savedProfile = localStorage.getItem("aegyptus_profile")
      if (savedProfile) {
        const profile = JSON.parse(savedProfile)
        setUserProfile(profile)
      }

      // Load translations
      const savedTranslations = localStorage.getItem("aegyptus_translations")
      if (savedTranslations) {
        const parsedTranslations = JSON.parse(savedTranslations).map((t: any) => ({
          ...t,
          timestamp: new Date(t.timestamp),
        }))
        setTranslations(parsedTranslations)
      }

      // Load saved sites
      const savedSitesData = localStorage.getItem("aegyptus_saved_sites")
      if (savedSitesData) {
        const parsedSites = JSON.parse(savedSitesData).map((s: any) => ({
          ...s,
          dateAdded: new Date(s.dateAdded),
        }))
        setSavedSites(parsedSites)
      }
    }

    loadLocalData()
  }, [])

  // Save profile data to localStorage
  const saveProfileData = (profile: UserProfile) => {
    localStorage.setItem("aegyptus_profile", JSON.stringify(profile))
    setUserProfile(profile)
  }

  // Handle profile image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newProfile = { ...userProfile, profileImage: e.target?.result as string }
        saveProfileData(newProfile)
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been successfully updated.",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle edit profile
  const handleEditProfile = (e: React.FormEvent) => {
    e.preventDefault()
    const newProfile = { ...userProfile, name: editForm.name, email: editForm.email }
    saveProfileData(newProfile)
    setIsEditProfileOpen(false)
    toast({
      title: "Profile updated",
      description: "Your profile information has been successfully updated.",
    })
  }

  // Handle change password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.new !== passwordForm.confirm) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation don't match.",
        variant: "destructive",
      })
      return
    }
    if (passwordForm.new.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }
    setPasswordForm({ current: "", new: "", confirm: "" })
    setIsChangePasswordOpen(false)
    toast({
      title: "Password changed",
      description: "Your password has been successfully updated.",
    })
  }

  // Handle contact support
  const handleContactSupport = (e: React.FormEvent) => {
    e.preventDefault()
    setSupportForm({ email: "", message: "" })
    setIsContactSupportOpen(false)
    toast({
      title: "Message sent to AEGYPTUS Support",
      description: "We'll contact you soon!",
    })
  }

  // Handle report issue
  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault()
    setIssueForm({ email: "", title: "", description: "" })
    setIsReportIssueOpen(false)
    toast({
      title: "Issue reported",
      description: "Thank you for reporting this issue. We'll investigate it.",
    })
  }

  // Handle feedback
  const handleFeedback = (e: React.FormEvent) => {
    e.preventDefault()
    setFeedbackForm({ email: "", rating: 0, comment: "" })
    setIsFeedbackOpen(false)
    toast({
      title: "Feedback submitted",
      description: "Thank you for your feedback! It helps us improve.",
    })
  }

  // Handle logout
  const handleLogout = async () => {
    // Clear all local data
    localStorage.removeItem("aegyptus_profile")
    localStorage.removeItem("aegyptus_translations")
    localStorage.removeItem("aegyptus_saved_sites")
    await logout()
  }

  // Handle delete account
  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault()
    if (deleteConfirmation === "DELETE") {
      // Clear all local data
      localStorage.removeItem("aegyptus_profile")
      localStorage.removeItem("aegyptus_translations")
      localStorage.removeItem("aegyptus_saved_sites")
      localStorage.removeItem("aegyptus_user")

      setIsDeleteAccountOpen(false)
      setDeleteConfirmation("")
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
        variant: "destructive",
      })

      // Redirect to signin after a short delay
      setTimeout(() => {
        window.location.href = "/auth/signin"
      }, 2000)
    } else {
      toast({
        title: "Confirmation required",
        description: "Please type 'DELETE' to confirm account deletion.",
        variant: "destructive",
      })
    }
  }

  // Remove saved site
  const removeSavedSite = (siteId: string) => {
    const updatedSites = savedSites.filter((site) => site.id !== siteId)
    setSavedSites(updatedSites)
    localStorage.setItem("aegyptus_saved_sites", JSON.stringify(updatedSites))
    toast({
      title: "Site removed",
      description: "The site has been removed from your saved list.",
    })
  }

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes > 1 ? "s" : ""} ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
  }

  if (!user) {
    return (
      <div className="container py-8 px-4">
        <div className="text-center">
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 px-4">
      <h1 className="font-cinzel text-3xl font-bold mb-6 text-gold">Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <Card className="border-gold/20 lg:row-span-2">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gold mx-auto relative group">
                {userProfile.profileImage ? (
                  <Image
                    src={userProfile.profileImage || "/placeholder.svg"}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gold/10 flex items-center justify-center">
                    <User className="h-12 w-12 text-gold" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {/* Edit Profile Button */}
              <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full border-gold/20 bg-background"
                    onClick={() => {
                      setEditForm({ name: userProfile.name, email: userProfile.email })
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>Update your profile information below.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleEditProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Full Name</Label>
                      <Input
                        id="edit-name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-email">Email Address</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setIsEditProfileOpen(false)
                          setEditForm({ name: userProfile.name, email: userProfile.email })
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1 bg-gold hover:bg-gold/90 text-black">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <CardTitle>{userProfile.name}</CardTitle>
            <CardDescription>{userProfile.email}</CardDescription>
            <div className="text-xs text-muted-foreground mt-1">
              Signed in via {user.provider === "google" ? "Google" : "Email"}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Security Section */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-gold" />
                <span className="text-sm font-semibold text-gold">Security</span>
              </div>

              <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
                <DialogTrigger asChild>
                  <div className="flex items-center justify-between p-3 rounded-md hover:bg-gold/5 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-gold" />
                      <div>
                        <div className="font-medium">Change Password</div>
                        <div className="text-xs text-muted-foreground">Update your security credentials</div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>Enter your current password and choose a new one.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={passwordForm.current}
                        onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                        placeholder="Enter your current password"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={passwordForm.new}
                        onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                        placeholder="Enter your new password"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                        placeholder="Confirm your new password"
                        required
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setIsChangePasswordOpen(false)
                          setPasswordForm({ current: "", new: "", confirm: "" })
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1 bg-gold hover:bg-gold/90 text-black">
                        Update Password
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Help Section */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="h-4 w-4 text-gold" />
                <span className="text-sm font-semibold text-gold">Help</span>
              </div>

              <div className="space-y-2">
                <Dialog open={isContactSupportOpen} onOpenChange={setIsContactSupportOpen}>
                  <DialogTrigger asChild>
                    <div className="flex items-center justify-between p-3 rounded-md hover:bg-gold/5 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gold" />
                        <div>
                          <div className="font-medium">Contact Support</div>
                          <div className="text-xs text-muted-foreground">Get help with the app</div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Contact Support</DialogTitle>
                      <DialogDescription>Tell us how we can help you.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleContactSupport} className="space-y-4">
                      <div>
                        <Label htmlFor="support-email">Your Email</Label>
                        <Input
                          id="support-email"
                          type="email"
                          value={supportForm.email}
                          onChange={(e) => setSupportForm({ ...supportForm, email: e.target.value })}
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="support-message">Message</Label>
                        <Textarea
                          id="support-message"
                          value={supportForm.message}
                          onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                          placeholder="Describe your issue or question..."
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-black">
                        Send Message
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={isReportIssueOpen} onOpenChange={setIsReportIssueOpen}>
                  <DialogTrigger asChild>
                    <div className="flex items-center justify-between p-3 rounded-md hover:bg-gold/5 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-gold" />
                        <div>
                          <div className="font-medium">Report Issue</div>
                          <div className="text-xs text-muted-foreground">Report a problem with the app</div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Report an Issue</DialogTitle>
                      <DialogDescription>Help us improve by reporting bugs or issues.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleReportIssue} className="space-y-4">
                      <div>
                        <Label htmlFor="issue-email">Your Email (optional)</Label>
                        <Input
                          id="issue-email"
                          type="email"
                          value={issueForm.email}
                          onChange={(e) => setIssueForm({ ...issueForm, email: e.target.value })}
                          placeholder="Enter your email address"
                        />
                      </div>
                      <div>
                        <Label htmlFor="issue-title">Issue Title</Label>
                        <Input
                          id="issue-title"
                          value={issueForm.title}
                          onChange={(e) => setIssueForm({ ...issueForm, title: e.target.value })}
                          placeholder="Brief description of the issue"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="issue-description">Description</Label>
                        <Textarea
                          id="issue-description"
                          value={issueForm.description}
                          onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
                          placeholder="Detailed description of the problem..."
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-black">
                        Report Issue
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
                  <DialogTrigger asChild>
                    <div className="flex items-center gap-3 p-3 rounded-md hover:bg-gold/5 transition-colors cursor-pointer">
                      <MessageSquare className="h-5 w-5 text-gold" />
                      <span>Feedback</span>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Share Your Feedback</DialogTitle>
                      <DialogDescription>Help us improve your experience with AEGYPTUS.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleFeedback} className="space-y-4">
                      <div>
                        <Label htmlFor="feedback-email">Your Email (optional)</Label>
                        <Input
                          id="feedback-email"
                          type="email"
                          value={feedbackForm.email}
                          onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                          placeholder="Enter your email address"
                        />
                      </div>
                      <div>
                        <Label>Rating</Label>
                        <div className="flex gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-6 w-6 cursor-pointer transition-colors ${
                                star <= feedbackForm.rating ? "fill-gold text-gold" : "text-muted-foreground"
                              }`}
                              onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="feedback-comment">Comments</Label>
                        <Textarea
                          id="feedback-comment"
                          value={feedbackForm.comment}
                          onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                          placeholder="Tell us what you think..."
                        />
                      </div>
                      <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-black">
                        Submit Feedback
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Account Section */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <UserCheck className="h-4 w-4 text-gold" />
                <span className="text-sm font-semibold text-gold">Account</span>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleLogout}
                  disabled={loading}
                  variant="ghost"
                  className="w-full justify-start p-3 h-auto hover:bg-gold/5"
                >
                  <LogOut className="h-5 w-5 text-gold mr-3" />
                  {loading ? "Signing out..." : "Log Out"}
                </Button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="pt-4 border-t border-gold/20">
              <Dialog open={isDeleteAccountOpen} onOpenChange={setIsDeleteAccountOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-3 h-auto text-red-500 hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5 mr-3" />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-red-500">Delete Account</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete your account? This action is irreversible and will permanently
                      delete all your data.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleDeleteAccount} className="space-y-4">
                    <div>
                      <Label htmlFor="delete-confirmation">
                        Type <strong>DELETE</strong> to confirm
                      </Label>
                      <Input
                        id="delete-confirmation"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        placeholder="DELETE"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="destructive"
                      className="w-full"
                      disabled={deleteConfirmation !== "DELETE"}
                    >
                      Delete Account Permanently
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="translations" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="translations">My Translations</TabsTrigger>
              <TabsTrigger value="saved">Saved Sites</TabsTrigger>
              <TabsTrigger value="purchases">Purchases</TabsTrigger>
            </TabsList>

            <TabsContent value="translations" className="mt-4 space-y-4">
              <Card className="border-gold/20">
                <CardHeader>
                  <CardTitle>My Translations</CardTitle>
                  <CardDescription>Your recent translation history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {translations.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No translations yet</p>
                        <p className="text-sm">Start translating to see your history here</p>
                      </div>
                    ) : (
                      translations.map((translation) => (
                        <div
                          key={translation.id}
                          className="p-4 border border-gold/20 rounded-md hover:border-gold/50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Languages className="h-4 w-4" />
                              <span>
                                {translation.sourceLanguage} → {translation.targetLanguage}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeAgo(translation.timestamp)}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Original:</p>
                              <p className="text-sm bg-muted/50 p-2 rounded">{translation.originalText}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Translation:</p>
                              <p className="text-sm bg-gold/10 p-2 rounded">{translation.translatedText}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved" className="mt-4 space-y-4">
              <Card className="border-gold/20">
                <CardHeader>
                  <CardTitle>Saved Sites</CardTitle>
                  <CardDescription>Your bookmarked historical sites</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {savedSites.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No saved sites yet</p>
                        <p className="text-sm">Bookmark sites to see them here</p>
                      </div>
                    ) : (
                      savedSites.map((site) => (
                        <div
                          key={site.id}
                          className="flex gap-4 p-3 border border-gold/20 rounded-md hover:border-gold/50 transition-colors"
                        >
                          <div className="w-20 h-20 relative rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={site.image || "/placeholder.svg"}
                              alt={site.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium">{site.name}</h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSavedSite(site.id)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1 h-auto"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                              <MapPin className="h-3 w-3" />
                              <span>{site.location}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{site.description}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>Saved {formatTimeAgo(site.dateAdded)}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="purchases" className="mt-4 space-y-4">
              <Card className="border-gold/20">
                <CardHeader>
                  <CardTitle>Purchase History</CardTitle>
                  <CardDescription>Your recent purchases from the Bazaar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="flex gap-4 p-3 border border-gold/20 rounded-md hover:border-gold/50 transition-colors"
                      >
                        <div className="w-20 h-20 relative rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={`/placeholder.svg?height=80&width=80&text=Item${i}`}
                            alt={`Item ${i}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Gold Scarab Pendant</h3>
                          <p className="text-sm text-gold font-medium">$129.99</p>
                          <p className="text-xs text-muted-foreground mb-2">Purchased on May 10, 2023</p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="border-gold/20 text-xs">
                              Track Order
                            </Button>
                            <Button variant="outline" size="sm" className="border-gold/20 text-xs">
                              Buy Again
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
