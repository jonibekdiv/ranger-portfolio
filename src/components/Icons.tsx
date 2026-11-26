import type { JSX, SVGProps } from 'react'
import type { SkillId } from '../data/content'

type P = SVGProps<SVGSVGElement>

export const Logo = (p: P) => (
  <svg viewBox="0 0 40 40" aria-hidden="true" {...p}>
    <path fill="currentColor" d="M4 4h19c7.2 0 11.5 3.8 11.5 9.8 0 4.4-2.4 7.6-6.4 8.9L36 36H25.4l-6.2-11.6h-5.8L10.3 36H.6z" />
    <path fill="#050505" d="M14.6 11.2h7.6c2.5 0 3.9 1.1 3.9 3s-1.4 3.1-3.9 3.1h-9.4z" />
    <path d="M2 30 34 6" stroke="#050505" strokeWidth="2.4" />
  </svg>
)

export const TelegramIcon = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path fill="currentColor" d="M21.4 3.6 2.9 10.8c-1.3.5-1.3 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.9-1.4-1.5ZM9.5 14.5l-.4 4-1.5-4.7 10-6.4-8.1 7.1Z" />
  </svg>
)

export const GithubIcon = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path fill="currentColor" d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
  </svg>
)

export const InstagramIcon = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)

const shield = 'M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438z'

export const techIcons: Record<SkillId, JSX.Element> = {
  html: (
    <svg viewBox="0 0 24 24">
      <path fill="#e34f26" d={shield} />
      <path fill="#fff" d="M12 4.4H5.4l.7 8h6v-2.6H8.5l-.2-2.8H12zM12 16.2l-2.9-.8-.2-2.1H6.3l.3 4.2L12 19z" />
      <path fill="#ebebeb" d="M12 4.4v2.6h6.5l.2-2.6zM12 9.8v2.6h3.2l-.3 3.4-2.9.8V19l5.4-1.5.7-7.7z" />
    </svg>
  ),
  css: (
    <svg viewBox="0 0 24 24">
      <path fill="#1572b6" d={shield} />
      <path fill="#fff" d="M12 4.4H5.4l.2 2.6H12zm0 5.4H6l.2 2.6H12zm0 6.4-2.9-.8-.2-2.1H6.3l.3 4.2L12 19z" />
      <path fill="#ebebeb" d="M12 4.4V7h6.4l.2-2.6zm0 5.4v2.6h3.2l-.3 3.4-2.9.8V19l5.4-1.5.9-9.7z" />
    </svg>
  ),
  js: (
    <svg viewBox="0 0 24 24">
      <rect width="24" height="24" rx="2.5" fill="#f7df1e" />
      <path fill="#111" d="M6.6 19.4l1.6-1c.3.6.6 1 1.2 1s1-.3 1-1.2v-6.4h2v6.4c0 2-1.2 2.9-2.9 2.9-1.5 0-2.4-.8-2.9-1.7zm6.9-.2 1.6-1c.4.7 1 1.2 2 1.2.8 0 1.4-.4 1.4-1 0-.7-.5-.9-1.5-1.3l-.5-.2c-1.5-.6-2.4-1.4-2.4-3 0-1.5 1.1-2.6 2.9-2.6 1.3 0 2.2.4 2.8 1.6l-1.5 1c-.3-.6-.7-.8-1.3-.8-.6 0-.9.4-.9.8 0 .6.4.8 1.2 1.2l.5.2c1.8.8 2.7 1.5 2.7 3.2 0 1.8-1.4 2.8-3.4 2.8-1.9 0-3.1-.9-3.6-2.1z" />
    </svg>
  ),
  react: (
    <svg viewBox="-12 -11 24 22">
      <circle r="2.05" fill="#61dafb" />
      <g stroke="#61dafb" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  ),
  next: (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="11.5" fill="#fff" />
      <path d="M8.3 7.4v9.2M8.3 7.4l8.2 10.9M15.7 7.4v6.1" stroke="#000" strokeWidth="1.7" strokeLinecap="square" />
    </svg>
  ),
  ts: (
    <svg viewBox="0 0 24 24">
      <rect width="24" height="24" rx="3" fill="#3178c6" />
      <path fill="#fff" d="M13.2 12.3v1.3h-2.9V22H8.7v-8.4H5.8v-1.3zm.6 8.9v-1.7c.9.7 2 1.1 3.1 1.1 1.1 0 1.7-.4 1.7-1.1 0-.7-.5-1-1.9-1.6-1.9-.7-2.7-1.5-2.7-2.9 0-1.8 1.5-2.8 3.5-2.8 1 0 1.8.2 2.4.4v1.6a4.4 4.4 0 0 0-2.4-.7c-.9 0-1.5.4-1.5 1 0 .6.4.9 1.7 1.4 2 .8 2.9 1.6 2.9 3.1 0 1.9-1.5 2.9-3.7 2.9-1.3 0-2.4-.3-3.1-.7z" />
    </svg>
  ),
  tailwind: (
    <svg viewBox="0 0 24 24">
      <path fill="#38bdf8" d="M12 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.9.2 1.6.9 2.3 1.6 1.2 1.2 2.5 2.6 5.5 2.6 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.9-.2-1.6-.9-2.3-1.6C16.3 6.2 15 4.8 12 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.9.2 1.6.9 2.3 1.6 1.2 1.2 2.5 2.6 5.5 2.6 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.9-.2-1.6-.9-2.3-1.6C10.3 13.4 9 12 6 12z" />
    </svg>
  ),
  node: (
    <svg viewBox="0 0 24 24">
      <path fill="none" stroke="#5fa04e" strokeWidth="1.6" strokeLinejoin="round" d="M12 1.6 20.9 6.8v10.4L12 22.4 3.1 17.2V6.8z" />
      <text x="12" y="14.4" textAnchor="middle" fill="#5fa04e" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="6.4">node</text>
    </svg>
  ),
  git: (
    <svg viewBox="0 0 24 24">
      <path fill="#f05033" d="M23.5 10.9 13.1.5a1.5 1.5 0 0 0-2.2 0L8.8 2.7l2.7 2.7a1.8 1.8 0 0 1 2.3 2.3l2.6 2.6a1.8 1.8 0 1 1-1.1 1v-.1L12.8 8.8v6.4a1.8 1.8 0 1 1-1.5-.1V8.6a1.8 1.8 0 0 1-1-2.4L7.7 3.6.5 10.9a1.5 1.5 0 0 0 0 2.2l10.4 10.4a1.5 1.5 0 0 0 2.2 0l10.4-10.4a1.5 1.5 0 0 0 0-2.2" />
    </svg>
  ),
  github: <GithubIcon style={{ color: '#fff' }} />,
  three: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round">
      <path d="M3 21 8.5 2l13 4.5z" />
      <path d="M5.8 11.5 14.8 4.3M5.8 11.5 17 14M14.8 4.3 17 14M12.3 17.6 18 9.8M3 21l9.3-3.4" />
    </svg>
  ),
  gsap: (
    <svg viewBox="0 0 24 24">
      <rect x=".6" y=".6" width="22.8" height="22.8" rx="5" fill="#0e100f" stroke="#88ce02" strokeWidth="1.2" />
      <path fill="#88ce02" d="M4.4 13.9c0-2.5 1.5-4.4 3.8-4.4 1.6 0 2.6.8 3 2l-1.4.5c-.2-.7-.8-1.1-1.6-1.1-1.3 0-2.1 1.1-2.1 3 0 1.8.8 3 2.2 3 .9 0 1.5-.5 1.7-1.3H8.5v-1.3h3.1c0 2.3-1.3 4-3.5 4-2.3 0-3.7-1.8-3.7-4.4z" />
      <path fill="#fff" d="M13.2 15.6l1.2-.8c.4.8 1 1.2 1.8 1.2.7 0 1.1-.3 1.1-.8s-.4-.7-1.2-1l-.5-.2c-1.2-.5-1.9-1.1-1.9-2.4 0-1.2 1-2.2 2.4-2.2 1.1 0 1.8.4 2.3 1.3l-1.2.8c-.3-.5-.6-.7-1.1-.7-.5 0-.8.3-.8.7 0 .5.3.7 1 1l.4.2c1.5.6 2.2 1.2 2.2 2.5 0 1.4-1.1 2.3-2.7 2.3-1.5 0-2.5-.7-3-1.9z" />
    </svg>
  ),
}
