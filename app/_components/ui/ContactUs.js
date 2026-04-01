import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";

export default function ContactUs() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="bg-[#2d2e3e] py-20 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          Get in <span className="text-[#2ecc91]">Touch</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Have a question about a job or want to partner with us? Our team is
          here to help you navigate the Swedish job market.
        </p>
      </section>

      {/* Main Contact Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 1. Contact Info Cards */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-[#2ecc91]/10 p-3 rounded-2xl">
                    <EnvelopeIcon className="h-6 w-6 text-[#2ecc91]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2d2e3e]">Email Us</h4>
                    <p className="text-sm text-gray-500">
                      support@rekreyta.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#2ecc91]/10 p-3 rounded-2xl">
                    <PhoneIcon className="h-6 w-6 text-[#2ecc91]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2d2e3e]">Call Us</h4>
                    <p className="text-sm text-gray-500">+46 70 000 00 00</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#2ecc91]/10 p-3 rounded-2xl">
                    <MapPinIcon className="h-6 w-6 text-[#2ecc91]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2d2e3e]">Visit Us</h4>
                    <p className="text-sm text-gray-500">Stockholm, Sweden</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-100">
                <h4 className="font-bold text-[#2d2e3e] mb-4 text-sm uppercase tracking-widest">
                  Follow Us
                </h4>
                <div className="flex gap-4">
                  {/* Social Icons Placeholder */}
                  <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-[#2ecc91] hover:text-white transition-all cursor-pointer">
                    <span className="font-bold text-xs">LN</span>
                  </div>
                  <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-[#2ecc91] hover:text-white transition-all cursor-pointer">
                    <span className="font-bold text-xs">TW</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3 focus:outline-none focus:border-[#2ecc91] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3 focus:outline-none focus:border-[#2ecc91] transition-colors"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-600">
                    Subject
                  </label>
                  <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3 focus:outline-none focus:border-[#2ecc91] transition-colors appearance-none">
                    <option>General Inquiry</option>
                    <option>Job Support</option>
                    <option>Partnership Request</option>
                    <option>Technical Issue</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-600">
                    Message
                  </label>
                  <textarea
                    rows="5"
                    placeholder="How can we help you?"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3 focus:outline-none focus:border-[#2ecc91] transition-colors resize-none"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <button className="w-full md:w-auto bg-[#2ecc91] text-[#2d2e3e] px-12 py-4 rounded-xl font-bold text-lg hover:bg-[#2d2e3e] hover:text-white transition-all shadow-lg shadow-[#2ecc91]/20 active:scale-95 flex items-center justify-center gap-2">
                    <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
