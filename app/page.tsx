import {
  Brain,
  ImageIcon,
  MessageSquare,
  Sparkles,
  Video,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import AgentPulse from "./components/AgentPulse";
import YoutubeVideoForm from "./components/YoutubeVideoForm";

const features = [
  {
    title: "AI analysis",
    description:
      "Get deep insights into your video content with our advanced AI analysis. Understand viewer engagement and content quality",
    icon: Brain,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Smart Transcriptions",
    description:
      "Get accurate transcriptions of your videos. Perfect for creating subtitles, blog posts, or repurposing content",
    icon: MessageSquare,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Thumbnail Generation",
    description:
      "Generating eye-catching thumbnails using AI. Boost your click-through rates with compelling visuals",
    icon: ImageIcon,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    title: "Shot Script",
    description:
      "Get detailed, step-by-step instructions to recreate viral videos. Learn shooting techniques, angles, and editing from successful content",
    icon: Video,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    title: "Title Generation",
    description:
      "Create attention-grabing, SEO-optimised titles for your videos using AI. Maximize views with titles that resonate your audience",
    icon: MessageSquare,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    title: "Discuss with your AI agent",
    description:
      "Engage in deep conversations about your contnet strategy, brainstom ideas, unlock new creative possibilities with your AI agent companion",
    icon: Sparkles,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
];

const steps = [
  {
    title: "1. Connect your content",
    description: "Share your video URL and let your agent get to work.",
    icon: Video,
  },
  {
    title: "2. AI Agent Analysis",
    description: "Your personal agent analyses every aspect of your content.",
    icon: Brain,
  },
  {
    title: "3. Recieve Intelligence",
    description: "Get actionable insights and strategic recommendations.",
    icon: MessageSquare,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-12 md:py-24 bg-gradient-to-br from-white via-blue-50 to-indigo-50 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[length:20px_20px]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center gap-6 md:gap-10 text-center mb-8 md:mb-16 max-w-4xl mx-auto">
            <div className="animate-float">
              <AgentPulse size="large" color="blue" />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-4 md:mb-6">
              Meet Your Personal{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                AI Content Agent
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
              Transform your video content with AI-powered analysis,
              transcriptions, and insights. Get started in seconds.
            </p>
            <div className="w-full max-w-lg mx-auto shadow-lg rounded-2xl bg-white/70 backdrop-blur-sm p-2">
              <YoutubeVideoForm />
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-16 -left-16 w-32 md:w-64 h-32 md:h-64 bg-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-16 -right-16 w-32 md:w-64 h-32 md:h-64 bg-indigo-300/20 rounded-full blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Powerful features for content creators
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Everything you need to analyze, optimize, and elevate your content
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 group"
                >
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${feature.iconBg} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Meet Your AI Agent in 3 Simple Steps
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Getting started is quick and easy
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={index}
                  className="text-center p-8 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all relative z-10 border border-gray-100"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-3 hover:rotate-0 transition-all">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>

                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 right-0 w-16 h-1 bg-gray-200 translate-x-1/2"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
        <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -right-32 -top-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Ready to Meet Your AI Content Agent?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Join creators leveraging AI to unlock content insights and take
              your videos to the next level
            </p>
            {/* <a
              href="#analyze"
              className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-medium px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
            >
              Analyze Your First Video
            </a> */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <AgentPulse size="small" color="blue" />
                <span className="font-bold text-white text-xl">VideoMind</span>
              </div>
              <p className="text-sm text-gray-400 max-w-md">
                Empowering content creators with AI-powered tools for better
                video content
              </p>
            </div>

            <div className="text-center md:text-right">
              <p className="text-sm mb-2">Designed and developed by</p>
              <p className="text-lg font-semibold text-white mb-4">
                George Jere
              </p>
              <div className="flex items-center justify-center md:justify-end gap-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                    <path d="M9 18c-4.51 2-5-2-7-2"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-8 text-center text-sm text-gray-500">
            <p>
              © {new Date().getFullYear()} VideoMind by George Jere. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
