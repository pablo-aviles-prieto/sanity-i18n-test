import {DocumentIcon, TagsIcon, UsersIcon} from '@sanity/icons'
import {StructureResolver} from 'sanity/structure'

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
        .icon(DocumentIcon)
        .child(
          S.documentList()
            .title('Grouped Posts (english titles)')
            .schemaType('post')
            .filter('_type == "post" && language == "en"')
            .child(async (postId, {structureContext}) => {
              const query = `*[_id == $postId][0]{translationGroup, title}`
              const {translationGroup, title} = await structureContext
                .getClient({apiVersion: '2025-03-11'})
                .fetch(query, {postId})

              return S.documentList()
                .title(`${titleShortener(title, {characters: 15})} Translations`)
                .schemaType('post')
                .filter('_type == "post" && translationGroup == $translationGroup')
                .params({translationGroup})
            }),
        ),

      S.divider(),
      S.documentTypeListItem('author').title('Authors').icon(UsersIcon),
      S.divider(),
      S.documentTypeListItem('category').title('Categories').icon(TagsIcon),
    ])
}
