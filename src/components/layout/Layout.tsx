import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  Home,
  Activity,
  Award,
  Lightbulb,
  BarChart3,
  User,
  Menu,
  X,
  Leaf
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navigationItems = [
  { name: "Dashboard", path: "/", icon: Home },
  { name: "Tracker", path: "/tracker", icon: Activity },
  { name: "Rewards", path: "/rewards", icon: Award },
  { name: "AI Insights", path: "/insights", icon: Lightbulb },
  { name: "Impact", path: "/impact", icon: BarChart3 },
  { name: "Profile", path: "/profile", icon: User },
];

export default function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPageActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent hidden sm:block">
                EcoTracker
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navigationItems.map((item) => {
                const isActive = isPageActive(item.path);
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path} className="relative">
                    <Button
                      variant="ghost"
                      className={`gap-2 rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.name}</span>
                    </Button>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-green-100 bg-white"
            >
              <div className="px-4 py-4 space-y-2">
                {navigationItems.map((item) => {
                  const isActive = isPageActive(item.path);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                          isActive
                            ? "bg-green-100 text-green-700"
                            : "text-gray-600 hover:bg-green-50"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">
        <Outlet /> {/* Nested routes render here */}
      </main>

      {/* Decorative Elements */}
      <div className="fixed top-20 right-10 w-64 h-64 bg-green-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-10 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
