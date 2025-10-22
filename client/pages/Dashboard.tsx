import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Shield, Code2, LogOut, User, Lock, ExternalLink, Eye, Edit2, Trash2, Check, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ScriptSummary {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  codeLength: number;
  codePreview: string;
}

export default function Dashboard() {
  const [luaCode, setLuaCode] = useState("");
  const [scriptName, setScriptName] = useState("");
  const [isProtecting, setIsProtecting] = useState(false);
  const [userScripts, setUserScripts] = useState<ScriptSummary[]>([]);
  const [isLoadingScripts, setIsLoadingScripts] = useState(true);
  const [editingScriptId, setEditingScriptId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchUserScripts = async () => {
    if (!user?.id) return;

    try {
      setIsLoadingScripts(true);
      const response = await fetch(`/api/user/${user.id}/scripts`);
      if (response.ok) {
        const data = await response.json();
        setUserScripts(data.scripts);
      }
    } catch (error) {
      console.error('Error fetching user scripts:', error);
    } finally {
      setIsLoadingScripts(false);
    }
  };

  useEffect(() => {
    fetchUserScripts();
  }, [user?.id]);

  const handleProtectScript = async () => {
    if (!luaCode.trim()) {
      return;
    }

    setIsProtecting(true);

    try {
      // Send script to server for protection
      const response = await fetch("/api/protect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: luaCode,
          name: scriptName.trim() || `Script ${new Date().toLocaleDateString()}`,
          owner: user?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        const errorMessage = response.status === 413
          ? 'Script is too large. Please try with a smaller script.'
          : response.status === 400
          ? `Invalid request: ${errorData.error || 'Please check your script content'}`
          : response.status === 500
          ? 'Server error. Please try again later.'
          : `Failed to protect script (${response.status})`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const scriptId = data.scriptId;

      setIsProtecting(false);

      // Clear form
      setLuaCode("");
      setScriptName("");

      // Refresh the scripts list
      await fetchUserScripts();

      navigate(`/owner/${scriptId}`);
    } catch (error) {
      console.error("Error protecting script:", error);
      setIsProtecting(false);

      // Show detailed error message to user
      toast({
        title: "Failed to Protect Script",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleEditName = (script: ScriptSummary) => {
    setEditingScriptId(script.id);
    setEditingName(script.name);
  };

  const handleSaveName = async (scriptId: string) => {
    if (!user?.id || !editingName.trim()) return;

    try {
      const response = await fetch(`/api/script/${scriptId}/name`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingName.trim(),
          owner: user.id,
        }),
      });

      if (response.ok) {
        await fetchUserScripts();
        setEditingScriptId(null);
        setEditingName("");
        toast({
          title: "Script Renamed",
          description: "Script name has been updated successfully.",
        });
      } else {
        throw new Error('Failed to update script name');
      }
    } catch (error) {
      console.error('Error updating script name:', error);
      toast({
        title: "Error",
        description: "Failed to update script name. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingScriptId(null);
    setEditingName("");
  };

  const handleDeleteScript = async (scriptId: string, scriptName: string) => {
    if (!user?.id) return;

    if (!confirm(`Are you sure you want to delete "${scriptName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/script/${scriptId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner: user.id,
        }),
      });

      if (response.ok) {
        await fetchUserScripts();
        toast({
          title: "Script Deleted",
          description: `"${scriptName}" has been deleted successfully.`,
        });
      } else {
        throw new Error('Failed to delete script');
      }
    } catch (error) {
      console.error('Error deleting script:', error);
      toast({
        title: "Error",
        description: "Failed to delete script. Please try again.",
        variant: "destructive",
      });
    }
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
            <h1 className="text-xl font-bold text-white">defendlua</h1>
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
        <div className="max-w-6xl mx-auto">
          {/* My Scripts Section */}
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">My Protected Scripts</h2>
              <p className="text-gray-400">View and manage all your protected Lua scripts</p>
            </div>

            {isLoadingScripts ? (
              <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <Shield className="h-8 w-8 text-green-500 mx-auto mb-4 animate-pulse" />
                  <p className="text-gray-400">Loading your scripts...</p>
                </CardContent>
              </Card>
            ) : userScripts.length === 0 ? (
              <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <Code2 className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-white text-lg font-medium mb-2">No Scripts Yet</h3>
                  <p className="text-gray-400 mb-4">
                    You haven't protected any scripts yet. Create your first protected script below!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userScripts.map((script) => (
                  <Card key={script.id} className="border-gray-700 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="space-y-3">
                        {/* Script Name Row */}
                        <div className="flex items-center justify-between">
                          {editingScriptId === script.id ? (
                            <div className="flex items-center space-x-2 flex-1">
                              <Input
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="bg-gray-900/50 border-gray-600 text-white text-sm h-8"
                                placeholder="Script name"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveName(script.id);
                                  if (e.key === 'Escape') handleCancelEdit();
                                }}
                                autoFocus
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSaveName(script.id)}
                                className="h-8 w-8 p-0 text-green-400 hover:text-green-300"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancelEdit}
                                className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <h3 className="text-white font-medium text-sm truncate flex-1 mr-2">
                                {script.name}
                              </h3>
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditName(script)}
                                  className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                                  title="Edit name"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteScript(script.id, script.name)}
                                  className="h-8 w-8 p-0 text-gray-400 hover:text-red-400"
                                  title="Delete script"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Actions Row */}
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="bg-green-600 text-white text-xs">
                            {script.codeLength} chars
                          </Badge>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/owner/${script.id}`)}
                              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                              title="Manage script"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`/api/script/${script.id}/raw?owner=${encodeURIComponent(user?.id || "")}`, '_blank')}
                              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                              title="View raw script"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="bg-gray-900/50 rounded p-3 border border-gray-600">
                          <code className="text-gray-300 text-xs font-mono leading-relaxed block whitespace-pre-wrap">
                            {script.codePreview}
                          </code>
                        </div>
                        <div className="text-xs text-gray-500">
                          <div>Created: {new Date(script.createdAt).toLocaleDateString()}</div>
                          {script.updatedAt !== script.createdAt && (
                            <div>Updated: {new Date(script.updatedAt).toLocaleDateString()}</div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Script Protection Section */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              Protect New Lua Script
            </h2>
            <p className="text-gray-400">
              Upload your Lua code and we'll secure it with enterprise-grade
              protection
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Lock className="h-5 w-5 mr-2 text-green-500" />
                Script Protection Panel
              </CardTitle>
              <CardDescription className="text-gray-400">
                Upload your Lua script code for secure protection and
                management.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-yellow-500/50 bg-yellow-500/10">
                <AlertDescription className="text-yellow-400">
                  <strong>Note:</strong> We don't perform syntax validation on
                  your code. Please ensure your Lua script is error-free before
                  protecting it, as the code will be stored and served exactly
                  as you provide it.
                </AlertDescription>
              </Alert>

              <div className="space-y-6">
                {/* Script Name Input */}
                <div className="space-y-2">
                  <Label htmlFor="scriptName" className="text-sm font-medium text-gray-300">
                    Script Name
                  </Label>
                  <Input
                    id="scriptName"
                    placeholder="Enter a name for your script (optional)"
                    value={scriptName}
                    onChange={(e) => setScriptName(e.target.value)}
                    className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500"
                  />
                </div>

                {/* Script Code Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="luaCode" className="text-sm font-medium text-gray-300">
                      Lua Script Code
                    </Label>
                    <Badge
                      variant="secondary"
                      className="bg-gray-700 text-gray-300"
                    >
                      .lua
                    </Badge>
                  </div>

                  <Textarea
                    id="luaCode"
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
        </div>
      </main>
    </div>
  );
}
