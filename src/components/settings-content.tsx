"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Moon, Sun, Monitor, Bell, Shield, Globe, Save } from "lucide-react"

export function SettingsContent() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    trading: true,
    dividends: true,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSave = () => {
    // Save settings logic here
    console.log("Settings saved")
  }

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account preferences and application settings</p>
      </div>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize the look and feel of the application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Theme</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Choose between light and dark theme. Dark theme uses a custom gradient background.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div
                className={`relative cursor-pointer rounded-lg border-2 p-4 ${
                  theme === "light" ? "border-primary" : "border-muted"
                }`}
                onClick={() => setTheme("light")}
              >
                <div className="flex items-center justify-center h-20 bg-white rounded border">
                  <Sun className="h-8 w-8 text-yellow-500" />
                </div>
                <p className="text-center mt-2 text-sm font-medium">Light</p>
              </div>

              <div
                className={`relative cursor-pointer rounded-lg border-2 p-4 ${
                  theme === "dark" ? "border-primary" : "border-muted"
                }`}
                onClick={() => setTheme("dark")}
              >
                <div
                  className="flex items-center justify-center h-20 rounded border"
                  style={{ background: "linear-gradient(135deg, #09172C 0%, #061023 100%)" }}
                >
                  <Moon className="h-8 w-8 text-blue-300" />
                </div>
                <p className="text-center mt-2 text-sm font-medium">Dark</p>
                <p className="text-center text-xs text-muted-foreground">Custom Gradient</p>
              </div>

              <div
                className={`relative cursor-pointer rounded-lg border-2 p-4 ${
                  theme === "system" ? "border-primary" : "border-muted"
                }`}
                onClick={() => setTheme("system")}
              >
                <div className="flex items-center justify-center h-20 bg-gradient-to-r from-white to-gray-800 rounded border">
                  <Monitor className="h-8 w-8 text-gray-600" />
                </div>
                <p className="text-center mt-2 text-sm font-medium">System</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Configure how you receive updates and alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive important updates via email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Get real-time alerts in your browser</p>
              </div>
              <Switch
                id="push-notifications"
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, push: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="trading-alerts">Trading Alerts</Label>
                <p className="text-sm text-muted-foreground">Notifications for order fills and market changes</p>
              </div>
              <Switch
                id="trading-alerts"
                checked={notifications.trading}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, trading: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dividend-alerts">Dividend Notifications</Label>
                <p className="text-sm text-muted-foreground">Alerts for dividend payments and distributions</p>
              </div>
              <Switch
                id="dividend-alerts"
                checked={notifications.dividends}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, dividends: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Network Configuration
          </CardTitle>
          <CardDescription>Configure Hedera network and connection settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="network">Hedera Network</Label>
              <Select defaultValue="testnet">
                <SelectTrigger>
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="testnet">Testnet</SelectItem>
                  <SelectItem value="mainnet">Mainnet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mirror-node">Mirror Node URL</Label>
              <Input
                id="mirror-node"
                placeholder="https://testnet.mirrornode.hedera.com"
                defaultValue="https://testnet.mirrornode.hedera.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ipfs-gateway">IPFS Gateway</Label>
            <Input
              id="ipfs-gateway"
              placeholder="https://gateway.pinata.cloud"
              defaultValue="https://gateway.pinata.cloud"
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>Manage your security preferences and wallet settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-disconnect Wallet</Label>
                <p className="text-sm text-muted-foreground">Automatically disconnect wallet after inactivity</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Transaction Confirmations</Label>
                <p className="text-sm text-muted-foreground">Require confirmation for all transactions</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Session Timeout</Label>
            <Select defaultValue="30">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
