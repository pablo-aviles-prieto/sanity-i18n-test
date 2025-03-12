import {DocumentsIcon, TagsIcon, UsersIcon} from '@sanity/icons'
import {StructureResolver} from 'sanity/structure'
import {v4 as uuidv4} from 'uuid'

interface TitleShortenerOptions {
  characters?: number
  ellipsis?: boolean
}

const titleShortener = (title: string, options: TitleShortenerOptions = {}) => {
  const {characters = 10, ellipsis = true} = options
  return title.length > characters ? `${title.slice(0, characters)}${ellipsis ? '...' : ''}` : title
}

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
              const query = `*[_id == $postId][0]{translationGroup, title}`
              const data = await structureContext
                .getClient({apiVersion: '2025-03-11'})
                .fetch(query, {postId})
              // Check based on i18n locales which posts are created or not.
              // So the missing languages pass to the menuItems, with the correct template
              // and the translationGroup provided

              return S.documentList()
                .title(`${titleShortener(data?.title ?? '', {characters: 15})} Translations`)
                .schemaType('post')
                .filter('_type == "post" && translationGroup == $translationGroup')
                .params({translationGroup: data?.translationGroup})
                .menuItems([
                  S.menuItem()
                    .title('English post')
                    .intent({
                      type: 'create',
                      params: [
                        {type: 'person', template: 'grouped-post-en'},
                        {translationGroup: data?.translationGroup},
                      ],
                    }),
                ])
            })
        }),

      S.divider(),
      S.documentTypeListItem('author').title('Authors').icon(UsersIcon),
      S.divider(),
      S.documentTypeListItem('category').title('Categories').icon(TagsIcon),
    ])
}
