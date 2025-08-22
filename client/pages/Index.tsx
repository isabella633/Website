import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Code2, Lock, Zap, Users, Globe } from "lucide-react";

export default function Index() {
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
            <Link to="/login">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Shield className="h-20 w-20 text-green-500" />
              <Code2 className="h-10 w-10 text-green-400 absolute -bottom-2 -right-2" />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-white mb-6">
            Protect Your Lua Scripts with
            <span className="text-green-400 block">
              Enterprise-Grade Security
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Upload your Lua code and get instant protection with secure raw
            links. No syntax scanning, just pure protection for your valuable
            scripts.
          </p>

          <div className="flex justify-center space-x-4">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              >
                <Shield className="h-5 w-5 mr-2" />
                Start Protecting Scripts
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 px-8 py-3"
              >
                Sign In to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <Lock className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle className="text-white">Instant Protection</CardTitle>
              <CardDescription className="text-gray-400">
                Upload your .lua files and get immediate enterprise-grade
                protection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 space-y-2">
                <li>• No syntax error scanning</li>
                <li>• Secure script storage</li>
                <li>• Owner-only access control</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <Zap className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle className="text-white">Raw Link Access</CardTitle>
              <CardDescription className="text-gray-400">
                Get direct raw links to your protected Lua scripts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 space-y-2">
                <li>• Direct script URLs</li>
                <li>• Easy integration</li>
                <li>• Secure distribution</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <Users className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle className="text-white">Owner Panel</CardTitle>
              <CardDescription className="text-gray-400">
                Full control over your protected scripts with management tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 space-y-2">
                <li>• Edit script source code</li>
                <li>• Manage raw links</li>
                <li>• Script information</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">
            How LuaGuard Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="text-white font-medium mb-2">Sign Up</h3>
              <p className="text-gray-400 text-sm">
                Create your account in seconds
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="text-white font-medium mb-2">Upload Script</h3>
              <p className="text-gray-400 text-sm">
                Paste your .lua code (no syntax checking)
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="text-white font-medium mb-2">Protect Script</h3>
              <p className="text-gray-400 text-sm">
                Click protect and get instant security
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">4</span>
              </div>
              <h3 className="text-white font-medium mb-2">Manage & Share</h3>
              <p className="text-gray-400 text-sm">
                Access owner panel and get raw links
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-green-600/20 to-green-400/20 rounded-lg p-12 border border-green-500/30">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Protect Your Lua Scripts?
          </h2>
          <p className="text-gray-300 mb-6">
            Join thousands of developers who trust LuaGuard with their valuable
            code
          </p>
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              <Shield className="h-5 w-5 mr-2" />
              Get Started Free
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 bg-gray-800/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Shield className="h-6 w-6 text-green-500" />
                <Code2 className="h-3 w-3 text-green-400 absolute -bottom-1 -right-1" />
              </div>
              <span className="text-white font-medium">LuaGuard</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 LuaGuard. Protecting Lua scripts with enterprise-grade
              security.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
