import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";
import { Package } from "lucide-react";
import apiClient from "@/lib/api";
import { setToken, setUser } from "@/lib/auth";

const Login = () => {
  const [email, setEmail] = useState("admin@dhlexpress.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Attempting login with:", { email, password });
      const response = await apiClient.login(email, password);
      console.log("Login response:", response);

      if (response.success && response.data) {
        // Make sure we have valid user data before storing
        if (response.data.token && response.data.user) {
          // Save token and user info
          setToken(response.data.token);
          setUser(response.data.user);

          toast({
            title: "Login successful",
            description: "Welcome to the admin dashboard",
          });

          // Force a delay before navigation to ensure state is updated
          setTimeout(() => {
            navigate("/admin", { replace: true });
          }, 100);
        } else {
          console.error("Invalid response data:", response.data);
          setError("Invalid response from server");
          toast({
            variant: "destructive",
            title: "Login failed",
            description: "Invalid response from server",
          });
        }
      } else {
        console.error("Login failed:", response.error);
        setError(response.error || "Invalid credentials");
        toast({
          variant: "destructive",
          title: "Login failed",
          description: response.error || "Invalid email or password",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login");
      toast({
        variant: "destructive",
        title: "Login error",
        description: "An error occurred during login. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-orange-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-orange-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Spinner className="mr-2" /> : null}
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
