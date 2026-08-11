// 'use client'

// import Image from 'next/image'
// import { AnimatePresence, motion } from 'motion/react'
// import { useState } from 'react'
// import { useMusic } from '@/components/music-provider'

// const links = [
//   { label: 'Home', href: '#home' },
//   { label: 'Our Story', href: '#story' },
//   { label: 'Memories', href: '#memories' },
//   { label: 'Celebrations', href: '#celebrations' },
//   { label: 'Venue', href: '#venue' },
// ]

// export function SiteNav() {
//   const [open, setOpen] = useState(false)
//   const { playing, toggle } = useMusic()

//   return (
//     <motion.header
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.6, duration: 0.8 }}
//       className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-3 sm:pt-5"
//     >
//       <nav
//         aria-label="Main"
//         className="flex w-full max-w-3xl items-center justify-between gap-3 rounded-full border border-accent/35 bg-card/75 px-4 py-2.5 shadow-[0_10px_30px_-18px_oklch(0.55_0.07_240/0.6)] backdrop-blur-md"
//       >
//         {/* Logo */}
//         <a
//           href="#home"
//           className="flex items-center justify-center"
//         >
//           <Image
//             src="/media/logo-ak.png"
//             alt="Arnav & Kiara"
//             width={75}
//             height={75}
//             priority
//             className="h-11 w-auto object-contain"
//           />
//         </a>

//         {/* Desktop Links */}
//         <ul className="hidden items-center gap-6 sm:flex">
//           {links.map((l) => (
//             <li key={l.href}>
//               <a
//                 href={l.href}
//                 className="text-[0.66rem] font-medium uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-accent-foreground"
//               >
//                 {l.label}
//               </a>
//             </li>
//           ))}
//         </ul>

//         <div className="flex items-center gap-1.5">
//           {/* Music Button */}
//           <button
//             type="button"
//             onClick={toggle}
//             aria-pressed={playing}
//             className="flex items-center gap-2 rounded-full border border-accent/40 px-3 py-1.5 text-[0.6rem] font-medium uppercase tracking-[0.22em] text-accent-foreground transition-colors hover:bg-accent/10"
//           >
//             <span
//               className="size-1.5 rounded-full"
//               style={{
//                 background: playing ? 'var(--gold)' : 'oklch(0.8 0.02 240)',
//                 boxShadow: playing
//                   ? '0 0 8px 2px oklch(0.86 0.09 85 / 0.7)'
//                   : 'none',
//               }}
//               aria-hidden="true"
//             />
//             Music {playing ? 'On' : 'Off'}
//           </button>

//           {/* Mobile Menu */}
//           <button
//             type="button"
//             onClick={() => setOpen((v) => !v)}
//             aria-expanded={open}
//             aria-label="Menu"
//             className="flex size-9 flex-col items-center justify-center gap-[5px] rounded-full border border-accent/40 sm:hidden"
//           >
//             <span
//               className="h-px w-4 bg-accent-foreground/70 transition-transform"
//               style={
//                 open
//                   ? { transform: 'translateY(3px) rotate(45deg)' }
//                   : undefined
//               }
//             />
//             <span
//               className="h-px w-4 bg-accent-foreground/70 transition-transform"
//               style={
//                 open
//                   ? { transform: 'translateY(-3px) rotate(-45deg)' }
//                   : undefined
//               }
//             />
//           </button>
//         </div>
//       </nav>

//       <AnimatePresence>
//         {open && (
//           <motion.ul
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="absolute top-[4.4rem] w-[calc(100%-2rem)] max-w-xs overflow-hidden rounded-3xl border border-accent/35 bg-card/95 p-2 shadow-xl backdrop-blur-md sm:hidden"
//           >
//             {links.map((l) => (
//               <li key={l.href}>
//                 <a
//                   href={l.href}
//                   onClick={() => setOpen(false)}
//                   className="block rounded-2xl px-4 py-3 text-center text-[0.68rem] font-medium uppercase tracking-[0.26em] text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-accent-foreground"
//                 >
//                   {l.label}
//                 </a>
//               </li>
//             ))}
//           </motion.ul>
//         )}
//       </AnimatePresence>
//     </motion.header>
//   )
// }