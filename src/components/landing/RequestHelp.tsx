import React, { useState } from "react";
import { ArrowRight, Shield, CheckCircle2, AlertCircle, Send, User, Mail, Phone, Tag, FileText } from "lucide-react";
import { aegisAudio } from "../../audio/AegisAudioEngine";

interface RequestHelpProps {
  onRequestAegis?: () => void;
}

export const RequestHelp: React.FC<RequestHelpProps> = ({ onRequestAegis }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    requestType: "Emergency Protection",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.email || !formData.email.includes("@")) {
      setSubmitStatus("error");
      setFeedbackMessage("Unable to submit your request right now. Please enter a valid email address.");
      return;
    }

    if (!formData.message.trim()) {
      setSubmitStatus("error");
      setFeedbackMessage("Unable to submit your request right now. Please enter your request message.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setFeedbackMessage("");
    aegisAudio.ensureContext();
    aegisAudio.playLaserScan();

    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          clientTimestamp: new Date().toISOString(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        aegisAudio.playImpact();
        setSubmitStatus("success");
        setFeedbackMessage(data.message || "Request submitted successfully. We will get back to you soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          requestType: "Emergency Protection",
          subject: "",
          message: "",
        });
      } else {
        setSubmitStatus("error");
        setFeedbackMessage(data.error || "Unable to submit your request right now. Please try again.");
        aegisAudio.playImpact();
      }
    } catch {
      setSubmitStatus("error");
      setFeedbackMessage("Unable to submit your request right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="request-help"
      className="relative py-28 px-6 md:px-12 bg-gradient-to-b from-[#080D14] to-[#050608] border-t border-white/5 overflow-hidden"
    >
      {/* Background Volumetric Flare */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-600/10 via-red-600/10 to-transparent blur-3xl pointer-events-none left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-600/30 to-red-600/30 border border-blue-500/40 flex items-center justify-center shadow-[0_0_35px_rgba(37,99,255,0.4)]">
            <Shield className="w-7 h-7 text-white" />
          </div>

          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#2563FF] font-semibold block">
            SECURE DIRECT CHANNEL
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white font-sans tracking-tight">
            NEED AEGIS?
          </h2>
          <p className="text-sm md:text-base text-[#8A99AD] max-w-xl mx-auto">
            Your message could be the first step toward getting help. Transmit your request directly to AEGIS Command.
          </p>
        </div>

        {/* Existing Request Submission Form */}
        <div className="p-6 md:p-8 rounded-3xl glass-panel-glow border border-blue-500/30 shadow-[0_15px_45px_rgba(0,0,0,0.7)] backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[#8A99AD] uppercase tracking-wider block text-[10px]">
                  Citizen Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-[#050608]/80 border border-white/10 text-white placeholder-[#8A99AD]/40 focus:outline-none focus:border-blue-500/60 transition-all font-sans text-sm"
                  />
                  <User className="w-4 h-4 text-[#8A99AD]/40 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#8A99AD] uppercase tracking-wider block text-[10px]">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-[#050608]/80 border border-white/10 text-white placeholder-[#8A99AD]/40 focus:outline-none focus:border-blue-500/60 transition-all font-sans text-sm"
                  />
                  <Mail className="w-4 h-4 text-[#8A99AD]/40 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            {/* Row 2: Phone & Request Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[#8A99AD] uppercase tracking-wider block text-[10px]">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="e.g. +1 555 0199"
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-[#050608]/80 border border-white/10 text-white placeholder-[#8A99AD]/40 focus:outline-none focus:border-blue-500/60 transition-all font-sans text-sm"
                  />
                  <Phone className="w-4 h-4 text-[#8A99AD]/40 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#8A99AD] uppercase tracking-wider block text-[10px]">
                  Request Type
                </label>
                <div className="relative">
                  <select
                    name="requestType"
                    value={formData.requestType}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-[#050608]/90 border border-white/10 text-white focus:outline-none focus:border-blue-500/60 transition-all font-sans text-sm"
                  >
                    <option value="Emergency Protection">Emergency Protection</option>
                    <option value="Threat Report">Threat Report</option>
                    <option value="Intelligent Support">Intelligent Support</option>
                    <option value="General Assistance">General Assistance</option>
                    <option value="Confession / Mission Call">Confession / Mission Call</option>
                  </select>
                  <Tag className="w-4 h-4 text-[#8A99AD]/40 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            {/* Row 3: Subject */}
            <div className="space-y-1.5">
              <label className="text-[#8A99AD] uppercase tracking-wider block text-[10px]">
                Request Subject
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Summary of incident or situation"
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-[#050608]/80 border border-white/10 text-white placeholder-[#8A99AD]/40 focus:outline-none focus:border-blue-500/60 transition-all font-sans text-sm"
                />
                <FileText className="w-4 h-4 text-[#8A99AD]/40 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Row 4: Message */}
            <div className="space-y-1.5">
              <label className="text-[#8A99AD] uppercase tracking-wider block text-[10px]">
                Situation Details / Message *
              </label>
              <textarea
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Describe what is happening and the type of protection or assistance you require..."
                className="w-full px-4 py-3 rounded-xl bg-[#050608]/80 border border-white/10 text-white placeholder-[#8A99AD]/40 focus:outline-none focus:border-blue-500/60 transition-all font-sans text-sm resize-none"
              />
            </div>

            {/* Feedback Notifications */}
            {submitStatus === "success" && (
              <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                <span className="font-sans text-sm">{feedbackMessage}</span>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                <span className="font-sans text-sm">{feedbackMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] text-[#8A99AD]">
                Dispatches encrypted alert to Command Desk (jenitson05@gmail.com)
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#2563FF] to-[#C1123F] text-white font-mono text-xs uppercase tracking-[0.2em] font-bold hover:brightness-110 active:scale-95 transition-all shadow-[0_0_25px_rgba(37,99,255,0.4)] disabled:opacity-50 flex items-center justify-center space-x-3"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">TRANSMITTING REQUEST...</span>
                ) : (
                  <>
                    <span>REQUEST AEGIS</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
