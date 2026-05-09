/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";
import {
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  ArrowRight,
  ChevronRight,
  Coffee,
  Menu as MenuIcon,
  X,
  ShoppingBasket,
  Heart,
  Sparkles,
  Star,
  Utensils,
  Wand2,
  Loader2
} from "lucide-react";

// --- CONTACT CONFIGURATION ---
const PHONE_NUMBER = "+34 925 39 02 40";
const WHATSAPP_URL = "https://wa.me/34925390240?text=Hola!%20Me%20gustaría%20hacer%20un%20pedido%20en%20la%20Pastelería%20Ajofrín";

// --- INITIALIZE GEMINI ---
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- DETAILED MENU DATA ---
const MENU_DATA = [
  {
    category: "Panadería Ancestral",
    items: [
      {
        name: "Hogaza de Ajofrín",
        desc: "Elaborada con trigos de la zona, masa madre de 48h y horneado lento en piedra.",
        price: "2,50€",
        img: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?q=80&w=800",
      },
      {
        name: "Barra Gran Reserva",
        desc: "Corteza extra crujiente y miga muy alveolada. El sabor de siempre.",
        price: "1,20€",
        img: "https://images.unsplash.com/photo-1597079910443-60c43fc4f729?q=80&w=800",
      },
      {
        name: "Pan de Centeno y Miel",
        desc: "Sabor intenso y duradero, perfecto para acompañar quesos y aceites.",
        price: "3,20€",
        img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800",
      },
    ],
  },
  {
    category: "Dulces Tradicionales",
    items: [
      {
        name: "Marquesitas de Ajofrín",
        desc: "Nuestra especialidad: almendra fina molida, textura sedosa y azúcar glass.",
        price: "14,00€/kg",
        img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800",
      },
      {
        name: "Palmera Chocolate Oro",
        desc: "Hojaldre de mantequilla pura con una capa gruesa de chocolate belga 70%.",
        price: "2,10€",
        img: "https://images.unsplash.com/photo-1555507036-ab794f4afe5a?q=80&w=800",
      },
      {
        name: "Ensaimada Rellena",
        desc: "Receta artesana con crema pastelera o cabello de ángel local.",
        price: "2,80€",
        img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800",
      },
    ],
  },
];

// --- TESTIMONIALS DATA ---
const TESTIMONIALS = [
  {
    name: "Maria G.",
    rating: 5,
    text: "El mejor pan de toda la comarca. La hogaza de Ajofrín me recuerda al pan que hacía mi abuela cada mañana.",
  },
  {
    name: "Javier R.",
    rating: 5,
    text: "Las marquesitas son espectaculares. Pedí por WhatsApp y el servicio fue impecable. Muy recomendables.",
  },
  {
    name: "Elena S.",
    rating: 5,
    text: "Se nota el cariño y el tiempo en cada pieza. La palmera de chocolate es simplemente de otro planeta.",
  },
];

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  // --- AI GENERATOR STATE ---
  const [customerName, setCustomerName] = useState("");
  const [breadStyle, setBreadStyle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBreads, setGeneratedBreads] = useState<{
    name: string;
    url: string;
    style: string;
  }[]>([]);

  const handleGenerateBread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !breadStyle) return;

    setIsGenerating(true);
    try {
      const prompt = `A highly detailed, photorealistic, appetizing close-up of a rustic artisanal bread, ${breadStyle} style, resting on a wooden table in an old Spanish bakery, warm golden lighting, professional food photography.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { text: prompt },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });

      let imageUrl = "";
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        setGeneratedBreads(prev => [{
          name: customerName,
          url: imageUrl,
          style: breadStyle
        }, ...prev]);
        setCustomerName("");
        setBreadStyle("");
      }
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] text-[#3D2B1F] font-sans overflow-x-hidden selection:bg-[#D4A373] selection:text-white">
      
      {/* 3D FLOATING WHATSAPP BUTTON */}
      <motion.a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-[2rem] shadow-[0_20px_40px_rgba(37,211,102,0.4)] flex items-center gap-3 border-t border-white/20 group"
      >
        <div className="bg-white/20 p-2 rounded-xl">
          <MessageCircle size={28} />
        </div>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap">
          Hacer Pedido
        </span>
      </motion.a>

      {/* NAVBAR */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? "bg-white/80 backdrop-blur-lg py-3 shadow-xl" : "bg-transparent py-6"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#7E5233] p-2 rounded-xl shadow-lg transform rotate-3">
              <ShoppingBasket className="text-white" size={24} />
            </div>
            <span className="font-serif font-black text-2xl tracking-tighter uppercase italic">Ajofrín</span>
          </div>

          <div className="hidden md:flex items-center gap-10 font-bold text-xs uppercase tracking-[0.2em]">
            <a href="#inicio" className="hover:text-[#D4A373] transition-colors">Inicio</a>
            <a href="#productos" className="hover:text-[#D4A373] transition-colors">El Menú</a>
            <a href="#contacto" className="hover:text-[#D4A373] transition-colors">Ubicación</a>
            <a href={`tel:${PHONE_NUMBER}`} className="bg-[#3D2B1F] text-white px-6 py-3 rounded-2xl shadow-xl hover:shadow-[#3D2B1F]/30 transition-all flex items-center gap-2">
              <Phone size={14} /> {PHONE_NUMBER}
            </a>
          </div>

          <button className="md:hidden bg-white p-2 rounded-lg shadow-md" onClick={() => setMobileMenu(true)}>
            <MenuIcon size={24} />
          </button>
        </div>
      </nav>

      {/* 3D HERO SECTION */}
      <section id="inicio" className="relative min-h-screen flex items-center pt-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-[#EAD7BB] px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest text-[#7E5233] mb-8 shadow-sm">
              <Sparkles size={14} /> Artesanos desde 1978
            </div>
            <h1 className="text-6xl md:text-8xl font-serif font-bold leading-[0.9] mb-8">
              El arte de <br />
              <span className="text-[#D4A373] italic font-light tracking-tight">lo natural.</span>
            </h1>
            <p className="text-xl text-[#6B5A4E] max-w-md mb-10 leading-relaxed font-medium">
              Despierta con el olor a pan recién hecho. Tradición, paciencia e ingredientes de Ajofrín en cada bocado.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <a href="#productos" className="bg-[#7E5233] text-white px-10 py-5 rounded-3xl font-bold shadow-[0_20px_40px_rgba(126,82,51,0.3)] hover:-translate-y-2 transition-all flex items-center justify-center gap-3">
                Ver Vitrina <ArrowRight size={20}/>
              </a>
              <div className="flex items-center gap-4 px-8 py-5 bg-white rounded-3xl shadow-sm border border-[#EAD7BB]">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-black text-sm uppercase tracking-wider">Obrador Abierto</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="relative"
          >
            {/* 3D IMAGE COMPOSITION */}
            <div className="relative z-10 p-4 bg-white rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] transition-transform duration-700 hover:scale-[1.02]">
              <img 
                src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=1000" 
                className="rounded-[3.5rem] w-full aspect-[4/5] object-cover"
                alt="Horno artesano"
              />
              <div className="absolute -bottom-10 -left-10 bg-[#FAF7F2] p-8 rounded-[3rem] shadow-2xl border border-[#EAD7BB] hidden lg:block">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#D4A373" className="text-[#D4A373]" />)}
                </div>
                <p className="font-serif font-bold text-2xl italic">"Calidad que <br /> se nota"</p>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-[#D4A373]/10 to-transparent rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* DETAILED MENU SECTION */}
      <section id="productos" className="py-32 px-6 bg-[#F5F1EB] rounded-[4rem] shadow-inner">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6">Nuestras Especialidades</h2>
            <div className="w-24 h-1 bg-[#D4A373] mx-auto rounded-full" />
          </div>

          <div className="space-y-32">
            {MENU_DATA.map((cat, idx) => (
              <div key={idx}>
                <h3 className="text-2xl font-black uppercase tracking-[0.3em] text-[#7E5233]/40 mb-12 flex items-center gap-6">
                  <Utensils size={24} /> {cat.category}
                </h3>
                
                <div className="grid md:grid-cols-3 gap-10">
                  {cat.items.map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -15 }}
                      className="group bg-white p-5 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-transparent hover:border-[#EAD7BB] transition-all duration-500"
                    >
                      <div className="h-64 rounded-[2.5rem] overflow-hidden mb-8 relative">
                        <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={item.name} />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl font-black text-[#7E5233] shadow-sm">
                          {item.price}
                        </div>
                      </div>
                      <div className="px-4 pb-6">
                        <h4 className="text-2xl font-bold mb-3 group-hover:text-[#D4A373] transition-colors">{item.name}</h4>
                        <p className="text-[#6B5A4E] text-sm leading-relaxed mb-10 font-medium">
                          {item.desc}
                        </p>
                        <button 
                          onClick={() => window.open(WHATSAPP_URL)}
                          className="w-full py-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#3D2B1F] hover:text-white transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                          Añadir al pedido <ChevronRight size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT US / PROCESS SECTION */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1555507036-ab794f4afe5a?q=80&w=600" className="rounded-3xl shadow-xl mt-10" alt="Horneado" />
              <img src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=600" className="rounded-3xl shadow-xl" alt="Masa Madre" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#D4A373] text-white p-10 rounded-full shadow-2xl border-8 border-[#FAF7F2]">
              <Heart fill="currentColor" size={40} />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-5xl font-serif font-bold mb-8 italic">El secreto no es la receta, es el tiempo.</h2>
            <p className="text-xl text-[#6B5A4E] mb-8 leading-relaxed">
              En Ajofrín, no entendemos de prisas. Nuestras masas reposan lo que necesitan, usamos leña y materias primas de nuestra tierra toledana.
            </p>
            <div className="space-y-6">
              {[
                { t: "100% Natural", d: "Sin conservantes ni aditivos industriales." },
                { t: "Origen Toledo", d: "Harinas seleccionadas de productores locales." },
                { t: "Amor al Oficio", d: "Tres generaciones de maestros pasteleros." }
              ].map((info, index) => (
                <div key={index} className="flex gap-5">
                  <div className="bg-[#EAD7BB] p-3 rounded-2xl h-fit text-[#7E5233]"><Sparkles size={20}/></div>
                  <div>
                    <h5 className="font-bold text-lg">{info.t}</h5>
                    <p className="text-sm text-[#6B5A4E]">{info.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* AI BREAD GENERATOR SECTION */}
      <section className="py-32 px-6 bg-[#3D2B1F] text-[#FAF7F2] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2000" className="w-full h-full object-cover" alt="background" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#D4A373] text-[#3D2B1F] px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8">
                <Wand2 size={14} /> Obrador de Sueños
              </div>
              <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 italic">Imagina tu Pan <br /><span className="text-[#D4A373]">Perfecto.</span></h2>
              <p className="text-xl text-[#FAF7F2]/70 mb-10 leading-relaxed font-medium">
                Nuestra IA pastelera te ayuda a visualizar el pan de tus sueños. Dinos cómo lo quieres y lo "hornearemos" digitalmente para ti.
              </p>

              <form onSubmit={handleGenerateBread} className="space-y-6 bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-sm">
                <div>
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#D4A373] mb-3">Tu Nombre</label>
                  <input 
                    type="text" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej. Juan de Toledo"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#D4A373] transition-colors font-medium text-white placeholder:text-white/20"
                    disabled={isGenerating}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#D4A373] mb-3">Estilo del Pan</label>
                  <input 
                    type="text" 
                    value={breadStyle}
                    onChange={(e) => setBreadStyle(e.target.value)}
                    placeholder="Ej. Con nueces y pasas, corteza rústica..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#D4A373] transition-colors font-medium text-white placeholder:text-white/20"
                    disabled={isGenerating}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isGenerating || !customerName || !breadStyle}
                  className="w-full bg-[#D4A373] text-[#3D2B1F] py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0 cursor-pointer"
                >
                  {isGenerating ? (
                    <> <Loader2 className="animate-spin" size={20} /> Horneando... </>
                  ) : (
                    <> <Sparkles size={20} /> Crear Pan Imaginario </>
                  )}
                </button>
              </form>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {generatedBreads.length > 0 ? (
                  <AnimatePresence mode="popLayout">
                    {generatedBreads.slice(0, 4).map((bread, i) => (
                      <motion.div
                        key={bread.url}
                        initial={{ opacity: 0, scale: 0.8, rotate: i % 2 === 0 ? -5 : 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 0 }}
                        className="relative group bg-white/5 p-3 rounded-[2.5rem] border border-white/10"
                      >
                        <img 
                          src={bread.url} 
                          className="rounded-[2rem] w-full aspect-square object-cover mb-4" 
                          alt="AI Generated Bread"
                          referrerPolicy="no-referrer"
                        />
                        <div className="px-2 pb-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#D4A373]">Para: {bread.name}</p>
                          <p className="text-xs font-serif italic truncate opacity-60">"{bread.style}"</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <div className="col-span-2 h-[500px] rounded-[4rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center p-10">
                    <Wand2 size={40} className="text-white/20 mb-6" />
                    <p className="text-white/40 font-serif italic text-xl">Tu galería de sueños aún está vacía.<br />¡Empieza a imaginar!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-32 px-6 bg-[#F5F1EB]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4 italic">Lo que dicen nuestros vecinos</h2>
            <p className="text-[#6B5A4E] font-medium italic">Clientes satisfechos desde hace décadas</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testi, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="bg-white p-10 rounded-[3rem] shadow-sm border border-[#EAD7BB]/50 relative"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(testi.rating)].map((_, starIdx) => (
                    <Star key={starIdx} size={16} fill="#D4A373" className="text-[#D4A373]" />
                  ))}
                </div>
                <p className="text-lg text-[#3D2B1F] mb-8 leading-relaxed font-medium italic">
                  "{testi.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#D4A373]/10 rounded-full flex items-center justify-center text-[#D4A373] font-bold">
                    {testi.name[0]}
                  </div>
                  <span className="font-bold text-sm uppercase tracking-widest">{testi.name}</span>
                </div>
                <div className="absolute -top-4 -right-4 bg-[#7E5233] text-white p-3 rounded-2xl rotate-12 shadow-lg">
                   <Coffee size={20} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION & CONTACT SECTION */}
      <section id="contacto" className="py-24 px-6 bg-[#3D2B1F] text-[#FAF7F2] rounded-t-[5rem] relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl md:text-7xl font-serif font-bold mb-12 italic leading-none">Ven a por <br /> tu pan.</h2>
            <div className="space-y-10">
              <div className="flex gap-8 group">
                <div className="bg-white/10 p-5 rounded-[2rem] shadow-xl border border-white/5 transition-transform group-hover:rotate-12"><MapPin className="text-[#D4A373]" size={32}/></div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-2 font-black">Nuestra Casa</p>
                  <p className="text-2xl font-bold font-serif">Calle Real, 14<br />Ajofrín, Toledo</p>
                </div>
              </div>
              <div className="flex gap-8 group">
                <div className="bg-white/10 p-5 rounded-[2rem] shadow-xl border border-white/5 transition-transform group-hover:rotate-12"><Clock className="text-[#D4A373]" size={32}/></div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-2 font-black">Horario del Horno</p>
                  <p className="text-2xl font-bold font-serif">Lunes a Sábado: 07:30 – 20:30</p>
                  <p className="text-lg text-white/60">Domingos y festivos: 08:00 – 14:30</p>
                </div>
              </div>
              <div className="flex gap-8 group">
                <div className="bg-white/10 p-5 rounded-[2rem] shadow-xl border border-white/5 transition-transform group-hover:rotate-12"><Phone className="text-[#D4A373]" size={32}/></div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-2 font-black">Encargos</p>
                  <p className="text-3xl font-black font-serif tracking-tighter">{PHONE_NUMBER}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-[600px] w-full rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white/5 bg-[#2B1B17]">
            <div className="absolute inset-0 flex items-center justify-center text-center p-10 z-20">
               <div className="space-y-6">
                 <div className="w-20 h-20 bg-[#D4A373] rounded-full mx-auto flex items-center justify-center animate-bounce shadow-2xl">
                    <MapPin size={40} className="text-[#3D2B1F]" />
                 </div>
                 <h4 className="text-2xl font-serif italic text-white font-bold">Estamos en el centro de Ajofrín</h4>
                 <a 
                   href={`https://www.google.com/maps/search/?api=1&query=Calle+Real+14+Ajofrin+Toledo`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-block bg-white text-[#3D2B1F] px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest shadow-xl hover:bg-[#D4A373] transition-colors"
                 >
                    Ver en Google Maps
                 </a>
               </div>
            </div>
            <img src="https://images.unsplash.com/photo-1555507036-ab794f4afe5a?q=80&w=1000" className="w-full h-full object-cover opacity-20" alt="Local" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 bg-[#3D2B1F] text-white/30 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <span className="font-serif font-black text-3xl italic text-white tracking-tighter">AJOFRÍN</span>
            <p className="mt-3 text-sm font-medium">Panadería y Pastelería Artesanal desde 1978.</p>
          </div>
          <div className="flex gap-8 font-black text-[10px] uppercase tracking-[0.4em]">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">Aviso Legal</a>
          </div>
          <div className="flex items-center gap-3">
             <Heart size={16} className="text-[#D4A373]" />
             <span className="text-[10px] font-black uppercase tracking-widest italic">Hecho con masa madre</span>
          </div>
        </div>
      </footer>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-[60] bg-[#FAF7F2] p-10 flex flex-col"
          >
            <div className="flex justify-end">
              <button onClick={() => setMobileMenu(false)} className="bg-white p-4 rounded-2xl shadow-lg"><X /></button>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-12 text-center">
              <a href="#inicio" onClick={() => setMobileMenu(false)} className="text-5xl font-serif font-bold italic">Inicio</a>
              <a href="#productos" onClick={() => setMobileMenu(false)} className="text-5xl font-serif font-bold italic">El Menú</a>
              <a href="#contacto" onClick={() => setMobileMenu(false)} className="text-5xl font-serif font-bold italic">Ubicación</a>
              <div className="h-px bg-[#EAD7BB] w-full" />
              <a href={WHATSAPP_URL} className="text-2xl font-black text-[#25D366] tracking-tighter flex items-center justify-center gap-3">
                <MessageCircle fill="currentColor"/> WHATSAPP
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
