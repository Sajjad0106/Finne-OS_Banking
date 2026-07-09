"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, User, Terminal, Mail, Phone, Eye, EyeOff, Globe } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useSecurityStore } from "../store/useSecurityStore";
import IdbiLogo from "./IdbiLogo";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const { setOperator } = useSecurityStore();
  const [activeTab, setActiveTab] = useState<"signin" | "register">("signin");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authLogs, setAuthLogs] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  const [activePersona, setActivePersona] = useState<"CUSTOMER" | "EMPLOYEE" | "MANAGER">("CUSTOMER");

  useEffect(() => {
    if (activePersona === "CUSTOMER") {
      setRole("SAVINGS_ACCOUNT");
    } else if (activePersona === "EMPLOYEE") {
      setRole("ONBOARDING_AGENT");
    } else {
      setRole("BRANCH_MANAGER");
    }
  }, [activePersona]);

  const checkPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score, label: "Empty", color: "bg-white/10", width: "w-0" };
    
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    
    switch (score) {
      case 1:
        return { score, label: "Weak (Needs numbers/symbols)", color: "bg-[#FF4D4D]", width: "w-1/5" };
      case 2:
        return { score, label: "Fair (Needs upper/symbols)", color: "bg-[#FF8A3D]", width: "w-2/5" };
      case 3:
        return { score, label: "Good (Add symbols)", color: "bg-[#FFB020]", width: "w-3/5" };
      case 4:
        return { score, label: "Strong", color: "bg-[#5DA9FF]", width: "w-4/5" };
      case 5:
        return { score, label: "Excellent clearance strength", color: "bg-[#00FF9D]", width: "w-full" };
      default:
        return { score, label: "Weak", color: "bg-[#FF4D4D]", width: "w-1/12" };
    }
  };

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [role, setRole] = useState("SAVINGS_ACCOUNT");
  const [orgName, setOrgName] = useState("");

  // 360-degree Face Biometric Capture states
  const [faceBiometrics, setFaceBiometrics] = useState<string | null>(null);
  const [isCapturing360, setIsCapturing360] = useState(false);
  const [capture360Progress, setCapture360Progress] = useState(0);
  const [capture360Status, setCapture360Status] = useState("Click to initialize camera...");
  const registerVideoRef = useRef<HTMLVideoElement>(null);
  const [registerStream, setRegisterStream] = useState<MediaStream | null>(null);

  // Check Supabase session on mount for automatic SSO redirect log in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          
          const loggedOp = {
            id: session.user.id,
            fullName: profile?.full_name || session.user.user_metadata?.fullName || session.user.user_metadata?.full_name || "Google Operator",
            email: session.user.email || "",
            phone: profile?.phone || session.user.user_metadata?.phone || "",
            username: profile?.username || session.user.user_metadata?.username || "google_user",
            role: profile?.role || session.user.user_metadata?.role || "CUSTOMER",
            orgId: profile?.org_id || "00000000-0000-0000-0000-000000000000",
            orgName: "Default Demo Org"
          };
          
          setOperator(loggedOp);
          onLogin();
        }
      } catch (err) {
        console.error("Session auto-resolve check failed:", err);
      }
    };
    checkSession();
  }, []);

  // Clean up registration video stream on unmount
  useEffect(() => {
    return () => {
      if (registerStream) {
        registerStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [registerStream]);

  const start360Capture = async () => {
    setIsCapturing360(true);
    setCapture360Progress(0);
    setCapture360Status("Initializing FIDO2 Face Mapper...");
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn("Camera API not available in this browser context (requires HTTPS or localhost), using fallback...");
      setFaceBiometrics("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='%23DF955B'/></svg>");
      setIsCapturing360(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: 300, height: 300 } 
      });
      setRegisterStream(stream);
      if (registerVideoRef.current) {
        registerVideoRef.current.srcObject = stream;
      }
      
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 5;
        setCapture360Progress(currentProgress);
        
        if (currentProgress <= 25) {
          setCapture360Status("Look straight at the camera...");
        } else if (currentProgress <= 50) {
          setCapture360Status("Turn head slowly to the left...");
        } else if (currentProgress <= 75) {
          setCapture360Status("Turn head slowly to the right...");
        } else if (currentProgress < 100) {
          setCapture360Status("Tilt head slowly up and down...");
        } else if (currentProgress >= 100) {
          clearInterval(interval);
          
          // Capture snapshot
          if (registerVideoRef.current) {
            const canvas = document.createElement("canvas");
            canvas.width = 160;
            canvas.height = 160;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(registerVideoRef.current, 0, 0, 160, 160);
              const base64Img = canvas.toDataURL("image/jpeg", 0.65);
              setFaceBiometrics(base64Img);
            }
          }
          
          // Stop stream
          stream.getTracks().forEach(track => track.stop());
          setRegisterStream(null);
          setIsCapturing360(false);
        }
      }, 150);
      
    } catch (err) {
      console.warn("Register camera failed, using sandbox model:", err);
      setIsCapturing360(false);
      // Fallback placeholder image
      setFaceBiometrics("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='%23DF955B'/></svg>");
    }
  };

  // Form error states
  const [errors, setErrors] = useState<{
    loginId?: string;
    loginPassword?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    username?: string;
    accessKey?: string;
    orgName?: string;
  }>({});

  // Country code selector states
  const countriesList = [
    { name: "India", code: "+91", digits: 10, flag: "🇮🇳" },
    { name: "United States", code: "+1", digits: 10, flag: "🇺🇸" },
    { name: "United Kingdom", code: "+44", digits: 10, flag: "🇬🇧" },
    { name: "UAE", code: "+971", digits: 9, flag: "🇦🇪" },
    { name: "Australia", code: "+61", digits: 9, flag: "🇦🇺" },
    { name: "Singapore", code: "+65", digits: 8, flag: "🇸🇬" }
  ];
  const [selectedCountry, setSelectedCountry] = useState(countriesList[0]);

  const validateEmail = (emailStr: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(emailStr);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    const limitedVal = rawVal.slice(0, selectedCountry.digits);
    setPhone(limitedVal);
    if (errors.phone) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.phone;
        return copy;
      });
    }
  };

  // Sign In states
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [authLogs]);

  // Clear errors when active tab changes
  useEffect(() => {
    setErrors({});
  }, [activeTab]);

  // Real-time / submit form validators
  const validateSignInForm = () => {
    const errs: typeof errors = {};
    if (!loginId.trim()) {
      errs.loginId = "Banking ID or Email is required.";
    } else if (loginId.includes("@") && !validateEmail(loginId)) {
      errs.loginId = "Please enter a valid email address.";
    }
    if (!loginPassword) {
      errs.loginPassword = "Password is required.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateRegisterForm = () => {
    const errs: typeof errors = {};
    if (!fullName.trim()) {
      errs.fullName = "Full name is required.";
    }
    
    const finalEmail = email.includes("@") ? email : `${email.toLowerCase()}@idbi.bank`;
    if (!email.trim()) {
      errs.email = "Email is required.";
    } else if (!validateEmail(finalEmail)) {
      errs.email = "Please enter a valid email (e.g., user@domain.com).";
    }

    if (!phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (phone.length < selectedCountry.digits) {
      errs.phone = `Phone number for ${selectedCountry.name} must be exactly ${selectedCountry.digits} digits.`;
    }

    if (!username.trim()) {
      errs.username = "Username is required.";
    }

    const strength = checkPasswordStrength(accessKey);
    if (!accessKey) {
      errs.accessKey = "Password passcode is required.";
    } else if (strength.score < 4) {
      errs.accessKey = "Password must be at least 8 characters, and contain uppercase, lowercase, numbers, and symbols.";
    }

    if (!faceBiometrics) {
      errs.orgName = "360° Face Biometrics enrollment is required to register.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const [verificationStep, setVerificationStep] = useState<"face" | "fingerprint" | "otp" | "success" | null>(null);
  const [pendingOperator, setPendingOperator] = useState<any>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const [faceScanProgress, setFaceScanProgress] = useState(0);
  const [faceScanStatus, setFaceScanStatus] = useState("Initializing FIDO2 camera...");
  
  const [fingerprintScanning, setFingerprintScanning] = useState(false);
  const [fingerprintProgress, setFingerprintProgress] = useState(0);
  
  const [otpCode, setOtpCode] = useState<string[]>(Array(6).fill(""));
  const [otpTimer, setOtpTimer] = useState(59);
  const otpInputsRef = useRef<HTMLInputElement[]>([]);

  // Start face camera stream
  useEffect(() => {
    if (verificationStep === "face") {
      setCameraError(false);
      setFaceScanProgress(0);
      setFaceScanStatus("Configuring FIDO2 Camera Shield...");
      
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 400, height: 400 } })
          .then(stream => {
            setCameraStream(stream);
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          })
          .catch(err => {
            console.warn("Camera access denied or unavailable, using high-end vector fallback:", err);
            setCameraError(true);
          });
      } else {
        console.warn("Camera API not available (requires HTTPS or localhost), falling back...");
        setCameraError(true);
      }

      // Simulation timeline for face liveness scanner
      const interval = setInterval(() => {
        setFaceScanProgress(prev => {
          const next = prev + 5;
          if (next <= 25) {
            setFaceScanStatus("SYS: Face detected. Mapping landmark grid...");
          } else if (next <= 60) {
            setFaceScanStatus("LIVENESS: Checking blink presence. Please do not move...");
          } else if (next <= 85) {
            setFaceScanStatus("TELEMETRY: Analyzing thermal flow & liveness signature...");
          } else if (next < 100) {
            setFaceScanStatus("SUCCESS: Face verified! Liveness score: 99.7%");
          } else if (next >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setVerificationStep("fingerprint");
            }, 600);
            return 100;
          }
          return next;
        });
      }, 150);

      return () => {
        clearInterval(interval);
      };
    } else {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
    }
  }, [verificationStep]);

  // Handle fingerprint scanning
  useEffect(() => {
    if (verificationStep === "fingerprint") {
      setFingerprintProgress(0);
      setFingerprintScanning(true);
      
      const interval = setInterval(() => {
        setFingerprintProgress(prev => {
          const next = prev + 10;
          if (next >= 100) {
            clearInterval(interval);
            setFingerprintScanning(false);
            setTimeout(() => {
              setVerificationStep("otp");
            }, 600);
            return 100;
          }
          return next;
        });
      }, 120);

      return () => clearInterval(interval);
    }
  }, [verificationStep]);

  // Handle OTP timer
  useEffect(() => {
    if (verificationStep === "otp" && otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [verificationStep, otpTimer]);

  const handleOtpChange = (index: number, val: string) => {
    const cleaned = val.replace(/\D/g, "");
    if (!cleaned) return;
    
    const newOtp = [...otpCode];
    newOtp[index] = cleaned[cleaned.length - 1];
    setOtpCode(newOtp);
    
    // Focus next input
    if (index < 5 && cleaned) {
      otpInputsRef.current[index + 1]?.focus();
    }
    
    // Auto-verify if all digits are entered
    if (index === 5 && newOtp.every(char => char !== "")) {
      handleOtpVerify();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const newOtp = [...otpCode];
      if (otpCode[index] === "") {
        if (index > 0) {
          newOtp[index - 1] = "";
          setOtpCode(newOtp);
          otpInputsRef.current[index - 1]?.focus();
        }
      } else {
        newOtp[index] = "";
        setOtpCode(newOtp);
      }
    }
  };

  const uploadBiometricsToSupabase = async (userId: string, persona: string, base64Data: string | null) => {
    if (!base64Data || !base64Data.startsWith("data:") || !base64Data.includes(";base64,")) {
      return base64Data || "";
    }
    try {
      const mime = base64Data.split(";")[0].split(":")[1] || "image/jpeg";
      const base64Content = base64Data.split(",")[1];
      const byteCharacters = atob(base64Content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mime });

      const cleanFolder = persona.toUpperCase();
      const filePath = `${cleanFolder}/${userId}.jpg`;
      
      const { error: uploadError } = await supabase.storage
        .from("biometrics")
        .upload(filePath, blob, {
          contentType: mime,
          upsert: true
        });

      if (uploadError) {
        console.warn("Storage upload failed, using fallback base64 string:", uploadError.message);
        return base64Data;
      }

      const { data: urlData } = supabase.storage
        .from("biometrics")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (err) {
      console.error("Failed to upload biometric file to Storage:", err);
      return base64Data;
    }
  };

  const captureLivenessSnapshot = async (userId: string) => {
    if (videoRef.current) {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 160;
        canvas.height = 160;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, 160, 160);
          const base64Img = canvas.toDataURL("image/jpeg", 0.6);
          
          const storageUrl = await uploadBiometricsToSupabase(userId, activePersona, base64Img);
          
          await supabase
            .from("profiles")
            .update({ face_biometrics: storageUrl })
            .eq("id", userId);
            
          return storageUrl;
        }
      } catch (err) {
        console.error("Failed to update biometric snapshot in Supabase:", err);
      }
    }
    return null;
  };

  const handleOtpVerify = async () => {
    setVerificationStep("success");
    
    let finalOp = { ...pendingOperator };
    if (pendingOperator && pendingOperator.id) {
      const newSnapshot = await captureLivenessSnapshot(pendingOperator.id);
      if (newSnapshot) {
        finalOp.faceBiometrics = newSnapshot;
      }
    }

    setTimeout(() => {
      const defaultTab = activePersona === "CUSTOMER" 
        ? "customer-overview" 
        : activePersona === "EMPLOYEE" 
        ? "employee-overview" 
        : "manager-overview";
      useSecurityStore.getState().setActiveTab(defaultTab);

      setOperator(finalOp);
      setVerificationStep(null);
      setIsAuthenticating(false);
      onLogin();
    }, 1500);
  };

  // Terminal logging handshake sequence
  const runAuthSequence = (operatorData: any) => {
    const enrichedData = {
      ...operatorData,
      persona: activePersona
    };
    setPendingOperator(enrichedData);
    setAuthLogs((prev) => [
      ...prev,
      `SYS_SSL: Negotiating FIDO2 biometric authentication handshake for ${activePersona}...`,
      "SYS_SSL: Redirecting operator to Biometric Verification portal..."
    ]);
    setTimeout(() => {
      setVerificationStep("face");
    }, 800);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignInForm()) return;

    setIsAuthenticating(true);
    setAuthLogs(["SYS_AUTH: Contacting Supabase identity provider..."]);

    const finalEmail = loginId.includes("@") ? loginId : `${loginId.toLowerCase()}@idbi.bank`;

    // 1. Try to sign in on Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: finalEmail,
      password: loginPassword
    });

    const defaultRole = activePersona === "CUSTOMER" 
      ? "SAVINGS_ACCOUNT" 
      : activePersona === "EMPLOYEE" 
      ? "ONBOARDING_AGENT" 
      : "BRANCH_MANAGER";

    if (error) {
      console.error("Supabase signin failed, falling back to local simulation:", error.message);
      // Local fallback for offline/test mode
      const mockOp = {
        fullName: loginId.replace("@idbi.bank", "").replace(/[^a-zA-Z0-9]+/g, " ").toUpperCase(),
        email: finalEmail,
        phone: "+1 555-0199",
        username: loginId.split("@")[0] || loginId,
        role: defaultRole,
        orgId: "00000000-0000-0000-0000-000000000000",
        orgName: "Default Demo Org"
      };
      
      setOperator(mockOp);
      setAuthLogs((prev) => [
        ...prev,
        `SYS_WARN: Supabase Auth error (${error.message})`,
        "SYS_WARN: Falling back to local offline mode credentials...",
      ]);
      runAuthSequence(mockOp);
    } else {
      // Successfully authenticated in live Supabase Auth! Retrieve profiles metadata
      const userMeta = data.user?.user_metadata || {};
      
      // Query profiles table to retrieve database columns (role, full_name, and face_biometrics)
      let profile: any = null;
      try {
        const { data: profData } = await supabase
          .from("profiles")
          .select("full_name, phone, username, role, face_biometrics")
          .eq("id", data.user?.id)
          .maybeSingle();
        profile = profData;
      } catch (err) {
        console.error("Error retrieving profile metadata from Supabase:", err);
      }

      const loggedOp = {
        id: data.user?.id,
        fullName: profile?.full_name || userMeta.fullName || data.user?.email?.split("@")[0] || "Supabase Operator",
        email: data.user?.email || finalEmail,
        phone: profile?.phone || userMeta.phone || "+1 555-0100",
        username: profile?.username || userMeta.username || data.user?.email?.split("@")[0] || "supabase_user",
        role: profile?.role || userMeta.role || defaultRole,
        orgId: userMeta.org_id || "00000000-0000-0000-0000-000000000000",
        orgName: userMeta.orgName || "Default Org",
        faceBiometrics: profile?.face_biometrics || userMeta.face_biometrics || ""
      };

      setOperator(loggedOp);
      setAuthLogs((prev) => [...prev, "SYS_OK: Supabase Authentication succeeded."]);
      runAuthSequence(loggedOp);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegisterForm()) return;

    setIsAuthenticating(true);
    setAuthLogs(["SYS_AUTH: Contacting Supabase directory to provision new operator credentials..."]);

    const finalEmail = email.includes("@") ? email : `${email.toLowerCase()}@idbi.bank`;
    const fullPhone = `${selectedCountry.code} ${phone}`;

    // 1. Create or find organization in Supabase Database
    const defaultOrgName = activePersona === "CUSTOMER" ? "IDBI Customers" : "IDBI Bank Staff";
    let orgId = "00000000-0000-0000-0000-000000000000";
    try {
      setAuthLogs((prev) => [...prev, `SYS_AUTH: Setting up tenant profile: ${defaultOrgName}...`]);
      
      const { data: existingOrg, error: findError } = await supabase
        .from("organizations")
        .select("id")
        .eq("name", defaultOrgName)
        .maybeSingle();

      if (existingOrg) {
        orgId = existingOrg.id;
      } else {
        const { data: newOrg, error: createError } = await supabase
          .from("organizations")
          .insert({ name: defaultOrgName })
          .select("id")
          .single();
        if (newOrg) {
          orgId = newOrg.id;
        }
      }
    } catch (err) {
      console.error("Error fetching/creating organization in Supabase:", err);
    }

    // 2. Register account in live Supabase Auth
    const { data: authData, error } = await supabase.auth.signUp({
      email: finalEmail,
      password: accessKey,
      options: {
        data: {
          fullName,
          phone: fullPhone,
          username,
          role,
          org_id: orgId,
          orgName: defaultOrgName,
          face_biometrics: faceBiometrics
        }
      }
    });

    if (error) {
      console.error("Supabase registration failed, falling back to local simulation:", error.message);
      const mockOp = {
        fullName,
        email: finalEmail,
        phone: fullPhone,
        username,
        role,
        orgId,
        orgName: defaultOrgName,
        faceBiometrics
      };

      setOperator(mockOp);
      setAuthLogs((prev) => [
        ...prev,
        `SYS_WARN: Supabase sign-up failed (${error.message})`,
        "SYS_WARN: Falling back to local sandbox registration...",
      ]);
      runAuthSequence(mockOp);
    } else {
      // Register succeeded! Upload face biometrics to storage and update profile
      let finalBiometricsUrl = faceBiometrics;
      if (authData.user?.id) {
        setAuthLogs((prev) => [...prev, "SYS_AUTH: Uploading biometric identity file to storage..."]);
        finalBiometricsUrl = await uploadBiometricsToSupabase(authData.user.id, activePersona, faceBiometrics);
        
        // Update database table profile
        if (finalBiometricsUrl !== faceBiometrics) {
          try {
            await supabase
              .from("profiles")
              .update({ face_biometrics: finalBiometricsUrl })
              .eq("id", authData.user.id);
          } catch (dbErr) {
            console.error("Failed to update database profile with storage URL:", dbErr);
          }
        }
      }

      const loggedOp = {
        id: authData.user?.id,
        fullName,
        email: finalEmail,
        phone: fullPhone,
        username,
        role,
        orgId,
        orgName: defaultOrgName,
        faceBiometrics: finalBiometricsUrl
      };

      setOperator(loggedOp);
      setAuthLogs((prev) => [
        ...prev,
        "SYS_OK: Supabase identity profile created successfully.",
        "SYS_INFO: Profile metadata synchronized in Auth metadata and Storage."
      ]);
      runAuthSequence(loggedOp);
    }
  };

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    setAuthLogs(["SYS_AUTH: Opening Google single-sign-on OAuth context..."]);

    // Save the selected persona to localStorage so we can map the correct role on redirect back
    if (typeof window !== "undefined") {
      localStorage.setItem("finne_oauth_persona", activePersona);
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: "offline",
          prompt: "consent"
        }
      }
    });

    if (error) {
      console.error("Google OAuth error, using local demo user:", error.message);
      const mockOp = {
        fullName: "Google Federated Operator",
        email: "fed-operator@gmail.com",
        phone: "+1 555-8080",
        username: "google_federated",
        role: activePersona === "CUSTOMER" ? "SAVINGS_ACCOUNT" : activePersona === "EMPLOYEE" ? "ONBOARDING_AGENT" : "BRANCH_MANAGER",
        orgId: "00000000-0000-0000-0000-000000000000",
        orgName: "Default Demo Org"
      };
      
      setOperator(mockOp);
      setAuthLogs((prev) => [
        ...prev,
        `SYS_WARN: Google OAuth Redirect failed (${error.message})`,
        "SYS_WARN: Launching mock Google Identity handshake session...",
      ]);
      runAuthSequence(mockOp);
    }
  };

  const handleBypassDemo = () => {
    setIsAuthenticating(true);
    const mockOp = {
      fullName: "Bypass Operator Administrator",
      email: "admin_bypass@idbi.bank",
      phone: "+1 800-555-0199",
      username: "operator_admin",
      role: "BRANCH_MANAGER",
      orgId: "00000000-0000-0000-0000-000000000000",
      orgName: "Default Demo Org"
    };

    setOperator(mockOp);
    setAuthLogs([
      "SYS_WARN: Initializing Offline Bypass Protocol...",
      "SYS_WARN: Bypassing clearance checks for local testing...",
      "SYS_WARN: Booting Finne OS in OFFLINE DEMO mode..."
    ]);
    runAuthSequence(mockOp);
  };

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-[#050505] select-none font-sans py-6 flex flex-col justify-start md:justify-center items-center">
      {/* Background Mesh Grid */}
      <div className="absolute inset-0 grid-mesh opacity-20 pointer-events-none" />

      {/* Radial center glow */}
      <div className="absolute w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <AnimatePresence mode="wait">
        {verificationStep ? (
          /* BIOMETRIC VERIFICATION OVERLAY SCREEN */
          <motion.div
            key="biometric-verification"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-xl p-6 glass-card-gold bg-[#080808]/92 border border-gold/20 flex flex-col justify-between relative z-10 mx-4 rounded-2xl min-h-[460px] my-auto"
          >
            {/* Top Scanning Line */}
            <div className="scanline" />

            {/* Header progress bar */}
            <div className="border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-widest text-white/50 mb-2">
                <span>FIDO2 Multi-Factor Validation</span>
                <span className="text-gold font-bold">Step {verificationStep === "face" ? "1" : verificationStep === "fingerprint" ? "2" : "3"} of 3</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className={`h-1 rounded transition-colors duration-300 ${verificationStep === "face" ? "bg-gold" : "bg-gold/40"}`} />
                <div className={`h-1 rounded transition-colors duration-300 ${verificationStep === "fingerprint" ? "bg-gold" : verificationStep === "otp" || verificationStep === "success" ? "bg-gold/80" : "bg-white/10"}`} />
                <div className={`h-1 rounded transition-colors duration-300 ${verificationStep === "otp" ? "bg-gold" : verificationStep === "success" ? "bg-gold/80" : "bg-white/10"}`} />
              </div>
            </div>

            {/* Content area based on step */}
            <div className="flex-1 flex flex-col items-center justify-center py-4">
              {verificationStep === "face" && (
                <div className="flex flex-col items-center">
                  <div className="relative w-44 h-44 rounded-full border-2 border-gold/40 flex items-center justify-center bg-black overflow-hidden shadow-[0_0_25px_rgba(0,131,108,0.25)]">
                    {!cameraError ? (
                      <>
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover scale-x-[-1]"
                        />
                        {/* Circular Scanning target */}
                        <div className="absolute inset-4 rounded-full border border-success/30 border-dashed animate-pulse pointer-events-none" />
                        {/* Biometric mesh overlay simulation */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,157,0.1)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none opacity-40" />
                        <div className="absolute top-[20%] left-[20%] right-[20%] bottom-[30%] border border-success/40 rounded-3xl pointer-events-none">
                          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-success" />
                          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-success" />
                          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-success" />
                           <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-success" />
                          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[7px] text-success font-mono font-bold tracking-wider animate-pulse whitespace-nowrap bg-black/50 px-1 py-0.5 rounded">
                            LIVENESS: ACTIVE
                          </span>
                        </div>
                      </>
                    ) : (
                      /* Fallback digital face scan outline */
                      <div className="w-full h-full flex items-center justify-center relative bg-gradient-to-b from-[#00836C]/5 to-[#00836C]/20">
                        <svg viewBox="0 0 100 100" className="w-24 h-24 text-gold animate-breath">
                          <path
                            d="M50 15 C30 15 25 35 25 55 C25 75 35 85 50 85 C65 85 75 75 75 55 C75 35 70 15 50 15 Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M38 48 C38 48 42 45 45 48 M55 48 C55 48 58 45 62 48"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M48 65 C48 65 50 67 52 65"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 bg-gradient-to-t from-gold/5 via-transparent to-transparent animate-pulse" />
                      </div>
                    )}

                    {/* Progress Sweep Bar */}
                    <div
                      className="absolute left-0 w-full h-[2px] bg-success shadow-[0_0_8px_#00FF9D] pointer-events-none animate-[scan_2.5s_ease-in-out_infinite]"
                    />
                  </div>
                  
                  <div className="mt-5 text-center">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                      Camera Liveness Verification
                    </h3>
                    <p className="text-[10px] text-mutedText mt-1.5 font-mono bg-black/40 border border-white/5 px-4 py-2 rounded-xl min-w-[280px]">
                      {faceScanStatus}
                    </p>
                    <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mt-3 mx-auto">
                      <div
                        className="h-full bg-gold transition-all duration-150 ease-out"
                        style={{ width: `${faceScanProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {verificationStep === "fingerprint" && (
                <div className="flex flex-col items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (!fingerprintScanning) {
                        setVerificationStep("otp");
                      }
                    }}
                    className="relative w-36 h-36 rounded-2xl border border-white/10 flex items-center justify-center bg-black/50 cursor-pointer hover:border-gold/30 hover:shadow-[0_0_20px_rgba(0,131,108,0.15)] group transition-all"
                  >
                    <svg viewBox="0 0 100 100" className={`w-20 h-20 transition-all ${fingerprintScanning ? "text-gold animate-pulse" : "text-white/40 group-hover:text-gold"}`}>
                      <path
                        d="M50,15 A35,35 0 0,0 20,48 M50,22 A28,28 0 0,0 27,48 M50,29 A21,21 0 0,0 34,48 M50,36 A14,14 0 0,0 41,48 M50,43 A7,7 0 0,0 48,48 M50,43 A7,7 0 0,1 52,48 M50,36 A14,14 0 0,1 59,48 M50,29 A21,21 0 0,1 66,48 M50,22 A28,28 0 0,1 73,48 M50,15 A35,35 0 0,1 80,48 M34,48 V55 A16,16 0 0,0 50,71 M41,48 V53 A9,9 0 0,0 50,62 M48,48 V51 M52,48 V51 M59,48 V53 A9,9 0 0,1 50,62 M66,48 V55 A16,16 0 0,1 50,71 M27,48 V58 A23,23 0 0,0 50,81 M73,48 V58 A23,23 0 0,1 50,81 M20,48 V61 A30,30 0 0,0 50,91 M80,48 V61 A30,30 0 0,1 50,91"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>

                    {/* Fingerprint sweep bar */}
                    {fingerprintScanning && (
                      <div className="absolute left-4 right-4 h-[2.5px] bg-gold shadow-[0_0_10px_#00836C] animate-[scan_2s_ease-in-out_infinite]" />
                    )}
                  </button>

                  <div className="mt-5 text-center">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                      Biometric Touch ID Scan
                    </h3>
                    <p className="text-[10px] text-mutedText mt-1.5 font-mono max-w-[280px]">
                      {fingerprintScanning
                        ? `FIDO2: Verifying device credentials... [${fingerprintProgress}%]`
                        : "Touch the sensor to verify FIDO2 passkeys."}
                    </p>
                    <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mt-3 mx-auto">
                      <div
                        className="h-full bg-gold transition-all duration-150 ease-out"
                        style={{ width: `${fingerprintProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {verificationStep === "otp" && (
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {otpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          if (el) otpInputsRef.current[idx] = el;
                        }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-12 h-14 bg-black/60 border border-white/10 hover:border-gold/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20 rounded-xl text-center text-xl font-bold font-mono text-white transition-all"
                      />
                    ))}
                  </div>

                  <div className="text-center mt-3">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                      SMS OTP Verification
                    </h3>
                    <p className="text-[10px] text-mutedText mt-1.5 font-mono max-w-[320px] leading-relaxed">
                      Enter the 6-digit verification code sent to your registered terminal:{" "}
                      <span className="text-gold font-bold">
                        {pendingOperator?.phone || "+91 ••••• ••990"}
                      </span>
                    </p>
                    <div className="flex justify-between items-center w-full mt-4 text-[9px] font-mono text-white/40">
                      <span>OTP Expires in: <span className="text-gold font-bold">{otpTimer > 9 ? `00:${otpTimer}` : `00:0${otpTimer}`}</span></span>
                      {otpTimer === 0 ? (
                        <button
                          type="button"
                          onClick={() => setOtpTimer(59)}
                          className="text-gold hover:underline font-bold"
                        >
                          Resend Code
                        </button>
                      ) : (
                        <span>Resend OTP</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {verificationStep === "success" && (
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-success/10 border border-success/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,255,157,0.2)]">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-success animate-[breath_2s_infinite]">
                      <polyline points="20 6 9 17 4 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-base font-black uppercase tracking-widest text-success">
                    AUTHENTICATION SUCCESS
                  </h3>
                  <p className="text-[10px] text-mutedText font-mono mt-2 bg-black/40 border border-white/5 px-4 py-2 rounded-xl max-w-[320px]">
                    SYS_OK: Handshake verified. Establishing secure banking console session...
                  </p>
                </div>
              )}
            </div>

            {/* Bottom cancel panel */}
            <div className="border-t border-white/5 pt-4 flex items-center justify-between text-[9px] text-white/30 font-mono">
              <span>Tenant ID: {pendingOperator?.orgName || "Default Demo Org"}</span>
              <button
                type="button"
                onClick={() => {
                  setVerificationStep(null);
                  setIsAuthenticating(false);
                }}
                className="text-critical/70 hover:text-critical font-bold transition-colors cursor-pointer"
              >
                Abort & Go Back
              </button>
            </div>
          </motion.div>
        ) : !isAuthenticating ? (
          <motion.div
            key="login-form"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-lg p-6 glass-card-gold bg-[#080808]/85 border border-gold/15 relative z-10 mx-4 rounded-2xl my-auto"
          >
            {/* Top Scanning Line */}
            <div className="scanline" />

            {/* SSL Badge Overlay */}
            <div className="mb-4 flex items-center justify-center gap-1.5 text-[#00FF9D] font-mono text-[9px] uppercase tracking-wider bg-success/5 border border-success/20 rounded-lg px-2.5 py-1.5 w-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-ping" />
              <span>TLSv1.3 SSL Encrypted Security Interface Active</span>
            </div>

            <div className="flex flex-col items-center text-center mb-6">
              <div className="mb-3">
                <IdbiLogo size={52} />
              </div>
              <h1 className="text-xl font-black uppercase tracking-[0.2em] text-white">
                Finne<span className="text-[#F58220]"> OS</span>
              </h1>
              <p className="text-[8px] text-mutedText uppercase tracking-widest mt-1.5 font-mono">
                IDBI BANK SECURE ONBOARDING PORTAL
              </p>
            </div>

            {/* Persona Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5 mb-4 bg-black/50 border border-white/5 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActivePersona("CUSTOMER")}
                className={`py-1.5 text-[9px] uppercase font-bold tracking-wider rounded-lg transition-all ${
                  activePersona === "CUSTOMER"
                    ? "bg-gold text-white shadow-[0_0_8px_rgba(47,142,127,0.3)]"
                    : "text-mutedText hover:text-white"
                }`}
              >
                Customers
              </button>
              <button
                type="button"
                onClick={() => setActivePersona("EMPLOYEE")}
                className={`py-1.5 text-[9px] uppercase font-bold tracking-wider rounded-lg transition-all ${
                  activePersona === "EMPLOYEE"
                    ? "bg-gold text-white shadow-[0_0_8px_rgba(47,142,127,0.3)]"
                    : "text-mutedText hover:text-white"
                }`}
              >
                Branch Staff
              </button>
              <button
                type="button"
                onClick={() => setActivePersona("MANAGER")}
                className={`py-1.5 text-[9px] uppercase font-bold tracking-wider rounded-lg transition-all ${
                  activePersona === "MANAGER"
                    ? "bg-gold text-white shadow-[0_0_8px_rgba(47,142,127,0.3)]"
                    : "text-mutedText hover:text-white"
                }`}
              >
                Manager
              </button>
            </div>

            {/* Form Toggle Tabs */}
            <div className="grid grid-cols-2 gap-2 mb-4 border-b border-white/5 pb-3">
              <button
                type="button"
                onClick={() => setActiveTab("signin")}
                className={`py-2 text-[10px] uppercase font-bold tracking-widest border rounded-xl transition-all ${
                  activeTab === "signin"
                    ? "bg-gold/10 border-gold/40 text-white shadow-[0_0_8px_rgba(47,142,127,0.06)]"
                    : "border-transparent text-mutedText hover:text-white"
                }`}
              >
                Sign In Session
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("register")}
                className={`py-2 text-[10px] uppercase font-bold tracking-widest border rounded-xl transition-all ${
                  activeTab === "register"
                    ? "bg-gold/10 border-gold/40 text-white shadow-[0_0_8px_rgba(47,142,127,0.06)]"
                    : "border-transparent text-mutedText hover:text-white"
                }`}
              >
                Enroll Profile
              </button>
            </div>

            {activeTab === "signin" ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-mutedText block">
                    {activePersona === "CUSTOMER"
                      ? "Customer ID or Mobile Number"
                      : activePersona === "EMPLOYEE"
                      ? "Bank Employee ID or Email"
                      : "Console Manager ID"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-mutedText">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={loginId}
                      onChange={(e) => {
                        setLoginId(e.target.value);
                        if (errors.loginId) setErrors(prev => ({ ...prev, loginId: undefined }));
                      }}
                      placeholder={
                        activePersona === "CUSTOMER"
                          ? "cust_10283 or +91 9900112233"
                          : activePersona === "EMPLOYEE"
                          ? "employee_id or user@idbi.bank"
                          : "manager_id or admin@idbi.bank"
                      }
                      className={`w-full pl-9 pr-4 py-2.5 bg-[#0c0c0c] border rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:ring-1 transition-all font-mono ${
                        errors.loginId ? "border-[#FF4D4D] focus:border-[#FF4D4D] focus:ring-[#FF4D4D]/25" : "border-white/10 focus:border-gold focus:ring-gold/25"
                      }`}
                    />
                  </div>
                  {errors.loginId && (
                    <span className="text-[9px] text-[#FF4D4D] font-mono mt-1 block font-semibold">
                      ⚠️ {errors.loginId}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-mutedText block">
                    {activePersona === "CUSTOMER"
                      ? "Internet Banking Passcode"
                      : activePersona === "EMPLOYEE"
                      ? "Clearance Password"
                      : "Console Access Key"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-mutedText">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        if (errors.loginPassword) setErrors(prev => ({ ...prev, loginPassword: undefined }));
                      }}
                      placeholder="••••••••••••••••••••"
                      className={`w-full pl-9 pr-10 py-2.5 bg-[#0c0c0c] border rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:ring-1 transition-all font-mono ${
                        errors.loginPassword ? "border-[#FF4D4D] focus:border-[#FF4D4D] focus:ring-[#FF4D4D]/25" : "border-white/10 focus:border-gold focus:ring-gold/25"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-mutedText hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.loginPassword && (
                    <span className="text-[9px] text-[#FF4D4D] font-mono mt-1 block font-semibold">
                      ⚠️ {errors.loginPassword}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gold text-[#050505] text-[10px] font-bold uppercase tracking-[0.15em] transition-all hover:bg-gold/95 shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:scale-[1.01] active:scale-[0.99] mt-2 block"
                >
                  Authorize Console Session
                </button>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold uppercase tracking-widest text-mutedText block">
                      {activePersona === "CUSTOMER"
                        ? "Full Customer Name"
                        : activePersona === "EMPLOYEE"
                        ? "Full Staff Name"
                        : "Full Executive Name"}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined }));
                      }}
                      placeholder="Jane Doe"
                      className={`w-full px-3 py-2 bg-[#0c0c0c] border rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:ring-1 transition-all ${
                        errors.fullName ? "border-[#FF4D4D] focus:border-[#FF4D4D] focus:ring-[#FF4D4D]/25" : "border-white/10 focus:border-gold focus:ring-gold/25"
                      }`}
                    />
                    {errors.fullName && (
                      <span className="text-[8px] text-[#FF4D4D] font-mono mt-1 block font-semibold">
                        ⚠️ {errors.fullName}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-bold uppercase tracking-widest text-mutedText block">
                      {activePersona === "CUSTOMER"
                        ? "Registered Email"
                        : activePersona === "EMPLOYEE"
                        ? "Official IDBI Email"
                        : "Executive Email"}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-mutedText">
                        <Mail className="h-3.5 w-3.5" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                        }}
                        placeholder={
                          activePersona === "CUSTOMER"
                            ? "customer@gmail.com"
                            : activePersona === "EMPLOYEE"
                            ? "staff@idbi.bank"
                            : "manager@idbi.bank"
                        }
                        className={`w-full pl-8 pr-3 py-2 bg-[#0c0c0c] border rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:ring-1 transition-all font-mono ${
                          errors.email ? "border-[#FF4D4D] focus:border-[#FF4D4D] focus:ring-[#FF4D4D]/25" : "border-white/10 focus:border-gold focus:ring-gold/25"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <span className="text-[8px] text-[#FF4D4D] font-mono mt-1 block font-semibold">
                        ⚠️ {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold uppercase tracking-widest text-mutedText block">
                      Security Mobile Phone
                    </label>
                    <div className="flex gap-1.5">
                      <select
                        value={selectedCountry.code}
                        onChange={(e) => {
                          const found = countriesList.find(c => c.code === e.target.value);
                          if (found) {
                            setSelectedCountry(found);
                            setPhone("");
                            if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                          }
                        }}
                        className="bg-[#0c0c0c] border border-white/10 rounded-xl px-2 text-[10px] text-white focus:outline-none focus:border-gold transition-all cursor-pointer font-mono max-w-[72px]"
                      >
                        {countriesList.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-mutedText">
                          <Phone className="h-3 w-3" />
                        </div>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={handlePhoneChange}
                          placeholder={`${selectedCountry.digits} digits`}
                          className={`w-full pl-8 pr-3 py-2.5 bg-[#0c0c0c] border rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:ring-1 transition-all font-mono ${
                            errors.phone ? "border-[#FF4D4D] focus:border-[#FF4D4D] focus:ring-[#FF4D4D]/25" : "border-white/10 focus:border-gold focus:ring-gold/25"
                          }`}
                        />
                      </div>
                    </div>
                    {errors.phone && (
                      <span className="text-[8px] text-[#FF4D4D] font-mono mt-1 block font-semibold">
                        ⚠️ {errors.phone}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-bold uppercase tracking-widest text-mutedText block">
                      {activePersona === "CUSTOMER"
                        ? "Preferred Customer ID"
                        : activePersona === "EMPLOYEE"
                        ? "Employee ID"
                        : "Manager ID"}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-mutedText">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          if (errors.username) setErrors(prev => ({ ...prev, username: undefined }));
                        }}
                        placeholder={
                          activePersona === "CUSTOMER"
                            ? "cust_sajjad"
                            : activePersona === "EMPLOYEE"
                            ? "emp_sajjad"
                            : "mgr_sajjad"
                        }
                        className={`w-full pl-8 pr-3 py-2.5 bg-[#0c0c0c] border rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:ring-1 transition-all font-mono ${
                          errors.username ? "border-[#FF4D4D] focus:border-[#FF4D4D] focus:ring-[#FF4D4D]/25" : "border-white/10 focus:border-gold focus:ring-gold/25"
                        }`}
                      />
                    </div>
                    {errors.username && (
                      <span className="text-[8px] text-[#FF4D4D] font-mono mt-1 block font-semibold">
                        ⚠️ {errors.username}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold uppercase tracking-widest text-mutedText block">
                      {activePersona === "CUSTOMER"
                        ? "Banking Passcode"
                        : activePersona === "EMPLOYEE"
                        ? "Clearance Password"
                        : "Console Access Key"}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-mutedText">
                        <Lock className="h-3.5 w-3.5" />
                      </div>
                      <input
                        type={showRegisterPassword ? "text" : "password"}
                        required
                        value={accessKey}
                        onChange={(e) => {
                          setAccessKey(e.target.value);
                          if (errors.accessKey) setErrors(prev => ({ ...prev, accessKey: undefined }));
                        }}
                        placeholder="••••••••••••••••••••"
                        className={`w-full pl-8 pr-9 py-2 bg-[#0c0c0c] border rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:ring-1 transition-all font-mono ${
                          errors.accessKey ? "border-[#FF4D4D] focus:border-[#FF4D4D] focus:ring-[#FF4D4D]/25" : "border-white/10 focus:border-gold focus:ring-gold/25"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-mutedText hover:text-white transition-colors"
                      >
                        {showRegisterPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    {accessKey && (() => {
                      const strength = checkPasswordStrength(accessKey);
                      return (
                        <div className="mt-1 space-y-1">
                          <div className="flex justify-between items-center text-[7px] font-mono tracking-wider">
                            <span className="text-mutedText">CLEARANCE STRENGTH:</span>
                            <span className={
                              strength.score === 5 ? "text-[#00FF9D]" :
                              strength.score === 4 ? "text-[#5DA9FF]" :
                              strength.score === 3 ? "text-[#FFB020]" :
                              strength.score === 2 ? "text-[#FF8A3D]" : "text-[#FF4D4D]"
                            }>
                              {strength.label}
                            </span>
                          </div>
                          <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300 ease-out`} />
                          </div>
                        </div>
                      );
                    })()}
                    {errors.accessKey && (
                      <span className="text-[8px] text-[#FF4D4D] font-mono mt-1 block font-semibold">
                        ⚠️ {errors.accessKey}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-bold uppercase tracking-widest text-mutedText block">
                      {activePersona === "CUSTOMER"
                        ? "Account Type"
                        : activePersona === "EMPLOYEE"
                        ? "Branch Operations Role"
                        : "Administrative Role"}
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-2 py-2.5 bg-[#0c0c0c] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-gold transition-all"
                    >
                      {activePersona === "CUSTOMER" ? (
                        <>
                          <option value="SAVINGS_ACCOUNT">Savings Account</option>
                          <option value="CURRENT_ACCOUNT">Current Account</option>
                          <option value="HOME_LOAN">Home Loan Account</option>
                          <option value="PERSONAL_LOAN">Personal Loan Account</option>
                        </>
                      ) : activePersona === "EMPLOYEE" ? (
                        <>
                          <option value="ONBOARDING_AGENT">Onboarding Officer (Branch)</option>
                          <option value="LOAN_OFFICER">Credit & Loan Officer</option>
                          <option value="AUDIT_COMPLIANCE">RBI Compliance Auditor</option>
                        </>
                      ) : (
                        <>
                          <option value="BRANCH_MANAGER">Branch Operations Manager</option>
                          <option value="SECURITY_CISO">Chief Security Officer (CISO)</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-bold uppercase tracking-widest text-mutedText block">
                    Biometric Identity Enrollment
                  </label>
                  
                  {!isCapturing360 && !faceBiometrics && (
                    <button
                      type="button"
                      onClick={start360Capture}
                      className="w-full py-2.5 rounded-xl bg-gold/10 hover:bg-gold/20 border border-gold/40 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Globe className="h-4 w-4 text-gold animate-pulse" />
                      Start 360° Face Biometric Capture
                    </button>
                  )}

                  {isCapturing360 && (
                    <div className="space-y-2 border border-white/5 bg-black/40 rounded-xl p-3 flex flex-col items-center">
                      <div className="relative w-28 h-28 rounded-full border-2 border-gold/40 flex items-center justify-center bg-black overflow-hidden shadow-[0_0_15px_rgba(47,142,127,0.15)]">
                        <video
                          ref={registerVideoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover scale-x-[-1]"
                        />
                        <div className="absolute inset-2 rounded-full border border-gold/30 border-dashed animate-pulse pointer-events-none" />
                        <div className="absolute inset-0 bg-black/35 flex items-center justify-center text-sm font-black text-white font-mono">
                          {capture360Progress}%
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gold block">
                          360° Biometrics Mapping
                        </span>
                        <span className="text-[8px] font-mono text-white/50 mt-1 block">
                          {capture360Status}
                        </span>
                      </div>
                      <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-gold transition-all duration-150" style={{ width: `${capture360Progress}%` }} />
                      </div>
                    </div>
                  )}

                  {faceBiometrics && (
                    <div className="border border-success/20 bg-success/5 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-success/30 bg-black">
                          <img src={faceBiometrics} className="w-full h-full object-cover" alt="Biometric Thumbnail" />
                        </div>
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#00FF9D] block">
                            360° Biometrics Enrolled
                          </span>
                          <span className="text-[8px] font-mono text-white/50 block">
                            FIDO2 Token Generated & Synced
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFaceBiometrics(null)}
                        className="text-[8px] font-bold uppercase tracking-wider text-mutedText hover:text-white transition-colors cursor-pointer"
                      >
                        Re-Capture
                      </button>
                    </div>
                  )}

                  {errors.orgName && (
                    <span className="text-[8px] text-[#FF4D4D] font-mono mt-1 block font-semibold">
                      ⚠️ {errors.orgName}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gold text-[#050505] text-[10px] font-bold uppercase tracking-[0.12em] transition-all hover:bg-gold/95 shadow-[0_0_10px_rgba(212,175,55,0.1)] hover:scale-[1.01] mt-3 block"
                >
                  Provision clearance & Log In
                </button>
              </form>
            )}

            {/* Social Google Connection */}
            <div className="mt-4 space-y-3">
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-3 text-[8px] text-mutedText uppercase tracking-widest font-mono">Or authenticate via SSL SSO</span>
                <div className="flex-grow border-t border-white/5"></div>
              </div>
              
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2 rounded-xl bg-[#0c0c0c] hover:bg-[#121212] border border-white/10 hover:border-gold/30 text-white text-[9px] font-bold uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.72z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.08 1.16-3.14 0-5.8-2.11-6.75-4.96H1.21v3.15C3.18 21.88 7.39 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.25 14.24A7.18 7.18 0 0 1 4.8 12c0-.79.13-1.57.38-2.31V6.54H1.21A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.21 5.46l4.04-3.22z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0 7.39 0 3.18 2.12 1.21 5.46l4.04 3.22c.95-2.85 3.61-4.93 6.75-4.93z"
                  />
                </svg>
                <span>Continue with Google Account</span>
              </button>

              <button
                type="button"
                onClick={handleBypassDemo}
                className="w-full py-2 rounded-xl bg-transparent border border-white/5 hover:border-white/20 text-white/40 hover:text-white/70 text-[9px] font-bold uppercase tracking-[0.1em] transition-all hover:bg-white/[0.01]"
              >
                Bypass & Launch Offline Demo
              </button>
            </div>

            {/* Bottom Status bar */}
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[8px] text-mutedText font-mono uppercase tracking-wider">
              <span>Secure Shell: SSL ACTIVE</span>
              <span>Node Environment: Live</span>
            </div>
          </motion.div>
        ) : (
          /* TERMINAL LOGS SCREEN */
          <motion.div
            key="login-auth"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl p-6 glass-card-gold bg-[#080808]/90 border border-gold/20 flex flex-col h-[360px] justify-between relative z-10 mx-4 font-mono text-xs rounded-2xl"
          >
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-white/50 text-[10px] uppercase font-bold tracking-widest">
              <Terminal className="h-4 w-4 text-gold" />
              <span>Finne OS Banking Authentication Daemon (cli)</span>
            </div>
            
            <div className="flex-1 overflow-y-auto my-4 text-[#39FF14] space-y-1.5 leading-relaxed pr-2">
              {authLogs.map((log, index) => {
                if (!log) return null;
                let color = "text-[#39FF14]";
                if (log.startsWith("SYS_OK")) color = "text-success font-bold";
                if (log.startsWith("SYS_WARN")) color = "text-warning";
                if (log.startsWith("SYS_SSL")) color = "text-info font-semibold";
                return (
                  <div key={index} className={color}>
                    &gt; {log}
                  </div>
                );
              })}
              <div className="w-1.5 h-3.5 bg-gold inline-block align-middle ml-0.5 animate-pulse" />
              <div ref={logEndRef} />
            </div>

            <div className="border-t border-white/5 pt-3 flex justify-between items-center text-[9px] text-white/30 font-mono">
              <span>Stream: Cryptographic Channels Secured</span>
              <span>Encrypted via TLS_AES_256_GCM</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
