import { InvitationExperience } from '@/components/invitation-experience'
import { MusicProvider } from '@/components/music-provider'

export default function Page() {
  return (
    <MusicProvider>
      <InvitationExperience />
    </MusicProvider>
  )
}
