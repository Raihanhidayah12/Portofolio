import React, { useState, useEffect } from "react";
import { User, Mail, MessageSquare, Send } from "lucide-react";
import SocialLinks from "../components/SocialLinks";
import Komentar from "../components/Commentar";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { supabase } from "../supabase";
import { SectionShell, SectionHeader, SurfaceCard, inputClass, PrimaryButton } from "../components/ui/layout";

const SWAL_OK = "#38bdf8";

const saveMessageToSupabase = async ({ name, email, message }) => {
  const { error } = await supabase.from("portfolio_messages").insert([
    {
      name,
      email,
      message,
      is_read: false,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    throw error;
  }
};

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    AOS.init({ once: false });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    Swal.fire({
      title: "Mengirim Pesan...",
      html: "Harap tunggu selagi kami mengirim pesan Anda",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const formSubmitUrl = "https://formsubmit.co/ekizulfarrachman@gmail.com";
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("message", formData.message);
      submitData.append("_subject", "Pesan Baru dari Website Portfolio");
      submitData.append("_captcha", "false");
      submitData.append("_template", "table");

      const formSubmitPromise = axios.post(formSubmitUrl, submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const supabasePromise = saveMessageToSupabase(formData);

      const [formResult, dbResult] = await Promise.allSettled([
        formSubmitPromise,
        supabasePromise,
      ]);

      const formSubmitSucceeded = formResult.status === "fulfilled";
      const supabaseSaved = dbResult.status === "fulfilled";

      if (!formSubmitSucceeded && !supabaseSaved) {
        const reason = formResult.status === "rejected" ? formResult.reason : dbResult.reason;
        throw reason;
      }

      if (!supabaseSaved) {
        console.warn("Supabase save failed for contact message:", dbResult.reason);
      }

      Swal.fire({
        title: supabaseSaved ? "Berhasil!" : "Berhasil, tapi...",
        text: supabaseSaved
          ? "Pesan Anda telah berhasil terkirim dan tersimpan di dashboard admin!"
          : "Pesan Anda telah berhasil dikirim, tetapi tidak tersimpan di database Supabase. Periksa kebijakan RLS tabel portfolio_messages.",
        icon: supabaseSaved ? "success" : "warning",
        confirmButtonColor: SWAL_OK,
        timer: 5000,
        timerProgressBar: true,
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      const isNetworkError = error.request?.status === 0 || /Network Error/i.test(error?.message || "");
      const isSupabaseRls = error?.code === "42501" || /row-Level security/i.test(error?.message || "");

      if (isNetworkError) {
        Swal.fire({
          title: "Berhasil!",
          text: "Pesan Anda telah berhasil terkirim!",
          icon: "success",
          confirmButtonColor: SWAL_OK,
          timer: 2000,
          timerProgressBar: true,
        });
        setFormData({ name: "", email: "", message: "" });
      } else if (isSupabaseRls) {
        console.warn("Supabase RLS denied insert:", error);
        Swal.fire({
          title: "Terkirim, tapi belum tersimpan",
          text: "Pesan berhasil dikirim, tetapi Supabase menolak penyimpanan karena kebijakan RLS. Periksa policy pada tabel portfolio_messages.",
          icon: "warning",
          confirmButtonColor: SWAL_OK,
        });
      } else {
        console.error("Contact submit failed:", error);
        Swal.fire({
          title: "Gagal!",
          text: "Terjadi kesalahan. Silakan coba lagi nanti.",
          icon: "error",
          confirmButtonColor: SWAL_OK,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass = `${inputClass} p-4 pl-12`;

  return (
    <SectionShell id="Contact" className="pb-20 pt-24 sm:pt-28">
      <SectionHeader
        label="04 — Contact"
        title="Hubungi Saya"
        subtitle="Punya pertanyaan? Kirimi saya pesan, dan saya akan segera membalasnya."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <SurfaceCard className="p-6 sm:p-8" data-aos="fade-right">
          <h2 className="text-xl font-semibold text-zinc-100">Kirim Pesan</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Ada yang ingin didiskusikan? Isi form di bawah ini.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-4 h-5 w-5 text-zinc-600" />
              <input
                type="text"
                name="name"
                placeholder="Nama Anda"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                className={fieldClass}
                required
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-4 h-5 w-5 text-zinc-600" />
              <input
                type="email"
                name="email"
                placeholder="Email Anda"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className={fieldClass}
                required
              />
            </div>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-zinc-600" />
              <textarea
                name="message"
                placeholder="Pesan Anda"
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`${fieldClass} min-h-[10rem] resize-none`}
                required
              />
            </div>
            <PrimaryButton
              type="submit"
              disabled={isSubmitting}
              wrapperClassName="w-full"
              className="w-full !py-3.5"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
            </PrimaryButton>
          </form>

          <div className="mt-8 border-t border-zinc-800 pt-6">
            <SocialLinks />
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-4 sm:p-6" data-aos="fade-left">
          <Komentar />
        </SurfaceCard>
      </div>
    </SectionShell>
  );
};

export default ContactPage;
