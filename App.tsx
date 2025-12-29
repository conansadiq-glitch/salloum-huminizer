
import React, { useState, useCallback, useRef } from 'react';
import { AppStatus, HumanizedOutput } from './types';
import { analyzeText, humanizeText } from './services/geminiService';
import ScoreGauge from './components/ScoreGauge';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<HumanizedOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleProcess = async () => {
    if (!inputText.trim()) return;

    try {
      setError(null);
      setStatus(AppStatus.ANALYZING);
      
      const originalAnalysis = await analyzeText(inputText);
      
      setStatus(AppStatus.HUMANIZING);
      const transformedText = await humanizeText(inputText, { audience, tone });
      
      setStatus(AppStatus.ANALYZING);
      const transformedAnalysis = await analyzeText(transformedText);
      
      setResult({
        originalText: inputText,
        transformedText,
        originalAnalysis,
        transformedAnalysis
      });
      setStatus(AppStatus.COMPLETED);
      
      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);

    } catch (err: any) {
      console.error(err);
      setError('حدث خطأ في النظام. يرجى المحاولة مرة أخرى لاحقاً.');
      setStatus(AppStatus.ERROR);
    }
  };

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم نسخ النص بنجاح! جاهز للاستخدام.');
  }, []);

  return (
    <div className="min-h-screen gradient-bg text-slate-200 selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center" dir="rtl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <i className="fas fa-feather-alt text-white"></i>
            </div>
            <span className="text-xl font-black tracking-tighter text-white">Salloum.<span className="text-indigo-400">Huminizer</span></span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">كيف يعمل؟</a>
            <a href="#features" className="hover:text-white transition-colors">المميزات</a>
            <a href="#tool" className="text-indigo-400 font-bold">ابدأ الآن</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4" dir="rtl">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold animate-pulse">
             متاح مجاناً للجميع <i className="fas fa-globe-americas"></i>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
            حول نصوص الذكاء الاصطناعي <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">إلى محتوى بشري 100%</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            أداة Salloum المتقدمة تقوم بإعادة صياغة المحتوى المولد بـ ChatGPT و Gemini ليتخطى أقوى كواشف الذكاء الاصطناعي بذكاء واحترافية.
          </p>
        </div>
      </section>

      {/* Main Tool Area */}
      <main id="tool" className="max-w-6xl mx-auto px-4 py-12" dir="rtl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
              <textarea
                className="relative w-full h-[450px] bg-slate-900/80 border border-slate-800 rounded-[1.8rem] p-8 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none text-lg leading-relaxed placeholder:text-slate-600 shadow-2xl"
                placeholder="ألصق النص المولد بالذكاء الاصطناعي هنا (AI Output)..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={status === AppStatus.ANALYZING || status === AppStatus.HUMANIZING}
              />
              <div className="absolute bottom-6 left-6 text-slate-500 text-xs font-medium">
                {inputText.length} حرف | {inputText.split(/\s+/).filter(Boolean).length} كلمة
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            <div className="p-8 rounded-[1.8rem] glass border-white/5 space-y-6">
              <div className="flex items-center gap-3 text-indigo-400 mb-2">
                <i className="fas fa-magic"></i>
                <h3 className="font-bold">إعدادات الأنسنة</h3>
              </div>
              
              <div className="space-y-3">
                <label className="text-xs text-slate-500 font-bold block">الجمهور المستهدف (اختياري)</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                  placeholder="مثال: قراء مدونة تقنية..."
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs text-slate-500 font-bold block">نبرة الصوت (اختياري)</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                  placeholder="مثال: فكاهي، جاد، تعليمي..."
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                />
              </div>

              <button
                onClick={handleProcess}
                disabled={!inputText || status === AppStatus.ANALYZING || status === AppStatus.HUMANIZING}
                className={`w-full py-5 rounded-2xl font-black text-xl transition-all active:scale-95 flex items-center justify-center gap-4 shadow-2xl
                  ${status === AppStatus.IDLE || status === AppStatus.COMPLETED || status === AppStatus.ERROR
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-indigo-500/40 text-white'
                    : 'bg-slate-800 text-slate-500 cursor-wait'
                  }`}
              >
                {status === AppStatus.ANALYZING && <><i className="fas fa-microscope animate-bounce"></i> جارِ الفحص...</>}
                {status === AppStatus.HUMANIZING && <><i className="fas fa-wand-sparkles animate-spin"></i> جارِ الأنسنة...</>}
                {(status === AppStatus.IDLE || status === AppStatus.COMPLETED || status === AppStatus.ERROR) && (
                  <><i className="fas fa-bolt"></i> ابدأ التحويل</>
                )}
              </button>

              <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                  <i className="fas fa-shield-alt text-emerald-500"></i> خصوصية كاملة: لا يتم حفظ نصوصك.
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                  <i className="fas fa-check-circle text-indigo-500"></i> متوافق مع كواشف GPTZero و Originality.
                </div>
              </div>

              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs text-center font-bold">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div ref={resultsRef} className="mt-20 scroll-mt-24">
          {result && status === AppStatus.COMPLETED && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
              {/* Analytics Header */}
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-white">نتائج التحليل المقارن</h2>
                <p className="text-slate-500 uppercase text-xs font-black tracking-widest">مؤشرات دقة Salloum.Huminizer</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Before Analysis */}
                <div className="p-10 rounded-[2.5rem] bg-slate-900/40 border border-white/5 space-y-8 relative overflow-hidden group hover:border-rose-500/20 transition-all">
                  <div className="absolute top-0 right-0 p-5 bg-rose-500/10 text-rose-400 text-[10px] font-black uppercase tracking-tighter rounded-bl-3xl">ما قبل الأنسنة</div>
                  <div className="flex justify-between items-end">
                    <ScoreGauge score={result.originalAnalysis.aiScore} label="بصمة الآلة" colorClass="text-rose-500" />
                    <ScoreGauge score={result.originalAnalysis.humanScore} label="بصمة البشر" colorClass="text-slate-700" />
                  </div>
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <i className="fas fa-search"></i> ملاحظات المحلل الرقمي
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {result.originalAnalysis.reasons.map((r, i) => (
                        <span key={i} className="px-3 py-1.5 bg-rose-500/5 text-rose-300/60 text-[10px] rounded-lg border border-rose-500/10 font-medium">{r}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* After Analysis */}
                <div className="p-10 rounded-[2.5rem] bg-indigo-500/[0.02] border border-indigo-500/20 space-y-8 relative overflow-hidden group hover:bg-indigo-500/[0.04] transition-all shadow-2xl shadow-indigo-500/5">
                  <div className="absolute top-0 right-0 p-5 bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-tighter rounded-bl-3xl">ما بعد الأنسنة</div>
                  <div className="flex justify-between items-end">
                    <ScoreGauge score={result.transformedAnalysis.aiScore} label="بصمة الآلة" colorClass="text-emerald-500" />
                    <ScoreGauge score={result.transformedAnalysis.humanScore} label="بصمة البشر" colorClass="text-indigo-400" />
                  </div>
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-indigo-400/70 uppercase tracking-widest flex items-center gap-2">
                      <i className="fas fa-check-double"></i> تأكيد الجودة البشرية
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {result.transformedAnalysis.reasons.map((r, i) => (
                        <span key={i} className="px-3 py-1.5 bg-indigo-500/10 text-indigo-300 text-[10px] rounded-lg border border-indigo-500/20 font-medium">{r}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Output Card */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-[2.5rem] blur-xl opacity-50"></div>
                <div className="relative p-10 rounded-[2.5rem] bg-slate-900 border border-white/10 shadow-3xl space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center text-xl">
                        <i className="fas fa-check-circle"></i>
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white">النص البشري النهائي</h3>
                        <p className="text-slate-500 text-xs font-bold">جاهز للنشر دون قلق من الخوارزميات</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(result.transformedText)}
                      className="group/btn w-full md:w-auto px-10 py-4 bg-white hover:bg-indigo-50 text-slate-950 rounded-2xl text-sm font-black transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
                    >
                      <i className="far fa-copy group-hover/btn:scale-110 transition-transform"></i> نسخ المحتوى المكتمل
                    </button>
                  </div>
                  <div className="p-8 bg-slate-950/50 rounded-2xl leading-relaxed text-slate-100 whitespace-pre-wrap font-medium text-lg min-h-[200px]">
                    {result.transformedText}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Info Section */}
      <section id="features" className="py-24 border-t border-white/5" dir="rtl">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 text-2xl mx-auto mb-6">
              <i className="fas fa-user-secret"></i>
            </div>
            <h4 className="text-xl font-bold text-white">حماية الخصوصية</h4>
            <p className="text-slate-500 text-sm leading-relaxed">نحن لا نقوم بتخزين نصوصك أو استخدامها لتدريب نماذجنا. نصوصك ملكك وحدك.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400 text-2xl mx-auto mb-6">
              <i className="fas fa-tachometer-alt"></i>
            </div>
            <h4 className="text-xl font-bold text-white">سرعة البرق</h4>
            <p className="text-slate-500 text-sm leading-relaxed">بفضل محرك Gemini Flash، تحصل على نتائج دقيقة في ثوانٍ معدودة.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 text-2xl mx-auto mb-6">
              <i className="fas fa-brain"></i>
            </div>
            <h4 className="text-xl font-bold text-white">تحليل عميق</h4>
            <p className="text-slate-500 text-sm leading-relaxed">نستخدم خوارزميات لغوية متطورة لمحاكاة أسلوب الكتابة البشري الطبيعي.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center" dir="rtl">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          <div className="flex justify-center items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-xs">
              <i className="fas fa-feather-alt text-white"></i>
            </div>
            <span className="font-black text-white">Salloum.Huminizer</span>
          </div>
          <p className="text-slate-600 text-[10px] font-bold tracking-widest uppercase">
            &copy; {new Date().getFullYear()} جميع الحقوق محفوظة - تم التطوير بواسطة فريق Salloum للذكاء الاصطناعي
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
