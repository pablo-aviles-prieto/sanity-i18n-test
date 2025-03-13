import {DocumentsIcon, TagsIcon, UsersIcon} from '@sanity/icons'
import {StructureResolver} from 'sanity/structure'
import {locales} from '../lib/i18n'
import {GROUPED_POSTS_PREFIX} from '../utils/const'
import {titleShortener} from '../utils/title-shortener'

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
        .child(
          S.documentList()
            .id('english-posts-pane')
            .title('Grouped Posts (english titles)')
            .schemaType('post')
            .filter('_type == "post" && language == "en"')
            // .initialValueTemplates([
            //   S.initialValueTemplateItem(`${GROUPED_POSTS_PREFIX}-en`, {
            //     id: `${GROUPED_POSTS_PREFIX}-en`,
            //     language: 'en',
            //   }),
            // ])
            .menuItems([
              // Add a custom menu item that creates English posts only
              S.menuItem()
                .title('New English Post')
                // .icon(DocumentsIcon)
                .intent({
                  type: 'create',
                  params: [
                    {type: 'post', template: `${GROUPED_POSTS_PREFIX}-en`},
                    {createEnglishPost: true},
                  ],
                }),
            ])
            .canHandleIntent((intent, params, ctx) => {
              /*
               ** Let the child handle the creation intent, so it checks if the user is just
               ** navigating through the post list or is attempting to create a new post
               */
              return true
            })
            .child(async (postId, {structureContext, ...rest}) => {
              const payload = (rest as any).payload as Record<string, any> | undefined

              const selectedPostData = await structureContext
                .getClient({apiVersion})
                .fetch(SELECTED_POST_QUERY, {postId})

              if (!selectedPostData && payload?.createEnglishPost) {
                return S.document()
                  .schemaType('post')
                  .initialValueTemplate(`${GROUPED_POSTS_PREFIX}-en`)
              }

              const translationGroupId =
                selectedPostData?.translationGroup ?? payload?.translationGroup

              const languagePosts = await structureContext
                .getClient({apiVersion})
                .fetch<
                  Promise<Array<Record<string, string>>>
                >(POSTS_UNDER_TRANSLATION_GROUP_QUERY, {
                  translationGroup: translationGroupId ?? '',
                })
              const existingLanguages = languagePosts.map((post) => post.language)
              const menuItems = locales
                .filter((lang) => !existingLanguages.includes(lang.locale))
                .map((lang) => {
                  return S.menuItem()
                    .title(`Add ${lang.icon} ${lang.title} translation`)
                    .intent({
                      type: 'create',
                      params: [
                        {type: 'post', template: `${GROUPED_POSTS_PREFIX}-${lang.locale}`},
                        {translationGroup: translationGroupId ?? ''},
                      ],
                    })
                })

              return S.documentList()
                .title(
                  `${titleShortener(selectedPostData?.title ?? '', {characters: 15})} Translations`,
                )
                .schemaType('post')
                .filter('_type == "post" && translationGroup == $translationGroup')
                .params({translationGroup: translationGroupId ?? ''})
                .menuItems(menuItems)
                .canHandleIntent((intent, params, ctx) => {
                  if (intent === 'create' && params.template === `${GROUPED_POSTS_PREFIX}-en`) {
                    return false
                  }
                  /*
                   ** Let the child handle the creation intent, so it checks if the user is just
                   ** navigating through the post list or is attempting to create a new post
                   */
                  return true
                })
            }),
        ),

      S.divider(),
      S.documentTypeListItem('author').title('Authors').icon(UsersIcon),
      S.divider(),
      S.documentTypeListItem('category').title('Categories').icon(TagsIcon),
    ])
}
