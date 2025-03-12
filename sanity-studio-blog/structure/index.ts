import {DocumentsIcon, TagsIcon, UsersIcon} from '@sanity/icons'
import {StructureResolver} from 'sanity/structure'
import {locales} from '../lib/i18n'
import {GROUPED_POSTS_PREFIX} from '../utils/const'

interface TitleShortenerOptions {
  characters?: number
  ellipsis?: boolean
}

const titleShortener = (title: string, options: TitleShortenerOptions = {}) => {
  const {characters = 10, ellipsis = true} = options
  return title.length > characters ? `${title.slice(0, characters)}${ellipsis ? '...' : ''}` : title
}

const apiVersion = process.env.SANITY_STUDIO_API_VERSION || '2025-03-12'
const SELECTED_POST_QUERY = `*[_id == $postId][0]{translationGroup, title}`
const POSTS_UNDER_TRANSLATION_GROUP_QUERY = `*[_type == "post" && translationGroup == $translationGroup]{language}`

export const structure: StructureResolver = (S) => {
  return S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Posts')
        .icon(DocumentsIcon)
        .child((id, opts) => {
          return S.documentList()
            .title('Grouped Posts (english titles)')
            .schemaType('post')
            .filter('_type == "post" && language == "en"')
            .menuItems([
              // Add a custom menu item that creates English posts only
              S.menuItem()
                .title('New English Post')
                // .icon(DocumentsIcon)
                .intent({
                  type: 'create',
                  params: {
                    type: 'post-en',
                    template: 'post-en',
                  },
                }),
            ])
            .canHandleIntent((intent, params) => {
              if (intent === 'create') return false // Prevents opening the child pane and opens the creation post pane
              return true
            })
            .child(async (postId, {structureContext}) => {
              const selectedPostData = await structureContext
                .getClient({apiVersion})
                .fetch(SELECTED_POST_QUERY, {postId})
              const translationGroupId = selectedPostData?.translationGroup

              const languagePosts = await structureContext
                .getClient({apiVersion})
                .fetch(POSTS_UNDER_TRANSLATION_GROUP_QUERY, {translationGroup: translationGroupId})
              const existingLanguages: string[] = languagePosts.map(
                (post: Record<string, string>) => post.language,
              )
              const menuItems = locales
                .filter((lang) => !existingLanguages.includes(lang.locale))
                .map((lang) => {
                  return S.menuItem()
                    .title(`Add ${lang.icon} ${lang.title} translation`)
                    .intent({
                      type: 'create',
                      params: [
                        {type: 'post', template: `${GROUPED_POSTS_PREFIX}-${lang.locale}`},
                        {translationGroup: translationGroupId},
                      ],
                    })
                })

              return S.documentList()
                .title(
                  `${titleShortener(selectedPostData?.title ?? '', {characters: 15})} Translations`,
                )
                .schemaType('post')
                .filter('_type == "post" && translationGroup == $translationGroup')
                .params({translationGroup: translationGroupId})
                .menuItems(menuItems)
            })
        }),

      S.divider(),
      S.documentTypeListItem('author').title('Authors').icon(UsersIcon),
      S.divider(),
      S.documentTypeListItem('category').title('Categories').icon(TagsIcon),
    ])
}
