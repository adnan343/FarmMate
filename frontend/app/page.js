import {
    ArrowRight,
    Calendar,
    CheckCircle,
    Globe,
    Leaf,
    LineChart,
    Shield,
    Star,
    Store,
    TrendingUp,
    Users
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <nav className="container mx-auto flex justify-between items-center p-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
              FarmMate
            </span>
          </Link>
          <div className="hidden sm:flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-teal-600 transition-colors font-medium text-sm sm:text-base whitespace-nowrap">
              Features
            </a>
            <a href="#about" className="text-gray-600 hover:text-teal-600 transition-colors font-medium text-sm sm:text-base whitespace-nowrap">
              About
            </a>
            <Link href="/login" className="text-gray-600 hover:text-teal-600 transition-colors font-medium text-sm sm:text-base whitespace-nowrap">
              Login
            </Link>
            <Link href="/register" className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 sm:px-6 py-2 rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 text-sm sm:text-base whitespace-nowrap">
              Get Started
            </Link>
          </div>
          {/* Mobile navigation */}
          <div className="sm:hidden flex items-center gap-3">
            <Link href="/login" className="text-gray-600 hover:text-teal-600 transition-colors font-medium text-sm whitespace-nowrap">
              Login
            </Link>
            <Link href="/register" className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 text-sm whitespace-nowrap">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-blue-50 py-12 sm:py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%2306b6d4&quot; fill-opacity=&quot;0.05&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
                <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Trusted by 10,000+ farmers worldwide</span>
                <span className="sm:hidden">10,000+ farmers</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  The Future of
                </span>
                <br />
                <span className="text-gray-900">Farming is Here</span>
              </h1>
              <p className="text-base sm:text-xl text-gray-600 leading-relaxed max-w-2xl">
                FarmMate revolutionizes agriculture with AI-powered insights, smart crop management, 
                and a thriving marketplace connecting farmers and buyers worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/register" className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:shadow-xl hover:shadow-teal-500/25 transition-all duration-300 flex items-center justify-center gap-2 group">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#demo" className="border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:border-teal-500 hover:text-teal-600 transition-all duration-300 text-center">
                  Watch Demo
                </a>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  Free 30-day trial
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100">
                <div className="bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white mb-4 sm:mb-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold">Smart Analytics</h3>
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span>Rice Yield</span>
                      <span className="font-semibold">+24%</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span>Water Efficiency</span>
                      <span className="font-semibold">+18%</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span>Cost Reduction</span>
                      <span className="font-semibold">-12%</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-teal-100 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-teal-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Planting Calendar</h4>
                    <p className="text-xs sm:text-sm text-gray-600">AI-optimized schedules</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
                      <LineChart className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Real-time Data</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Live farm monitoring</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
              From AI-powered insights to marketplace connections, FarmMate provides the complete toolkit 
              for modern agriculture.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-green-100 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Smart Planning</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6">
                Receive AI-powered crop suggestions and dynamic planting calendars tailored to your farm&apos;s unique conditions and local weather patterns.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  Weather-optimized schedules
                </li>
                <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  Crop rotation planning
                </li>
                <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  Resource optimization
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-blue-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <LineChart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Data-Driven Analytics</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6">
                Track your finances, manage tasks, and get accurate crop yield predictions to maximize profitability with advanced analytics.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                  Real-time monitoring
                </li>
                <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                  Predictive analytics
                </li>
                <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                  Financial insights
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-purple-100 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Store className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Thriving Marketplace</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6">
                Connect directly with buyers to sell your produce, or source high-quality products from other trusted farmers in our secure marketplace.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                  Direct buyer connections
                </li>
                <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                  Secure transactions
                </li>
                <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                  Quality assurance
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">10,000+</div>
              <div className="text-teal-100 text-xs sm:text-sm">Active Farmers</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">50+</div>
              <div className="text-teal-100 text-xs sm:text-sm">Countries</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">$2.5M</div>
              <div className="text-teal-100 text-xs sm:text-sm">Revenue Generated</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">98%</div>
              <div className="text-teal-100 text-xs sm:text-sm">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              How FarmMate Works
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-white text-xl sm:text-2xl font-bold">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Create Your Profile</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Sign up and tell us about your farm. Our AI will analyze your location, soil type, and climate to provide personalized recommendations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-white text-xl sm:text-2xl font-bold">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Get Smart Insights</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Receive AI-powered crop suggestions, weather alerts, and market analysis to optimize your farming decisions and maximize yields.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-white text-xl sm:text-2xl font-bold">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Connect & Sell</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Join our marketplace to connect with buyers, sell your produce at competitive prices, and grow your business with trusted partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">
              Ready to Transform Your Farming?
            </h2>
            <p className="text-base sm:text-xl text-teal-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join thousands of farmers who are already using FarmMate to increase yields, reduce costs, and grow their businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/register" className="bg-white text-teal-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                Start Free Trial
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link href="/login" className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-white hover:text-teal-600 transition-all duration-300">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                  <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold">FarmMate</span>
              </div>
              <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
                Revolutionizing agriculture with AI-powered insights and smart farming solutions.
              </p>
              <div className="flex gap-3 sm:gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h3>
              <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h3>
              <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h3>
              <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
            <p>&copy; 2025 FarmMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}