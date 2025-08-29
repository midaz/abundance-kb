"use client"

import { useState, useEffect } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Lottie from "lottie-react"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [flagAnimationData, setFlagAnimationData] = useState(null)
  const [whoWeAreExpanded, setWhoWeAreExpanded] = useState(false)
  const [whatWeOfferExpanded, setWhatWeOfferExpanded] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Load Lottie animation data
  useEffect(() => {
    fetch('/flag-dark.json')
      .then(response => response.json())
      .then(data => setFlagAnimationData(data))
      .catch(error => console.error('Error loading flag animation:', error))
  }, [])

  return (
    <header className="border-b border-gray-800 shadow-sm font-hoves-condensed" style={{backgroundColor: '#1f1c17'}}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between" style={{height: '100px'}}>
          {/* Logo with animated flag */}
          <div className="flex items-center space-x-3">
            {/* Lottie Flag Animation */}
            <div className="w-20 h-12 relative overflow-hidden">
              {flagAnimationData ? (
                <Lottie 
                  animationData={flagAnimationData}
                  loop={true}
                  style={{ 
                    width: '120%', 
                    height: '100%',
                    marginLeft: '-10%',
                    marginRight: '-10%'
                  }}
                />
              ) : (
                // Fallback static flag if Lottie fails to load
                <div className="w-full h-full bg-gray-300 rounded animate-pulse"></div>
              )}
            </div>
            
            {/* Logo */}
            <div className="flex items-center">
              <a href="https://www.abundancenetwork.com/" target="_blank" rel="noopener noreferrer">
                <Image 
                  src="/logo.svg" 
                  alt="Abundance Elected" 
                  width={200}
                  height={50}
                  className="h-12 w-auto"
                />
              </a>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <button className="hover:text-gray-300 font-medium flex items-center gap-1" style={{color: '#fff5eb'}}>
                Who We Are
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <a href="https://abundanceelected.com/about-us/" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    About Us
                  </a>
                  <a href="https://www.abundancenetwork.com/" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Abundance Network
                  </a>
                </div>
              </div>
            </div>

            <div className="relative group">
              <button className="hover:text-gray-300 font-medium flex items-center gap-1" style={{color: '#fff5eb'}}>
                What We Offer
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <a href="https://abundanceelected.com/membership/" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Membership
                  </a>
                  <a href="https://abundanceelected.com/fellowship/" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Fellowship
                  </a>
                </div>
              </div>
            </div>

            <a 
              href="https://abundanceelected.com/member-home/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#ecfc79] text-black hover:bg-[#d9f05b] font-medium px-4 py-2 rounded-lg transition-colors"
            >
              MEMBER PORTAL
            </a>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-3 bg-[#ecfc79] hover:bg-[#d9f05b] text-black rounded-lg"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Overlay backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleMobileMenu} />
            
            {/* Mobile Menu */}
            <div className="fixed inset-0 z-50 md:hidden flex flex-col animate-in slide-in-from-top duration-300 overflow-hidden" style={{backgroundColor: '#1f1c17'}}>
              {/* Header with logo and close button */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-10 relative overflow-hidden">
                    {flagAnimationData ? (
                      <Lottie 
                        animationData={flagAnimationData}
                        loop={true}
                        style={{ 
                          width: '120%', 
                          height: '100%',
                          marginLeft: '-10%',
                          marginRight: '-10%'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 rounded animate-pulse"></div>
                    )}
                  </div>
                  
                  <a href="https://www.abundancenetwork.com/" target="_blank" rel="noopener noreferrer">
                    <Image 
                      src="/logo.svg" 
                      alt="Abundance Elected" 
                      width={160}
                      height={40}
                      className="h-10 w-auto"
                    />
                  </a>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMobileMenu}
                  className="p-2 bg-[#ecfc79] hover:bg-[#d9f05b] text-black rounded-lg"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Menu Content */}
              <div className="flex-1 px-6 py-8 space-y-8 w-full">
                {/* WHO WE ARE Section */}
                <div className="space-y-4">
                  <button 
                    className="flex items-center justify-between w-full"
                    onClick={() => setWhoWeAreExpanded(!whoWeAreExpanded)}
                  >
                    <h2 className="text-4xl font-bold tracking-wide font-hoves-condensed" style={{color: '#fff5eb'}}>
                      WHO WE ARE
                    </h2>
                    <ChevronDown 
                      className={`w-6 h-6 transition-transform duration-200 ${whoWeAreExpanded ? 'rotate-180' : ''}`} 
                      style={{color: '#fff5eb'}} 
                    />
                  </button>
                  
                  {whoWeAreExpanded && (
                    <div className="pl-6 space-y-4 animate-in slide-in-from-top duration-200">
                      <a 
                        href="https://abundanceelected.com/about-us/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block text-2xl font-medium tracking-wide font-hoves-condensed" 
                        style={{color: '#fff5eb'}}
                      >
                        About Us
                      </a>
                      <a 
                        href="https://www.abundancenetwork.com/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block text-2xl font-medium tracking-wide font-hoves-condensed" 
                        style={{color: '#fff5eb'}}
                      >
                        Abundance Network
                      </a>
                    </div>
                  )}
                </div>
                
                {/* WHAT WE OFFER Section */}
                <div className="space-y-4">
                  <button 
                    className="flex items-center justify-between w-full"
                    onClick={() => setWhatWeOfferExpanded(!whatWeOfferExpanded)}
                  >
                    <h2 className="text-4xl font-bold tracking-wide font-hoves-condensed" style={{color: '#fff5eb'}}>
                      WHAT WE OFFER
                    </h2>
                    <ChevronDown 
                      className={`w-6 h-6 transition-transform duration-200 ${whatWeOfferExpanded ? 'rotate-180' : ''}`} 
                      style={{color: '#fff5eb'}} 
                    />
                  </button>
                  
                  {whatWeOfferExpanded && (
                    <div className="pl-6 space-y-4 animate-in slide-in-from-top duration-200">
                      <a 
                        href="https://abundanceelected.com/membership/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block text-2xl font-medium tracking-wide font-hoves-condensed" 
                        style={{color: '#fff5eb'}}
                      >
                        Membership
                      </a>
                      <a 
                        href="https://abundanceelected.com/fellowship/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block text-2xl font-medium tracking-wide font-hoves-condensed" 
                        style={{color: '#fff5eb'}}
                      >
                        Fellowship
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="pt-8 w-full">
                  <a 
                    href="https://abundanceelected.com/member-home/"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-[#ecfc79] text-black hover:bg-[#d9f05b] font-bold text-lg py-4 rounded-lg font-hoves-condensed tracking-wide block text-center transition-colors"
                  >
                    MEMBER PORTAL
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
