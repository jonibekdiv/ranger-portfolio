/** Lightweight CSS workspace for phones, reduced motion and devices without WebGL. */
const lines = [
  '<span class="tok-k">import</span> <span class="tok-t">{ motion }</span> <span class="tok-k">from</span> <span class="tok-s">\'framer-motion\'</span>',
  '<span class="tok-k">export const</span> <span class="tok-f">Hero</span> <span class="tok-t">= () =&gt; (</span>',
  '  <span class="tok-g">&lt;motion.h1</span> <span class="tok-f">animate</span><span class="tok-t">={{ y: 0 }}</span><span class="tok-g">&gt;</span>',
  '    <span class="tok-t">RANGER</span>',
  '  <span class="tok-g">&lt;/motion.h1&gt;</span>',
  '<span class="tok-t">)</span>',
  '<span class="tok-c">// smooth scroll</span>',
  '<span class="tok-k">const</span> <span class="tok-t">lenis =</span> <span class="tok-k">new</span> <span class="tok-f">Lenis</span><span class="tok-t">()</span>',
]
const code = (shift: number) => {
  const l = [...lines.slice(shift), ...lines.slice(0, shift)]
  const block = l.map((x) => `<span>${x}</span>`).join('')
  return block.repeat(6)
}

export default function WorkspaceFallback() {
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[620px]" aria-hidden="true">
      <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(ellipse,rgba(255,32,32,.35),transparent_65%)] blur-xl" />
      <svg viewBox="0 0 120 70" className="animate-flicker absolute right-[4%] top-[2%] w-[20%]">
        <path d="M38 12 14 35l24 23M82 12l24 23-24 23M68 6 52 64" fill="none" stroke="#ff2a2a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 6px #ff2020) drop-shadow(0 0 16px #ff2020)' }} />
      </svg>
      <div className="absolute inset-x-[6%] top-[26%] flex h-[42%] items-end justify-center gap-[1.5%]">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`rounded-md border-2 border-[#232327] bg-[#0c0c0e] p-1 shadow-[0_20px_50px_rgba(0,0,0,.6),0_0_40px_rgba(255,32,32,.15)] ${i === 1 ? 'h-full w-[38%]' : 'h-[80%] w-[30%]'}`}
            style={i === 0 ? { transform: 'perspective(700px) rotateY(18deg)', transformOrigin: 'right' } : i === 2 ? { transform: 'perspective(700px) rotateY(-18deg)', transformOrigin: 'left' } : undefined}
          >
            <div className="h-full overflow-hidden rounded-sm bg-[#070a12] px-1.5 py-1">
              <div className="mon-code" style={{ ['--dur' as string]: `${18 + i * 5}s` }} dangerouslySetInnerHTML={{ __html: code(i * 2) }} />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute right-[2%] bottom-[16%] grid h-[48%] w-[12%] content-center justify-items-center gap-[6%] rounded-lg border border-[#2a2a2e] bg-gradient-to-b from-[#18181b] to-[#060607] shadow-[0_0_30px_rgba(255,32,32,.25)]">
        {[3, 2.4, 3.6].map((d) => (
          <i key={d} className="animate-fan block aspect-square w-[56%] rounded-full border-[3px] border-neon border-t-[#ff8a8a] shadow-[0_0_14px_#ff2020]" style={{ animationDuration: `${d}s` }} />
        ))}
      </div>
      <div className="absolute inset-x-[-2%] bottom-[8%] h-[7%] rounded border-t-2 border-neon/60 bg-gradient-to-b from-[#1a0303] to-black shadow-[0_-8px_40px_rgba(255,32,32,.25)]" />
      <div className="absolute bottom-[12%] left-[33%] h-[4%] w-[28%] rounded border border-[#29292d] bg-[#121215] shadow-[0_0_18px_rgba(255,32,32,.45)]" />
    </div>
  )
}
