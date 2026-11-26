import { ArrowUp } from 'lucide-react'
import { GithubIcon, Logo, TelegramIcon } from './Icons'
import { profile } from '../data/content'
import { scrollToId } from '../lib/motion'
import { useI18n } from '../i18n'

export default function Footer() {
  const { t } = useI18n()
  return (
    <footer className="pad-x relative border-t border-white/10 py-10">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-6 sm:flex-row">
        <a href="#home" onClick={(e) => { e.preventDefault(); scrollToId('home') }} className="flex items-center gap-2.5">
          <Logo className="h-8 w-8 text-neon" />
          <span className="font-display text-xl font-black italic text-white">RANGER</span>
        </a>
        <p className="text-sm text-gray">© {new Date().getFullYear()} Jonibek “Ranger”. {t.footer.built}</p>
        <div className="flex gap-3">
          <a href={profile.telegram} target="_blank" rel="noopener" aria-label="Telegram" className="icon-btn glass"><TelegramIcon /></a>
          <a href={profile.github} target="_blank" rel="noopener" aria-label="GitHub" className="icon-btn glass"><GithubIcon /></a>
          <button onClick={() => scrollToId('home')} aria-label={t.footer.top} className="icon-btn glass"><ArrowUp size={20} /></button>
        </div>
      </div>
    </footer>
  )
}
