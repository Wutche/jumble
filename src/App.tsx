import 'yet-another-react-lightbox/styles.css'
import './index.css'

import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { PageManager } from './PageManager'
import { AutoplayProvider } from './providers/AutoplayProvider'
import { BookmarksProvider } from './providers/BookmarksProvider'
import { FavoriteRelaysProvider } from './providers/FavoriteRelaysProvider'
import { FeedProvider } from './providers/FeedProvider'
import { FollowListProvider } from './providers/FollowListProvider'
import { MediaUploadServiceProvider } from './providers/MediaUploadServiceProvider'
import { MuteListProvider } from './providers/MuteListProvider'
import { NostrProvider } from './providers/NostrProvider'
import { NoteStatsProvider } from './providers/NoteStatsProvider'
import { ScreenSizeProvider } from './providers/ScreenSizeProvider'
import { ZapProvider } from './providers/ZapProvider'

export default function App(): JSX.Element {
  return (
    <ThemeProvider>
      <AutoplayProvider>
        <ScreenSizeProvider>
          <NostrProvider>
            <ZapProvider>
              <FavoriteRelaysProvider>
                <FollowListProvider>
                  <MuteListProvider>
                    <BookmarksProvider>
                      <FeedProvider>
                        <NoteStatsProvider>
                          <MediaUploadServiceProvider>
                            <PageManager />
                            <Toaster />
                          </MediaUploadServiceProvider>
                        </NoteStatsProvider>
                      </FeedProvider>
                    </BookmarksProvider>
                  </MuteListProvider>
                </FollowListProvider>
              </FavoriteRelaysProvider>
            </ZapProvider>
          </NostrProvider>
        </ScreenSizeProvider>
      </AutoplayProvider>
    </ThemeProvider>
  )
}
