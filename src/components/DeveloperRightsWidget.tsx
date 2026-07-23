import React, { useState } from 'react';
import { MessageCircle, Phone, Code2, ShieldCheck, X, ChevronUp } from 'lucide-react';

export const DeveloperRightsWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const phoneNumber = '778215553';
  const whatsappUrl = 'https://wa.me/967778215553?text=' + encodeURIComponent('السلام عليكم مهندس عبدالحميد داوؤد، أتواصل معك بخصوص شبكة الأمير نت');
  const phoneCallUrl = `tel:${phoneNumber}`;

  return (
    <div className="fixed bottom-4 left-4 z-50 font-['Cairo',sans-serif] flex flex-col items-start gap-2 max-w-[340px]">
      
      {/* Expanded Details Card */}
      {isOpen && (
        <div className="bg-neutral-900/95 backdrop-blur-md border border-amber-500/40 rounded-2xl p-4 shadow-2xl text-neutral-100 text-xs space-y-3 animate-fadeIn w-full">
          
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-400" />
              <span className="font-extrabold text-white text-xs font-['Tajawal']">المبرمج والمهندس المطور</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5">
            <p className="text-[11px] font-bold text-amber-300 leading-relaxed">
              حقوق البرمجة والتصميم والإدارة الكاملة للنظام:
            </p>
            <p className="text-sm font-black text-white font-['Tajawal'] flex items-center gap-1.5">
              <span>المهندس والمبرمج عبدالحميد داوؤد</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400 inline shrink-0" />
            </p>
            <p className="text-[10px] text-neutral-400">
              تطوير كافة الأنظمة الرقمية، شبكات البث المباشر، ولوحة التحكم الاحترافية.
            </p>
          </div>

          {/* Quick Contact Buttons inside modal */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] shadow-lg transition-transform hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>واتساب مباشر</span>
            </a>

            <a
              href={phoneCallUrl}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-[11px] shadow-lg transition-transform hover:scale-105"
            >
              <Phone className="w-4 h-4 fill-neutral-950" />
              <span>اتصال مباشر</span>
            </a>
          </div>

          <div className="text-[10px] text-center text-amber-400/80 font-mono dir-ltr pt-1">
            📞 {phoneNumber}
          </div>

        </div>
      )}

      {/* Floating Action Trigger Bar */}
      <div className="flex items-center gap-2 bg-neutral-950/90 border border-amber-500/50 p-1.5 rounded-full shadow-2xl backdrop-blur-md">
        
        {/* WhatsApp Direct Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg transition-transform hover:scale-110 flex items-center justify-center group"
          title="تواصل مباشر عبر الواتساب - المهندس عبدالحميد داوؤد"
        >
          <MessageCircle className="w-5 h-5 fill-white" />
        </a>

        {/* Call Direct Button */}
        <a
          href={phoneCallUrl}
          className="p-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
          title="اتصال هاتف مباشر: 778215553"
        >
          <Phone className="w-5 h-5 fill-neutral-950" />
        </a>

        {/* Rights Button Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 rounded-full bg-neutral-900 border border-amber-500/30 hover:border-amber-500 text-neutral-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Code2 className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline text-[11px]">المهندس عبدالحميد داوؤد</span>
          <ChevronUp className={`w-3.5 h-3.5 text-amber-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

      </div>

    </div>
  );
};
