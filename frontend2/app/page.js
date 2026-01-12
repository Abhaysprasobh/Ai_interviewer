// app/page.js
import Link from "next/link";
import { Sparkles, Users, Briefcase, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">Powered by AI Technology</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              The Future of
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                Smart Hiring
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              AI-powered interviews, intelligent resume analysis, and instant candidate matching.
              Hire faster, hire smarter.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/user/register"
                className="group px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-2"
              >
                I'm Looking for a Job
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/company/register"
                className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-500 transition-all transform hover:-translate-y-1 hover:shadow-2xl border-2 border-indigo-400"
              >
                I'm Hiring Talent
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/10">
              <div>
                <div className="text-4xl font-bold mb-2">10k+</div>
                <div className="text-slate-400">Job Seekers</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-slate-400">Companies</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">95%</div>
                <div className="text-slate-400">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose AI Hiring?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Cutting-edge technology that transforms the hiring experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title="AI-Powered Interviews"
              description="Automated technical interviews with real-time evaluation and instant feedback"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Smart Resume Analysis"
              description="Advanced AI analyzes resumes and matches candidates to job requirements"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Intelligent Matching"
              description="Our algorithm finds the perfect candidates for your open positions"
            />
          </div>
        </div>
      </section>

      {/* How It Works - Job Seekers */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              For Job Seekers
            </h2>
            <p className="text-xl text-slate-600">Simple, fast, and effective</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <StepCard number="1" title="Create Profile" description="Sign up and build your profile in minutes" />
            <StepCard number="2" title="Browse Jobs" description="Explore thousands of opportunities" />
            <StepCard number="3" title="AI Interview" description="Complete AI-powered interview" />
            <StepCard number="4" title="Get Hired" description="Receive offers from top companies" />
          </div>
        </div>
      </section>

      {/* How It Works - Companies */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              For Companies
            </h2>
            <p className="text-xl text-slate-600">Streamline your hiring process</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <StepCard number="1" title="Post Jobs" description="Create job listings in seconds" />
            <StepCard number="2" title="AI Screening" description="Automatic resume evaluation" />
            <StepCard number="3" title="Review Candidates" description="Access AI interview insights" />
            <StepCard number="4" title="Hire Faster" description="Make data-driven decisions" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl text-indigo-100 mb-12">
            Join thousands of companies and job seekers using AI to make better hiring decisions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/user/register"
              className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all"
            >
              Get Started as Job Seeker
            </Link>
            <Link
              href="/company/register"
              className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
            >
              Post Your First Job
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-8 hover:shadow-xl transition-all border border-slate-200">
      <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  );
}