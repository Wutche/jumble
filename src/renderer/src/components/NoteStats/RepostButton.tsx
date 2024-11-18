import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { createRepostDraftEvent } from '@renderer/lib/draft-event'
import { getSharableEventId } from '@renderer/lib/event'
import { cn } from '@renderer/lib/utils'
import { useNostr } from '@renderer/providers/NostrProvider'
import { useNoteStats } from '@renderer/providers/NoteStatsProvider'
import client from '@renderer/services/client.service'
import { Loader, PencilLine, Repeat } from 'lucide-react'
import { Event } from 'nostr-tools'
import { useEffect, useMemo, useState } from 'react'
import PostDialog from '../PostDialog'
import { formatCount } from './utils'

export default function RepostButton({
  event,
  canFetch = false
}: {
  event: Event
  canFetch?: boolean
}) {
  const { publish, checkLogin } = useNostr()
  const { noteStatsMap, fetchNoteRepostCount, fetchNoteRepostedStatus, markNoteAsReposted } =
    useNoteStats()
  const [reposting, setReposting] = useState(false)
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false)
  const { repostCount, hasReposted } = useMemo(
    () => noteStatsMap.get(event.id) ?? {},
    [noteStatsMap, event.id]
  )
  const canRepost = !hasReposted && !reposting

  useEffect(() => {
    if (!canFetch) return

    if (repostCount === undefined) {
      fetchNoteRepostCount(event)
    }
    if (hasReposted === undefined) {
      fetchNoteRepostedStatus(event)
    }
  }, [])

  const repost = async (e: React.MouseEvent) => {
    e.stopPropagation()
    checkLogin(async () => {
      if (!canRepost) return

      setReposting(true)
      const timer = setTimeout(() => setReposting(false), 5000)

      try {
        const [reposted] = await Promise.all([
          hasReposted === undefined ? fetchNoteRepostedStatus(event) : hasReposted,
          repostCount === undefined ? fetchNoteRepostCount(event) : repostCount
        ])
        if (reposted) return

        const targetRelayList = await client.fetchRelayList(event.pubkey)
        const repost = createRepostDraftEvent(event)
        await publish(repost, targetRelayList.read.slice(0, 5))
        markNoteAsReposted(event.id)
      } catch (error) {
        console.error('repost failed', error)
      } finally {
        setReposting(false)
        clearTimeout(timer)
      }
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'flex gap-1 items-center enabled:hover:text-lime-500',
              hasReposted ? 'text-lime-500' : 'text-muted-foreground'
            )}
            onClick={(e) => e.stopPropagation()}
            disabled={!canRepost}
            title="repost"
          >
            {reposting ? <Loader className="animate-spin" size={16} /> : <Repeat size={16} />}
            <div className="text-sm">{formatCount(repostCount)}</div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          <DropdownMenuItem onClick={repost}>
            <Repeat /> Repost
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              setIsPostDialogOpen(true)
            }}
          >
            <PencilLine /> Quote
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <PostDialog
        open={isPostDialogOpen}
        setOpen={setIsPostDialogOpen}
        defaultContent={'\nnostr:' + getSharableEventId(event)}
      />
    </>
  )
}
