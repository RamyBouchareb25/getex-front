"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Send, 
  Users, 
  Radio, 
  Target, 
  Settings, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  History,
  Calendar,
  Filter,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

import { sendNotificationAction, createTopicAction, subscribeUsersToTopicAction } from "@/lib/actions/notifications";
import { NotificationFormData, User, Topic } from "@/types/notifications";

interface NotificationsManagerProps {
  initialUsers: User[];
  initialTopics: Topic[];
  initialHistory: any;
  initialTab: string;
  initialPage: number;
  initialType: string;
  initialStartDate: string;
  initialEndDate: string;
}

export default function NotificationsManager({
  initialUsers,
  initialTopics,
  initialHistory,
  initialTab,
  initialPage,
  initialType,
  initialStartDate,
  initialEndDate,
}: NotificationsManagerProps) {
  const t = useTranslations("notifications");
  const tCommon = useTranslations("common");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Form state
  const [formData, setFormData] = useState<NotificationFormData>({
    type: "broadcast",
    title: "",
    body: "",
    priority: "normal",
    android: { enabled: true },
    ios: { enabled: true },
    web: { enabled: true },
  });

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [customData, setCustomData] = useState<Array<{ key: string; value: string }>>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Dialog states
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [showSubscribeUsers, setShowSubscribeUsers] = useState(false);
  const [selectedTopicForSubscription, setSelectedTopicForSubscription] = useState("");
  const [showBroadcastConfirm, setShowBroadcastConfirm] = useState(false);

  const updateSearchParams = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const handleSendNotification = async () => {
    if (!formData.title || !formData.body) {
      toast.error("Please fill in required fields");
      return;
    }

    if (formData.type === "users" && selectedUsers.length === 0) {
      toast.error("Please select at least one user");
      return;
    }

    if (formData.type === "topic" && !formData.topic) {
      toast.error("Please select a topic");
      return;
    }

    // Show confirmation dialog for broadcast
    if (formData.type === "broadcast") {
      setShowBroadcastConfirm(true);
      return;
    }

    // Send notification directly for non-broadcast types
    await sendNotification();
  };

  const sendNotification = async () => {
    startTransition(async () => {
      try {
        const notificationData: NotificationFormData = {
          ...formData,
          userIds: formData.type === "users" ? selectedUsers : undefined,
          data: customData.reduce((acc, { key, value }) => {
            if (key && value) {
              acc[key] = value;
            }
            return acc;
          }, {} as Record<string, string>),
        };

        const result = await sendNotificationAction(notificationData);
        
        if (result.success) {
          toast.success(t("sentSuccessfully"));
          // Reset form
          setFormData({
            type: "broadcast",
            title: "",
            body: "",
            priority: "normal",
            android: { enabled: true },
            ios: { enabled: true },
            web: { enabled: true },
          });
          setSelectedUsers([]);
          setCustomData([]);
        } else {
          toast.error(result.message || t("failedToSend"));
        }
      } catch (error) {
        toast.error(t("failedToSend"));
      }
    });
  };

  const handleConfirmBroadcast = async () => {
    setShowBroadcastConfirm(false);
    toast.error("⚠️ This action is NOT reversible and will send to ALL users!", {
      duration: 3000,
    });
    await sendNotification();
  };

  const handleCreateTopic = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formDataObj = new FormData(event.currentTarget);
    
    startTransition(async () => {
      try {
        const result = await createTopicAction(formDataObj);
        if (result.success) {
          toast.success(t("topicCreated"));
          setShowCreateTopic(false);
          router.refresh();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Failed to create topic");
      }
    });
  };

  const handleSubscribeUsers = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user");
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("topicId", selectedTopicForSubscription);
    selectedUsers.forEach(userId => formDataObj.append("userIds", userId));

    startTransition(async () => {
      try {
        const result = await subscribeUsersToTopicAction(formDataObj);
        if (result.success) {
          toast.success(t("usersSubscribed"));
          setShowSubscribeUsers(false);
          setSelectedUsers([]);
          router.refresh();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Failed to subscribe users");
      }
    });
  };

  const addCustomDataField = () => {
    setCustomData([...customData, { key: "", value: "" }]);
  };

  const updateCustomData = (index: number, field: "key" | "value", value: string) => {
    const newData = [...customData];
    newData[index][field] = value;
    setCustomData(newData);
  };

  const removeCustomDataField = (index: number) => {
    setCustomData(customData.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">
            Send notifications to users, topics, or broadcast to everyone
          </p>
        </div>
      </div>

      <Tabs value={initialTab} onValueChange={(value) => updateSearchParams({ tab: value, page: "" })}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="send" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            {t("send")}
          </TabsTrigger>
          <TabsTrigger value="topics" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            {t("manageTopics")}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            {t("viewHistory")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                {t("sendNotification")}
              </CardTitle>
              <CardDescription>
                Send push notifications to your users through various platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Targeting */}
              <div className="space-y-4">
                <Label>{t("sendTo")}</Label>
                <div className="grid grid-cols-3 gap-4">
                  <Card 
                    className={`cursor-pointer transition-colors ${formData.type === "broadcast" ? "border-primary bg-primary/5" : ""}`}
                    onClick={() => setFormData({ ...formData, type: "broadcast" })}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <Radio className="h-8 w-8 mb-2" />
                      <span className="font-medium">{t("broadcast")}</span>
                    </CardContent>
                  </Card>
                  <Card 
                    className={`cursor-pointer transition-colors ${formData.type === "users" ? "border-primary bg-primary/5" : ""}`}
                    onClick={() => setFormData({ ...formData, type: "users" })}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <Users className="h-8 w-8 mb-2" />
                      <span className="font-medium">{t("users")}</span>
                    </CardContent>
                  </Card>
                  <Card 
                    className={`cursor-pointer transition-colors ${formData.type === "topic" ? "border-primary bg-primary/5" : ""}`}
                    onClick={() => setFormData({ ...formData, type: "topic" })}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <Target className="h-8 w-8 mb-2" />
                      <span className="font-medium">{t("topic")}</span>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* User Selection */}
              {formData.type === "users" && (
                <div className="space-y-4">
                  <Label>{t("selectUsers")}</Label>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="h-4 w-4 mr-2" />
                        {selectedUsers.length > 0 
                          ? `${selectedUsers.length} users selected`
                          : "Select users"
                        }
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-lg">
                      <SheetHeader>
                        <SheetTitle>{t("selectUsers")}</SheetTitle>
                        <SheetDescription>
                          Choose which users should receive this notification
                        </SheetDescription>
                      </SheetHeader>
                      <div className="space-y-4 mt-6">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="select-all"
                            checked={selectedUsers.length === initialUsers.length}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedUsers(initialUsers.map(u => u.id));
                              } else {
                                setSelectedUsers([]);
                              }
                            }}
                          />
                          <Label htmlFor="select-all">Select All</Label>
                        </div>
                        <Separator />
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {initialUsers.map((user) => (
                            <div key={user.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={user.id}
                                checked={selectedUsers.includes(user.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedUsers([...selectedUsers, user.id]);
                                  } else {
                                    setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                                  }
                                }}
                              />
                              <div className="flex-1">
                                <Label htmlFor={user.id} className="text-sm font-normal">
                                  {user.name}
                                </Label>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                <Badge variant="outline" className="text-xs">
                                  {user.role}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              )}

              {/* Topic Selection */}
              {formData.type === "topic" && (
                <div className="space-y-2">
                  <Label>{t("selectTopic")}</Label>
                  <Select 
                    value={formData.topic} 
                    onValueChange={(value) => setFormData({ ...formData, topic: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectTopic")} />
                    </SelectTrigger>
                    <SelectContent>
                      {initialTopics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{topic.name}</span>
                            <Badge variant="secondary" className="ml-2">
                              {topic.subscriberCount || 0}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Message Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t("notificationTitle")} *</Label>
                  <Input
                    id="title"
                    placeholder="Enter notification title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">{t("priority")}</Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value: "normal" | "high") => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">{t("normal")}</SelectItem>
                      <SelectItem value="high">{t("high")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">{t("notificationBody")} *</Label>
                <Textarea
                  id="body"
                  placeholder="Enter notification message"
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">{t("notificationImage")}</Label>
                <Input
                  id="image"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image || ""}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>

              {/* Platform Settings */}
              <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 p-0">
                    <Settings className="h-4 w-4" />
                    Advanced Platform Settings
                    {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6 mt-4">
                  {/* Platform Toggles */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="android-enabled"
                        checked={formData.android?.enabled || false}
                        onCheckedChange={(checked) => 
                          setFormData({ 
                            ...formData, 
                            android: { ...formData.android, enabled: !!checked } 
                          })
                        }
                      />
                      <Label htmlFor="android-enabled">{t("android")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ios-enabled"
                        checked={formData.ios?.enabled || false}
                        onCheckedChange={(checked) => 
                          setFormData({ 
                            ...formData, 
                            ios: { ...formData.ios, enabled: !!checked } 
                          })
                        }
                      />
                      <Label htmlFor="ios-enabled">{t("ios")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="web-enabled"
                        checked={formData.web?.enabled || false}
                        onCheckedChange={(checked) => 
                          setFormData({ 
                            ...formData, 
                            web: { ...formData.web, enabled: !!checked } 
                          })
                        }
                      />
                      <Label htmlFor="web-enabled">{t("web")}</Label>
                    </div>
                  </div>

                  {/* Android Settings */}
                  {formData.android?.enabled && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">{t("androidSettings")}</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t("channelId")}</Label>
                          <Input
                            placeholder="default"
                            value={formData.android?.channelId || ""}
                            onChange={(e) => setFormData({
                              ...formData,
                              android: { ...formData.android, enabled: formData.android?.enabled || false, channelId: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t("color")}</Label>
                          <Input
                            placeholder="#FF0000"
                            value={formData.android?.color || ""}
                            onChange={(e) => setFormData({
                              ...formData,
                              android: { ...formData.android, enabled: formData.android?.enabled || false, color: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t("icon")}</Label>
                          <Input
                            placeholder="ic_notification"
                            value={formData.android?.icon || ""}
                            onChange={(e) => setFormData({
                              ...formData,
                              android: { ...formData.android, enabled: formData.android?.enabled || false, icon: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t("tag")}</Label>
                          <Input
                            placeholder="notification_tag"
                            value={formData.android?.tag || ""}
                            onChange={(e) => setFormData({
                              ...formData,
                              android: { ...formData.android, enabled: formData.android?.enabled || false, tag: e.target.value }
                            })}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* iOS Settings */}
                  {formData.ios?.enabled && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">{t("iosSettings")}</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t("badge")}</Label>
                          <Input
                            type="number"
                            placeholder="1"
                            value={formData.ios?.badge || ""}
                            onChange={(e) => setFormData({
                              ...formData,
                              ios: { ...formData.ios, enabled: formData.ios?.enabled || false, badge: parseInt(e.target.value) || undefined }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t("sound")}</Label>
                          <Input
                            placeholder="default"
                            value={formData.ios?.sound || ""}
                            onChange={(e) => setFormData({
                              ...formData,
                              ios: { ...formData.ios, enabled: formData.ios?.enabled || false, sound: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t("category")}</Label>
                          <Input
                            placeholder="GENERAL"
                            value={formData.ios?.category || ""}
                            onChange={(e) => setFormData({
                              ...formData,
                              ios: { ...formData.ios, enabled: formData.ios?.enabled || false, category: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t("threadId")}</Label>
                          <Input
                            placeholder="thread_id"
                            value={formData.ios?.threadId || ""}
                            onChange={(e) => setFormData({
                              ...formData,
                              ios: { ...formData.ios, enabled: formData.ios?.enabled || false, threadId: e.target.value }
                            })}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Web Settings */}
                  {formData.web?.enabled && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">{t("webSettings")}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>{t("link")}</Label>
                          <Input
                            placeholder="https://example.com"
                            value={formData.web?.link || ""}
                            onChange={(e) => setFormData({
                              ...formData,
                              web: { ...formData.web, enabled: formData.web?.enabled || false, link: e.target.value }
                            })}
                          />
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="require-interaction"
                              checked={formData.web?.requireInteraction || false}
                              onCheckedChange={(checked) => setFormData({
                                ...formData,
                                web: { ...formData.web, enabled: formData.web?.enabled || false, requireInteraction: !!checked }
                              })}
                            />
                            <Label htmlFor="require-interaction">{t("requireInteraction")}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="silent"
                              checked={formData.web?.silent || false}
                              onCheckedChange={(checked) => setFormData({
                                ...formData,
                                web: { ...formData.web, enabled: formData.web?.enabled || false, silent: !!checked }
                              })}
                            />
                            <Label htmlFor="silent">{t("silent")}</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Custom Data */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        {t("customData")}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addCustomDataField}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          {t("addData")}
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {customData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            placeholder={t("key")}
                            value={item.key}
                            onChange={(e) => updateCustomData(index, "key", e.target.value)}
                          />
                          <Input
                            placeholder={t("value")}
                            value={item.value}
                            onChange={(e) => updateCustomData(index, "value", e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeCustomDataField(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {customData.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No custom data fields added
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>

              {/* Send Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSendNotification}
                  disabled={isPending || !formData.title || !formData.body}
                  className="min-w-32"
                >
                  {isPending ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      {t("sending")}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {t("sendNotification")}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{t("topics")}</h2>
              <p className="text-muted-foreground">
                Manage notification topics and subscribers
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog open={showCreateTopic} onOpenChange={setShowCreateTopic}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {t("createTopic")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("createTopic")}</DialogTitle>
                    <DialogDescription>
                      Create a new topic for organizing notifications
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateTopic} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("topicName")} *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter topic name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">{t("topicDescription")}</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Enter topic description"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCreateTopic(false)}
                      >
                        {tCommon("cancel")}
                      </Button>
                      <Button type="submit" disabled={isPending}>
                        {isPending ? t("sending") : t("createTopic")}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={showSubscribeUsers} onOpenChange={setShowSubscribeUsers}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    {t("subscribeUsers")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{t("subscribeUsers")}</DialogTitle>
                    <DialogDescription>
                      Subscribe users to a topic for targeted notifications
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubscribeUsers} className="space-y-4">
                    <div className="space-y-2">
                      <Label>{t("selectTopic")}</Label>
                      <Select value={selectedTopicForSubscription} onValueChange={setSelectedTopicForSubscription}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectTopic")} />
                        </SelectTrigger>
                        <SelectContent>
                          {initialTopics.map((topic) => (
                            <SelectItem key={topic.id} value={topic.id}>
                              {topic.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("selectUsers")}</Label>
                      <div className="border rounded-md p-4 max-h-60 overflow-y-auto space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="subscribe-select-all"
                            checked={selectedUsers.length === initialUsers.length}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedUsers(initialUsers.map(u => u.id));
                              } else {
                                setSelectedUsers([]);
                              }
                            }}
                          />
                          <Label htmlFor="subscribe-select-all" className="font-medium">
                            Select All
                          </Label>
                        </div>
                        <Separator />
                        {initialUsers.map((user) => (
                          <div key={user.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`subscribe-${user.id}`}
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedUsers([...selectedUsers, user.id]);
                                } else {
                                  setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                                }
                              }}
                            />
                            <div className="flex-1">
                              <Label htmlFor={`subscribe-${user.id}`} className="text-sm font-normal">
                                {user.name}
                              </Label>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowSubscribeUsers(false);
                          setSelectedUsers([]);
                        }}
                      >
                        {tCommon("cancel")}
                      </Button>
                      <Button type="submit" disabled={isPending || !selectedTopicForSubscription}>
                        {isPending ? t("sending") : t("subscribeUsers")}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("topicName")}</TableHead>
                    <TableHead>{t("topicDescription")}</TableHead>
                    <TableHead>{t("subscriberCount")}</TableHead>
                    <TableHead className="w-[100px]">{tCommon("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialTopics.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Target className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No topics created yet</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowCreateTopic(true)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            {t("createTopic")}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    initialTopics.map((topic) => (
                      <TableRow key={topic.id}>
                        <TableCell className="font-medium">{topic.name}</TableCell>
                        <TableCell>{topic.description || "-"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {topic.subscriberCount || 0}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTopicForSubscription(topic.id);
                              setShowSubscribeUsers(true);
                            }}
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{t("history")}</h2>
              <p className="text-muted-foreground">
                View sent notification history and statistics
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={initialType || "all"}
                onValueChange={(value) => updateSearchParams({ type: value === "all" ? "" : value, page: "1" })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{tCommon("all")}</SelectItem>
                  <SelectItem value="broadcast">{t("broadcast")}</SelectItem>
                  <SelectItem value="users">{t("users")}</SelectItem>
                  <SelectItem value="topic">{t("topic")}</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={initialStartDate}
                onChange={(e) => updateSearchParams({ startDate: e.target.value, page: "1" })}
                className="w-40"
              />
              <Input
                type="date"
                value={initialEndDate}
                onChange={(e) => updateSearchParams({ endDate: e.target.value, page: "1" })}
                className="w-40"
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("notificationTitle")}</TableHead>
                    <TableHead>{t("type")}</TableHead>
                    <TableHead>{t("sentAt")}</TableHead>
                    <TableHead>{t("successCount")}</TableHead>
                    <TableHead>{t("failureCount")}</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialHistory?.notifications?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <History className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No notifications sent yet</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    initialHistory?.notifications?.map((notification: any) => (
                      <TableRow key={notification.id}>
                        <TableCell className="font-medium">{notification.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{notification.type}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(notification.sentAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {notification.successCount || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <XCircle className="h-4 w-4 text-red-500" />
                            {notification.failureCount || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={notification.status === "sent" ? "default" : "destructive"}
                          >
                            {notification.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination */}
          {initialHistory?.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={initialPage <= 1}
                onClick={() => updateSearchParams({ page: (initialPage - 1).toString() })}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {initialPage} of {initialHistory.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={initialPage >= initialHistory.totalPages}
                onClick={() => updateSearchParams({ page: (initialPage + 1).toString() })}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Broadcast Confirmation Dialog */}
      <Dialog open={showBroadcastConfirm} onOpenChange={setShowBroadcastConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Confirm Broadcast Notification
            </DialogTitle>
            <DialogDescription className="space-y-3">
              <p className="font-medium text-destructive">
                ⚠️ This action is NOT reversible!
              </p>
              <p>
                You are about to send a notification to <strong>ALL users</strong> in the system. 
                This cannot be undone once sent.
              </p>
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <p className="text-sm">
                  <strong>Notification Preview:</strong><br />
                  <span className="font-medium">Title:</span> {formData.title}<br />
                  <span className="font-medium">Message:</span> {formData.body}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to proceed?
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowBroadcastConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmBroadcast}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Yes, Send to All Users"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
