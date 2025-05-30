import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { User, CreditCard, Settings, FileText, Wallet } from "lucide-react";
import MainNavigation from "../components/MainNavigation";

const Profile = () => {
  // const [profile,setProfile] = useState({})
  // Sample user data - in a real app, this would come from an API or auth context
  const user = {
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    joinedOn: "May 2023",
    avatarUrl: "",
    clientId: "TRAD123456",
    accountType: "Equity & F&O",
    kycStatus: "Complete",
    tradingExperience: "Intermediate",
    preferredMarkets: ["Equity", "F&O", "Currency"],
    bankDetails: {
      bankName: "HDFC Bank",
      accountNumber: "XXXX-XXXX-7890",
      ifscCode: "HDFC0001234",
      accountType: "Savings",
    },
    contactDetails: {
      phone: "+91 98765 43210",
      address: "123 Trading Street, Financial District, Mumbai - 400001",
      panCard: "ABCDE1234F",
    },
  };
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:8000/trade/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: sessionStorage.getItem("email") }),
      });
      const response = await res.json();
      console.log(response);
      setProfile(response);

      // Handle response, e.g., res.json() or res.text() if needed
    };

    fetchData();
  }, []);

  if (!profile) return <p>Loading...</p>;
  // console.log(profile.message.data.name);

  return (
    <div>
      <MainNavigation />
      <div className="p-4 sm:p-6 md:p-8 animate-fade-in">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
            {/* <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Summary Card */}
            <Card className="md:col-span-1 shadow-md">
              <CardHeader className="space-y-4 flex flex-col items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="text-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-xl font-semibold">
                    {profile.message.data.name}
                  </h2>
                  {/* <p className="text-muted-foreground text-sm">
                    {profile.name}
                  </p> */}
                  {/* <p className="text-xs text-muted-foreground mt-1">
                    Member since {user.joinedOn}
                  </p> */}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm text-muted-foreground">
                      Client ID
                    </span>
                    <span className="font-medium">
                      {profile.message.data.clientcode || user.clientId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm text-muted-foreground">
                      Account Type
                    </span>
                    <span className="font-medium">{user.accountType}</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm text-muted-foreground">
                      KYC Status
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {user.kycStatus}
                    </span>
                  </div>
                  {/* <div className="pt-2">
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-start"
                        size="sm"
                      >
                        <Wallet className="mr-2 h-4 w-4" />
                        Fund Transfer
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-start"
                        size="sm"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Manage Cards
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-start"
                        size="sm"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Documents
                      </Button>
                    </div>
                  </div> */}
                </div>
              </CardContent>
            </Card>

            {/* Details Tabs */}
            <Card className="md:col-span-2 shadow-md">
              <CardContent className="p-0">
                <Tabs defaultValue="details">
                  <TabsList className="w-full grid grid-cols-3 mb-0 rounded-none rounded-t-lg">
                    <TabsTrigger value="details">
                      <User className="h-4 w-4 mr-2" />
                      Personal Details
                    </TabsTrigger>
                    <TabsTrigger value="bank">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Account Details
                    </TabsTrigger>
                    <TabsTrigger value="trading">
                      <Settings className="h-4 w-4 mr-2" />
                      Trading Profile
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="p-6 pt-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">
                          Contact Information
                        </h3>
                        <div className="mt-3 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Phone Number
                              </p>
                              <p>
                                {profile.message.data.mobileno ||
                                  user.contactDetails.phone}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Email Address
                              </p>
                              <p>{sessionStorage.getItem("email")}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Name
                              </p>
                              <p>{profile.message.data.name}</p>
                            </div>
                          </div>

                          {/* <div className="pt-2">
                            <p className="text-sm font-medium text-muted-foreground">
                              Address
                            </p>
                            <p className="mt-1">
                              {user.contactDetails.address}
                            </p>
                          </div> */}
                        </div>
                      </div>

                      {/* <div className="flex justify-end pt-4">
                        <Button variant="outline" size="sm">
                          Update Contact Details
                        </Button>
                      </div> */}
                    </div>
                  </TabsContent>

                  <TabsContent value="bank" className="p-6 pt-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">
                          Demat Account Details
                        </h3>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Available Cash
                            </p>
                            <p>{profile.rms.data.availablecash}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Net Balance
                            </p>
                            <p>{profile.rms.data.net}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Available Intraday payin
                            </p>
                            <p>{profile.rms.data.availableintradaypayin}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Available limit margin
                            </p>
                            <p>{profile.rms.data.availablelimitmargin}</p>
                          </div>
                        </div>
                      </div>

                      {/* <div className="flex justify-end pt-4">
                        <Button variant="outline" size="sm">
                          Manage Bank Accounts
                        </Button>
                      </div> */}
                    </div>
                  </TabsContent>

                  {/* <TabsContent value="trading" className="p-6 pt-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">
                          Trading Preferences
                        </h3>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Trading Experience
                            </p>
                            <p>{user.tradingExperience}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Preferred Markets
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {user.preferredMarkets.map((market) => (
                                <span
                                  key={market}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                                >
                                  {market}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Risk Appetite
                          </h4>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div
                              className="bg-indigo-500 h-2.5 rounded-full dark:bg-indigo-500"
                              style={{ width: "65%" }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Conservative</span>
                            <span>Moderate</span>
                            <span>Aggressive</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button variant="outline" size="sm">
                          Update Trading Preferences
                        </Button>
                      </div>
                    </div>
                  </TabsContent> */}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
