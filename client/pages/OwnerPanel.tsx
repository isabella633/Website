import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Code2,
  LogOut,
  User,
  Copy,
  Save,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ScriptData {
  id: string;
  code: string;
  createdAt: string;
  owner: string;
}

export default function OwnerPanel() {
  const { scriptId } = useParams<{ scriptId: string }>();
  const [scriptData, setScriptData] = useState<ScriptData | null>(null);
  const [editedCode, setEditedCode] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const rawLink = `${window.location.origin}/api/script/${scriptId}/raw`;

  useEffect(() => {
    const fetchScriptData = async () => {
      if (scriptId && user?.id) {
        try {
          const response = await fetch(`/api/script/${scriptId}`);
          if (response.ok) {
            const data = (await response.json()) as ScriptData;
            if (data.owner === user.id) {
              setScriptData(data);
              setEditedCode(data.code);
            } else {
              navigate("/dashboard");
            }
          } else {
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Error fetching script data:", error);
          navigate("/dashboard");
        }
      }
    };

    fetchScriptData();
  }, [scriptId, user, navigate]);

  const handleSave = async () => {
    if (!scriptData || !user?.id) return;

    setIsSaving(true);

    try {
      const response = await fetch(`/api/script/${scriptId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: editedCode,
          owner: user.id,
        }),
      });

      if (response.ok) {
        const updatedData = (await response.json()) as ScriptData;
        setScriptData(updatedData);
        setIsSaving(false);

        toast({
          title: "Script Updated",
          description: "Your Lua script has been successfully updated.",
        });
      } else {
        throw new Error("Failed to save script");
      }
    } catch (error) {
      console.error("Error saving script:", error);
      setIsSaving(false);
      toast({
        title: "Error",
        description: "Failed to save script. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!scriptData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-green-500 animate-pulse" />
          <p>Loading script data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/dashboard" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="relative">
              <Shield className="h-8 w-8 text-green-500" />
              <Code2 className="h-4 w-4 text-green-400 absolute -bottom-1 -right-1" />
            </div>
            <h1 className="text-xl font-bold text-white">defendlua</h1>
            <Badge variant="secondary" className="bg-green-600 text-white">
              Owner Panel
            </Badge>
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
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Script Management
            </h2>
            <p className="text-gray-400">
              Manage your protected Lua script and access raw links
            </p>
          </div>

          <Tabs defaultValue="editor" className="space-y-6">
            <TabsList className="bg-gray-800 border-gray-700">
              <TabsTrigger
                value="editor"
                className="data-[state=active]:bg-green-600"
              >
                Script Editor
              </TabsTrigger>
              <TabsTrigger
                value="links"
                className="data-[state=active]:bg-green-600"
              >
                Raw Links
              </TabsTrigger>
              <TabsTrigger
                value="info"
                className="data-[state=active]:bg-green-600"
              >
                Script Info
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor">
              <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">
                    Edit Script Source Code
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Modify your Lua script. Changes are saved securely.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={editedCode}
                    onChange={(e) => setEditedCode(e.target.value)}
                    className="min-h-[400px] bg-gray-900/50 border-gray-600 text-white font-mono text-sm"
                    style={{
                      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                    }}
                  />

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      Code length: {editedCode.length} characters
                    </div>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving || editedCode === scriptData.code}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSaving ? (
                        <>
                          <Save className="h-4 w-4 mr-2 animate-pulse" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="links">
              <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">
                    Raw Script Access
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Direct links to access your Lua script content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Raw Link URL</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={rawLink}
                        readOnly
                        className="bg-gray-900/50 border-gray-600 text-white font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(rawLink, "Raw link")}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(rawLink, "_blank")}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Alert className="border-blue-500/50 bg-blue-500/10">
                    <AlertDescription className="text-blue-400">
                      This raw link displays your Lua script directly in the
                      browser. Share it carefully as anyone with this link can
                      view your script content.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="info">
              <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">
                    Script Information
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Details about your protected script
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Script ID</Label>
                      <div className="flex space-x-2 mt-1">
                        <Input
                          value={scriptData.id}
                          readOnly
                          className="bg-gray-900/50 border-gray-600 text-white font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(scriptData.id, "Script ID")
                          }
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300">Created</Label>
                      <Input
                        value={new Date(scriptData.createdAt).toLocaleString()}
                        readOnly
                        className="bg-gray-900/50 border-gray-600 text-white mt-1"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">
                          Protection Status
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Your script is protected and accessible only to you
                        </p>
                      </div>
                      <Badge className="bg-green-600 text-white">
                        <Shield className="h-3 w-3 mr-1" />
                        Protected
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
