'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Heart, Check } from 'lucide-react'
import { Eyebrow, GoldDivider, SectionShell, Sparkles } from '@/components/decor'
import { wedding } from '@/lib/wedding-config'

type Wish = { name: string; message: string }

const seedWishes: Wish[] = [
  { name: 'Meera Aunty', message: 'May your home always be full of laughter and light.' },
  { name: 'Rohan', message: 'Finally! Saving my dance moves for the sangeet.' },
  { name: 'Dadi', message: 'Aashirwad, beta. Sada sukhi raho.' },
]

export function Blessings() {
  const [wishes, setWishes] = useState<Wish[]>(seedWishes)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    setWishes((w) => [{ name: name.trim(), message: message.trim() }, ...w])
    setName('')
    setMessage('')
    setSent(true)
    window.setTimeout(() => setSent(false), 2600)
  }

  return (
    <SectionShell
      id="blessings"
      background={
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/25 to-background" />
          <Sparkles count={16} className="opacity-60" />
        </>
      }
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <Eyebrow>With Your Blessings</Eyebrow>
        <h2 className="font-serif text-4xl leading-tight text-foreground text-balance sm:text-5xl">
          Leave a wish for us
        </h2>
        <GoldDivider className="w-40" />
        <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
          Your presence is the greatest gift, and your words the sweetest keepsake. Write something
          we can read on our wedding morning.
        </p>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-5 rounded-[2rem] border border-primary/25 bg-card/85 p-8 backdrop-blur-sm sm:p-10"
        >
          <label className="flex flex-col gap-2">
            <span className="text-[0.68rem] font-medium tracking-[0.3em] text-accent-foreground/80 uppercase">
              Your Name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Shah"
              className="rounded-full border border-primary/30 bg-background/70 px-5 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[0.68rem] font-medium tracking-[0.3em] text-accent-foreground/80 uppercase">
              Your Blessing
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Write a few warm words for the couple..."
              className="resize-none rounded-2xl border border-primary/30 bg-background/70 px-5 py-4 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60"
            />
          </label>

          <button
            type="submit"
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary px-8 py-3.5 text-xs font-medium tracking-[0.3em] text-primary-foreground uppercase transition-transform hover:scale-[1.02]"
          >
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.span
                  key="sent"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" aria-hidden="true" />
                  Blessing Sent
                </motion.span>
              ) : (
                <motion.span
                  key="send"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-2"
                >
                  <Heart className="h-4 w-4" aria-hidden="true" />
                  Send Blessing
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <p className="text-center text-xs italic text-muted-foreground">
            {wedding.hashtag} &middot; tag us in your photos
          </p>
        </motion.form>

        <div className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {wishes.map((w, i) => (
              <motion.blockquote
                key={`${w.name}-${w.message}`}
                layout
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: i === 0 ? 0 : 0.04 * i }}
                className="relative rounded-[1.75rem] border border-primary/20 bg-card/70 p-6 backdrop-blur-sm"
              >
                <Heart
                  className="absolute right-5 top-5 h-4 w-4 text-primary/50"
                  aria-hidden="true"
                />
                <p className="font-serif text-lg leading-relaxed text-foreground text-pretty">
                  &ldquo;{w.message}&rdquo;
                </p>
                <footer className="mt-3 text-[0.68rem] font-medium tracking-[0.3em] text-accent-foreground/80 uppercase">
                  {w.name}
                </footer>
              </motion.blockquote>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </SectionShell>
  )
}
