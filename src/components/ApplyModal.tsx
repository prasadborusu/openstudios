"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Check, Loader2, FileText } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import emailjs from "@emailjs/browser";

interface Job {
  id: string;
  title: string;
  department: string;
}

interface ApplyModalProps {
  job: Job | null;
  onClose: () => void;
}

// Helper functions defined outside of the component to prevent impure warnings during render
function generateApplyCaptcha() {
  const num1 = Math.floor(Math.random() * 9) + 1;
  const num2 = Math.floor(Math.random() * 9) + 1;
  return {
    value: `What is ${num1} + ${num2}?`,
    answer: num1 + num2
  };
}

function generateApplicationId(): string {
  return `OS-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

function generateFileName(generatedId: string, originalName: string): string {
  const fileExt = originalName.split('.').pop() || "pdf";
  return `${generatedId}-${Date.now()}.${fileExt}`;
}

export default function ApplyModal({ job, onClose }: ApplyModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [degree, setDegree] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [location, setLocation] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [agreement, setAgreement] = useState(false);
  
  // File Upload states
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  // Submit states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [appId, setAppId] = useState("");
  const [formError, setFormError] = useState("");

  // Captcha state
  const [captcha] = useState(() => generateApplyCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");

  useEffect(() => {
    // Disable background scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Handle File Input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type (PDF only)
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      setFormError("Only PDF resumes are accepted.");
      return;
    }

    // Validate size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setFormError("File size exceeds 5MB limit.");
      return;
    }

    setFormError("");
    setResumeFile(file);
    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

  };

  // Helper to send auto-responder email via EmailJS
  const sendEmailjsAutoResponder = (generatedId: string) => {
    const emailParams = {
      to_name: fullName,
      to_email: email,
      job_title: job?.title || "Mobile App Development Intern",
      application_id: generatedId,
    };

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_RECRUITMENT_SERVICE_ID || 
                      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 
                      "service_default";
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_RECRUITMENT_ID || 
                       "template_recruitment";
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 
                      "user_publickey";

    emailjs.send(serviceId, templateId, emailParams, publicKey)
      .then(() => {
        console.log("Recruitment auto-responder email sent successfully.");
      })
      .catch((emailErr) => {
        console.warn("EmailJS Auto-Responder Error:", emailErr?.text || emailErr);
      });
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!fullName || !email || !phone || !resumeFile || !agreement) {
      setFormError("Please fill out all required fields.");
      return;
    }

    // Validate spam Captcha
    if (parseInt(captchaInput.trim()) !== captcha.answer) {
      setFormError("Incorrect CAPTCHA answer. Please try again.");
      return;
    }

    setLoading(true);

    // Generate unique application ID
    const generatedId = generateApplicationId();

    // Upload resume
    let resumeUrl = "";

    if (resumeFile) {
      try {
        const fileName = generateFileName(generatedId, resumeFile.name);

        // Attempt upload to Supabase storage 'resumes' bucket
        const { error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(fileName, resumeFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.warn("Supabase storage upload failed, attempting backend fallback:", uploadError);
          
          // Fallback to local upload proxy
          const formData = new FormData();
          formData.append("file", resumeFile);

          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            resumeUrl = uploadData.url || "";
          } else {
            console.warn("Server upload proxy failed, using local fallback");
            resumeUrl = `Local Development Sandbox - Resume Upload Bypassed (${resumeFile.name})`;
          }
        } else {
          // Get public URL of the uploaded resume from Supabase Storage
          const { data: { publicUrl } } = supabase.storage
            .from("resumes")
            .getPublicUrl(fileName);
          
          resumeUrl = publicUrl;
        }
      } catch (uploadErr) {
        console.warn("Resume upload failed, using local fallback:", uploadErr);
        resumeUrl = `Local Development Sandbox - Resume Upload Bypassed (${resumeFile.name})`;
      }
    }

    try {
      // Store application data in Supabase
      const { error } = await supabase.from("job_applications").insert([
        {
          id: generatedId,
          position_name: job?.title || "Internship Role",
          full_name: fullName,
          email: email,
          phone: phone,
          college: college || null,
          degree: degree || null,
          grad_year: gradYear ? parseInt(gradYear) : null,
          location: location || null,
          portfolio_url: portfolioUrl || null,
          linkedin_url: linkedinUrl || null,
          github_url: githubUrl || null,
          cover_letter: coverLetter || null,
          resume_url: resumeUrl || "N/A",
        },
      ]);

      if (error) throw error;

      setAppId(generatedId);
      setSuccess(true);
      
      // Send auto-responder email to applicant
      sendEmailjsAutoResponder(generatedId);
      
      // Trigger canvas particles
      setTimeout(initParticles, 100);
    } catch (err) {
      console.warn("Supabase Submission Error:", err);
      // Fallback behavior for local development if database/credentials aren't fully configured
      if (process.env.NODE_ENV === "development") {
        setAppId(`${generatedId} (DEV-MODE)`);
        setSuccess(true);
        
        // Send auto-responder email even in dev fallback mode to allow local testing
        sendEmailjsAutoResponder(generatedId);
        
        setTimeout(initParticles, 100);
      } else {
        setFormError("Failed to submit application. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Subtle Particle Celebration Canvas
  const initParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      color: string;
      alpha: number;
    }> = [];

    // Spawn 50 subtle blue/white particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: width / 2,
        y: height / 2 - 40,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.8) * 8 - 2, // shoot upwards
        r: Math.random() * 3 + 1.5,
        color: Math.random() > 0.4 ? "#2563EB" : "#60A5FA",
        alpha: 1.0,
      });
    }

    let animId: number;
    const update = () => {
      ctx.clearRect(0, 0, width, height);
      let alive = false;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.alpha -= 0.015; // fade

        if (p.alpha > 0) {
          alive = true;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
        }
      });

      if (alive) {
        animId = requestAnimationFrame(update);
      }
    };

    update();
    return () => cancelAnimationFrame(animId);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-lg flex justify-center p-4 md:p-8" data-lenis-prevent>
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] flex flex-col h-fit max-h-[90vh]" data-lenis-prevent>
        {/* Glow ambient background effects */}
        <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 border border-slate-200 hover:border-slate-350 hover:bg-slate-200/80 text-slate-500 hover:text-slate-900 transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>
 
        {/* Modal Body */}
        <div className="p-8 md:p-12 overflow-y-auto flex-1" data-lenis-prevent>
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="mb-8">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-blue-600 uppercase font-bold">
                    Join OpenStudios
                  </span>
                  <h2 className="font-outfit text-2xl md:text-3xl font-bold mt-2 leading-tight">
                    <span className="text-slate-900">Applying for </span>
                    <span className="text-blue-600">
                      {job?.title}
                    </span>
                  </h2>
                  <p className="font-inter text-xs text-slate-500 mt-2 leading-relaxed">
                    Please submit your credentials below. Fields marked with <span className="text-blue-600">*</span> are required.
                  </p>
                </div>

                {formError && (
                  <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-medium">
                    {formError}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Grid fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-mono text-[9px] tracking-wider text-slate-500 uppercase mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-blue-500 focus:bg-white outline-none text-slate-900 text-xs px-4 py-3 rounded-xl transition-all font-inter"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[9px] tracking-wider text-slate-500 uppercase mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-blue-500 focus:bg-white outline-none text-slate-900 text-xs px-4 py-3 rounded-xl transition-all font-inter"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[9px] tracking-wider text-slate-500 uppercase mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-blue-500 focus:bg-white outline-none text-slate-900 text-xs px-4 py-3 rounded-xl transition-all font-inter"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[9px] tracking-wider text-slate-500 uppercase mb-2">
                        Current Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter your current location"
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-blue-500 focus:bg-white outline-none text-slate-900 text-xs px-4 py-3 rounded-xl transition-all font-inter"
                      />
                    </div>
                  </div>

                  <hr className="border-slate-100 my-6" />

                  {/* Education Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <label className="block font-mono text-[9px] tracking-wider text-slate-500 uppercase mb-2">
                        College / University *
                      </label>
                      <input
                        type="text"
                        required
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder="Enter your college / university"
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-blue-500 focus:bg-white outline-none text-slate-900 text-xs px-4 py-3 rounded-xl transition-all font-inter"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[9px] tracking-wider text-slate-500 uppercase mb-2">
                        Degree *
                      </label>
                      <input
                        type="text"
                        required
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        placeholder="Enter your degree"
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-blue-500 focus:bg-white outline-none text-slate-900 text-xs px-4 py-3 rounded-xl transition-all font-inter"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[9px] tracking-wider text-slate-500 uppercase mb-2">
                        Graduation Year *
                      </label>
                      <input
                        type="number"
                        required
                        value={gradYear}
                        onChange={(e) => setGradYear(e.target.value)}
                        placeholder="Enter graduation year"
                        min="2020"
                        max="2035"
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-blue-500 focus:bg-white outline-none text-slate-900 text-xs px-4 py-3 rounded-xl transition-all font-inter"
                      />
                    </div>
                  </div>

                  <hr className="border-slate-100 my-6" />

                  {/* Links Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block font-mono text-[9px] tracking-wider text-slate-500 uppercase mb-2">
                        Portfolio URL
                      </label>
                      <input
                        type="url"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        placeholder="Enter portfolio link"
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-blue-500 focus:bg-white outline-none text-slate-900 text-xs px-4 py-3 rounded-xl transition-all font-inter"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[9px] tracking-wider text-slate-500 uppercase mb-2">
                        LinkedIn URL *
                      </label>
                      <input
                        type="url"
                        required
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="Enter LinkedIn link"
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-blue-500 focus:bg-white outline-none text-slate-900 text-xs px-4 py-3 rounded-xl transition-all font-inter"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[9px] tracking-wider text-slate-500 uppercase mb-2">
                        GitHub URL *
                      </label>
                      <input
                        type="url"
                        required
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="Enter GitHub link"
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-blue-500 focus:bg-white outline-none text-slate-900 text-xs px-4 py-3 rounded-xl transition-all font-inter"
                      />
                    </div>
                  </div>

                  {/* Resume Upload */}
                  <div>
                    <label className="block font-mono text-[9px] tracking-wider text-slate-500 uppercase mb-2">
                      Resume (PDF only, Max 5MB) *
                    </label>
                    <div className="relative border-2 border-dashed border-slate-200 hover:border-blue-500/50 rounded-2xl p-6 bg-slate-50 hover:bg-slate-50/80 transition-all flex flex-col items-center justify-center cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf"
                        required
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {resumeFile ? (
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <p className="text-xs text-slate-900 font-medium max-w-[200px] truncate">
                              {resumeFile.name}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-blue-500/70 mb-2" />
                          <span className="text-xs text-slate-500 font-medium">
                            Choose file or drag here
                          </span>
                        </>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {uploading && (
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-mono text-[8px] text-slate-500 uppercase">
                            Uploading resume...
                          </span>
                          <span className="font-mono text-[8px] text-blue-600 font-bold">
                            {uploadProgress}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-150"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <label className="block font-mono text-[9px] tracking-wider text-slate-500 uppercase mb-2">
                      Cover Letter / Why do you want to join OpenStudios? *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Tell us about yourself and why you're interested in building with us..."
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-blue-500 focus:bg-white outline-none text-slate-900 text-xs px-4 py-3 rounded-xl transition-all font-inter resize-none"
                    />
                  </div>

                  {/* Anti-spam Verification CAPTCHA */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <label className="block font-mono text-[9px] tracking-wider text-slate-500 uppercase mb-2">
                      Security Verification *
                    </label>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-blue-600 bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg">
                        {captcha.value}
                      </span>
                      <input
                        type="text"
                        required
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        placeholder="Answer"
                        className="w-24 bg-white border border-slate-200 focus:border-blue-500 outline-none text-slate-900 text-xs px-3 py-2 rounded-lg transition-all text-center font-mono"
                      />
                    </div>
                  </div>

                  {/* Agreement Checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      required
                      checked={agreement}
                      onChange={(e) => setAgreement(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 bg-slate-50 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="font-inter text-[10px] text-slate-650 leading-relaxed group-hover:text-slate-800 transition-colors select-none">
                      I certify that the information provided is accurate. I agree that
                      OpenStudios can contact me regarding my application. *
                    </span>
                  </label>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-transparent text-white font-semibold uppercase tracking-[0.15em] text-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(37,99,235,0.15)]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              // Success Screen Component
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center text-center py-12 relative"
              >
                {/* Background Celebration Canvas */}
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                />

                {/* Animated checkmark circle */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mb-8 relative z-10"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Check className="w-8 h-8 text-blue-600" />
                  </motion.div>
                </motion.div>

                <div className="max-w-md relative z-10">
                  <h2 className="font-outfit text-3xl font-bold text-slate-900 mb-4">
                    Application Received.
                  </h2>
                  <p className="font-inter text-sm text-slate-600 leading-relaxed mb-6">
                    Thank you for applying to OpenStudios. We&apos;ve received your application successfully. Our team will review your application and contact you if your profile matches the role.
                  </p>

                  {/* Application ID Display */}
                  <div className="inline-block px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 mb-10 font-mono text-[11px] text-slate-600">
                    Application ID: <span className="text-blue-600 font-bold">{appId}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={onClose}
                      className="px-6 py-3 rounded-full bg-slate-100 border border-slate-200 hover:border-slate-350 text-xs font-semibold uppercase tracking-[0.1em] text-slate-700 hover:bg-slate-200/80 transition-all cursor-pointer"
                    >
                      Return to Careers
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        const target = document.querySelector("#about");
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if (target) (window as any).lenis?.scrollTo(target);
                      }}
                      className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-all cursor-pointer shadow-[0_4px_15px_rgba(37,99,235,0.15)]"
                    >
                      Explore OpenStudios
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
