"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Building2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Floating elements for visual appeal */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-chart-2/10 rounded-full blur-2xl"></div>
        </div>
        
        <Card className="relative text-center border-2 shadow-xl backdrop-blur-sm bg-card/80">
          <CardContent className="pt-8 pb-8 px-6">
            {/* Logo with brand colors */}
            <div className="mb-8 flex justify-center">
              <div className="relative w-24 h-24 mx-auto p-2 rounded-2xl bg-gradient-to-br from-primary/10 to-chart-2/20 border border-primary/20">
                <Image
                  src="/logo.png"
                  alt="Bellat Logo"
                  fill
                  className="object-contain p-2"
                  priority
                />
              </div>
            </div>

            {/* Brand name */}
            <div className="mb-4 flex items-center justify-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">Bellat</span>
            </div>

            {/* Error Code */}
            <div className="mb-6">
              <h1 className="text-8xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent mb-2">
                404
              </h1>
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                Page Not Found
              </h2>
              <p className="text-muted-foreground mb-6">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button asChild className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary" size="lg">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-primary/20 hover:bg-primary/5" 
                size="lg"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
