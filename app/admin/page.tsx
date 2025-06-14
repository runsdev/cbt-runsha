"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Folder,
  FileText,
  Users,
  Lock,
  ChevronRight,
  BarChart,
} from "lucide-react";
import path from "path";

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const adminRoutes = [
    {
      id: "compile-tests",
      title: "Compile MDX Tests",
      description: "Create and compile MDX-based test content",
      icon: <FileText className="w-10 h-10 text-blue-500" />,
      path: "/admin/cbt/compile-tests",
    },
    {
      id: "manage-tests",
      title: "Manage Tests",
      description: "View, edit and organize your test catalog",
      icon: <Folder className="w-10 h-10 text-indigo-500" />,
      path: "/admin/cbt/manage",
    },
    {
      id: "session-management",
      title: "Session Management",
      description: "Manage student sessions and test assignments",
      icon: <Users className="w-10 h-10 text-red-500" />,
      path: "/admin/cbt/sessions",
    },
    {
      id: "monitoring",
      title: "Monitoring",
      description: "Monitor ongoing tests and student activities",
      icon: <Users className="w-10 h-10 text-purple-500" />,
      path: "/admin/cbt/monitoring",
    },
    {
      id: "test-results",
      title: "Test Results",
      description: "View analytics and student performance data",
      icon: <BarChart className="w-10 h-10 text-green-500" />,
      path: "/admin/cbt/results",
    },
    {
      id: "password-protection",
      title: "Password Protection",
      description: "Set and manage passwords for your tests",
      icon: <Lock className="w-10 h-10 text-amber-500" />,
      path: "/admin/cbt/set-password",
    },
  ];

  const filteredRoutes = adminRoutes.filter(
    (route) =>
      route.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full py-8 bg-gradient-to-b from-secondary/20 to-background/95 min-h-screen">
      <div className="w-full max-w-[80%] mx-auto px-4">
        <div className="flex flex-col gap-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your computer-based tests and view results
            </p>
          </div>

          {/* Search */}
          <div className="relative rounded-md shadow-sm max-w-md">
            <input
              type="text"
              className="block w-full pl-4 pr-10 py-3 border border-border/30 
                         bg-card rounded-lg 
                         text-foreground
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Search admin tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Admin tools grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoutes.map((route) => (
              <Link
                key={route.id}
                href={route.path}
                className="group bg-card rounded-xl 
                         border border-border/30 
                         shadow-md hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="p-6 border-b border-border/20">
                  <div className="flex justify-between items-center">
                    <div className="p-2 bg-muted/50 rounded-lg">
                      {route.icon}
                    </div>
                    <ChevronRight
                      className="w-5 h-5 text-muted-foreground group-hover:text-foreground
                               group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{route.title}</h3>
                  <p className="text-muted-foreground">{route.description}</p>
                </div>
              </Link>
            ))}
          </div>

          {filteredRoutes.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-12 text-center bg-accent/30 
                        rounded-xl border border-border/30 shadow-sm"
            >
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Tools Found</h3>
              <p className="text-muted-foreground max-w-md">
                No admin tools found matching your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
