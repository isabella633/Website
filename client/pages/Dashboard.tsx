import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, Code2, LogOut, User, Lock } from "lucide-react";

export default function Dashboard() {
  const [luaCode, setLuaCode] = useState("");
  const [isProtecting, setIsProtecting] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleProtectScript = async () => {
    if (!luaCode.trim()) {
      return;
    }

    setIsProtecting(true);

    // Simulate protection process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate a script ID and navigate to owner panel
    const scriptId = Math.random().toString(36).substr(2, 12);

    // Store the script data (in a real app, this would be sent to a server)
    const scriptData = {
      id: scriptId,
      code: luaCode,
      createdAt: new Date().toISOString(),
      owner: user?.id,
    };

    localStorage.setItem(`script_${scriptId}`, JSON.stringify(scriptData));
    setIsProtecting(false);

    navigate(`/owner/${scriptId}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Shield className="h-8 w-8 text-green-500" />
              <Code2 className="h-4 w-4 text-green-400 absolute -bottom-1 -right-1" />
            </div>
            <h1 className="text-xl font-bold text-white">LuaGuard</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300">{user?.username}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-400 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              Protect Your Lua Script
            </h2>
            <p className="text-gray-400">
              Upload your Lua code and we'll secure it with enterprise-grade
              protection
            </p>
          </div>

          <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Lock className="h-5 w-5 mr-2 text-green-500" />
                Script Protection Panel
              </CardTitle>
              <CardDescription className="text-gray-400">
                Upload your Lua script code for secure protection and management.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-yellow-500/50 bg-yellow-500/10">
                <AlertDescription className="text-yellow-400">
                  <strong>Note:</strong> We don't perform syntax validation on your code. Please ensure your Lua script is error-free before protecting it, as the code will be stored and served exactly as you provide it.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">
                    Lua Script Code
                  </label>
                  <Badge
                    variant="secondary"
                    className="bg-gray-700 text-gray-300"
                  >
                    .lua
                  </Badge>
                </div>

                <Textarea
                  placeholder={`-- Enter your Lua code here
-- Example:
local function hello()
    print("Hello, World!")
end

hello()`}
                  value={luaCode}
                  onChange={(e) => setLuaCode(e.target.value)}
                  className="min-h-[300px] bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 font-mono text-sm"
                  style={{
                    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  }}
                />
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleProtectScript}
                  disabled={!luaCode.trim() || isProtecting}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                  size="lg"
                >
                  {isProtecting ? (
                    <>
                      <Shield className="h-5 w-5 mr-2 animate-pulse" />
                      Protecting Script...
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5 mr-2" />
                      Protect Script
                    </>
                  )}
                </Button>
              </div>

              {luaCode.trim() && (
                <div className="text-center text-sm text-gray-400">
                  Code length: {luaCode.length} characters
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
