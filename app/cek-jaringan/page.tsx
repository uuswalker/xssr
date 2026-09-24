import React from "react";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaFloat from "@/components/WaFloat";
import PageTransition from "@/components/animations/PageTransition";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Cek Ketersediaan Jaringan XL SATU | Deteksi Fiber Optic",
  description: "Cek langsung apakah lokasi rumah Anda sudah tercover jaringan fiber optic XL SATU. Ketahui ketersediaan jaringan dalam 1 menit secara otomatis.",
  path: "/cek-jaringan/",
});

export default function CekJaringanPage() {
  return (
    <>
      <Header />
      <main className="bg-slate-50 min-h-screen pb-20">
        <PageTransition>
          <div className="pt-24 pb-10 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>
            
            <div className="container mx-auto px-4 relative z-10 text-center max-w-2xl">
              <ScrollReveal>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-6">
                  <i className="fas fa-map-marker-alt text-3xl text-green-400"></i>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight tracking-tight">
                  Cek Ketersediaan Jaringan XL SATU
                </h1>
                <p className="text-blue-100 text-lg md:text-xl mb-8">
                  Ketahui dengan akurat apakah lokasi rumah Anda sudah terjangkau oleh kabel Fiber Optic kami.
                </p>
              </ScrollReveal>
            </div>
          </div>

          <div className="container mx-auto px-4 -mt-8 relative z-20 max-w-xl">
            <ScrollReveal delay={0.2}>
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100 text-center">
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl mb-6 text-left">
                  <h3 className="font-bold flex items-center gap-2 mb-2">
                    <i className="fas fa-info-circle"></i> Cara Mengecek Lokasi
                  </h3>
                  <ul className="text-sm md:text-base space-y-2 text-slate-700 ml-1">
                    <li className="flex gap-2">
                      <i className="fas fa-check text-green-500 mt-1"></i>
                      <span>Tekan tombol cek lokasi di bawah ini.</span>
                    </li>
                    <li className="flex gap-2">
                      <i className="fas fa-check text-green-500 mt-1"></i>
                      <span>Izinkan akses GPS/Lokasi pada browser HP/Laptop Anda.</span>
                    </li>
                    <li className="flex gap-2">
                      <i className="fas fa-check text-green-500 mt-1"></i>
                      <span>Sistem akan langsung menampilkan jarak titik rumah Anda dengan tiang fiber terdekat.</span>
                    </li>
                  </ul>
                </div>

                <button 
                  id="btn-buka-cek-lokasi"
                  className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center justify-center gap-3 group"
                >
                  <i className="fas fa-crosshairs group-hover:rotate-90 transition-transform duration-300"></i>
                  Mulai Cek Titik Lokasi Sekarang
                </button>

                <p className="text-xs text-slate-400 mt-4">
                  * Data lokasi hanya digunakan untuk mengecek ketersediaan jaringan fiber optic dan tidak akan disalahgunakan.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="mt-8 text-center bg-slate-100 rounded-xl p-5 border border-slate-200">
                <p className="text-slate-600 text-sm mb-3">
                  Lebih nyaman kirim Share Location manual via WhatsApp?
                </p>
                <a 
                  href="https://wa.me/6287778999141?text=Halo%20kak,%20tolong%20bantu%20cek%20ketersediaan%20jaringan%20XL%20SATU%20di%20lokasi%20rumah%20saya.%20(Berikut%20saya%20kirimkan%20Share%20Location-nya)"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700"
                >
                  <i className="fab fa-whatsapp text-lg"></i>
                  Chat Admin via WhatsApp
                </a>
              </div>
            </ScrollReveal>
          </div>
        </PageTransition>
      </main>
      <Footer />
      <WaFloat />
    </>
  );
}
