import {
  UserPlusIcon,
  DocumentArrowUpIcon,
  PaperAirplaneIcon,
  PlusCircleIcon,
  CursorArrowRaysIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

export default function HowItWorks() {
  return (
    <section className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-[#2d2e3e] mb-4">
            How it Works
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Your journey to a new career in Sweden, simplified into three easy
            steps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* For Candidates Section */}
          <div className="space-y-10">
            <h3 className="text-2xl font-bold text-[#2ecc91] flex items-center gap-3">
              <span className="bg-[#2ecc91]/10 px-4 py-1 rounded-full text-sm uppercase tracking-widest">
                For Candidates
              </span>
            </h3>

            <div className="space-y-8 relative">
              {/* الخط الواصل بين الخطوات */}
              <div className="absolute left-7 top-0 bottom-0 w-px bg-dashed border-l border-gray-200 z-0"></div>

              {/* Step 1 */}
              <div className="relative z-10 flex items-start gap-6 group">
                <div className="flex-shrink-0 w-14 h-14 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:border-[#2ecc91] transition-colors">
                  <UserPlusIcon className="h-7 w-7 text-gray-400 group-hover:text-[#2ecc91]" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#2d2e3e] mb-1">
                    Create Account
                  </h4>
                  <p className="text-gray-500 text-sm">
                    Sign up in seconds and build your professional profile to
                    get noticed by top Swedish firms.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex items-start gap-6 group">
                <div className="flex-shrink-0 w-14 h-14 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:border-[#2ecc91] transition-colors">
                  <DocumentArrowUpIcon className="h-7 w-7 text-gray-400 group-hover:text-[#2ecc91]" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#2d2e3e] mb-1">
                    Upload CV
                  </h4>
                  <p className="text-gray-500 text-sm">
                    Add your resume and portfolio. Our smart system will match
                    you with roles that fit your skills.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex items-start gap-6 group">
                <div className="flex-shrink-0 w-14 h-14 bg-[#2ecc91] rounded-2xl flex items-center justify-center shadow-lg shadow-[#2ecc91]/20">
                  <PaperAirplaneIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#2d2e3e] mb-1">
                    Apply & Get Hired
                  </h4>
                  <p className="text-gray-500 text-sm">
                    One-click apply to your favorite jobs and start your
                    interview process directly with employers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* For Employers Section */}
          <div className="space-y-10">
            <h3 className="text-2xl font-bold text-[#2d2e3e] flex items-center gap-3">
              <span className="bg-[#2d2e3e]/10 px-4 py-1 rounded-full text-sm uppercase tracking-widest text-[#2d2e3e]">
                For Employers
              </span>
            </h3>

            <div className="space-y-8 relative">
              <div className="absolute left-7 top-0 bottom-0 w-px bg-dashed border-l border-gray-200 z-0"></div>

              {/* Step 1 */}
              <div className="relative z-10 flex items-start gap-6 group">
                <div className="flex-shrink-0 w-14 h-14 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:border-[#2d2e3e] transition-colors">
                  <PlusCircleIcon className="h-7 w-7 text-gray-400 group-hover:text-[#2d2e3e]" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#2d2e3e] mb-1">
                    Post a Job
                  </h4>
                  <p className="text-gray-500 text-sm">
                    Fill in your job details and requirements to reach thousands
                    of qualified talents in Sweden.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex items-start gap-6 group">
                <div className="flex-shrink-0 w-14 h-14 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:border-[#2d2e3e] transition-colors">
                  <CursorArrowRaysIcon className="h-7 w-7 text-gray-400 group-hover:text-[#2d2e3e]" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#2d2e3e] mb-1">
                    Review Talent
                  </h4>
                  <p className="text-gray-500 text-sm">
                    Browse through top-tier candidates and use our dashboard to
                    manage applications efficiently.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex items-start gap-6 group">
                <div className="flex-shrink-0 w-14 h-14 bg-[#2d2e3e] rounded-2xl flex items-center justify-center shadow-lg shadow-black/20">
                  <ChatBubbleLeftRightIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#2d2e3e] mb-1">
                    Start Hiring
                  </h4>
                  <p className="text-gray-500 text-sm">
                    Connect with the best matches and build your dream team with
                    ease.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
