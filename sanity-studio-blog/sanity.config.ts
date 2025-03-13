import {defineConfig, Template} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {documentInternationalization} from '@sanity/document-internationalization'
import {BellIcon} from '@sanity/icons'
import {structure} from './structure'
import {locales} from './lib/i18n'
import {v4 as uuidv4} from 'uuid'
import {GROUPED_POSTS_PREFIX} from './utils/const'
import {enhancedPublishPostAction} from './utils/enhanced-publish-post-action'
import {enhancedDeletePostAction} from './utils/enhanced-delete-post-action'

// Environment variables for project configuration
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || ''
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'Clean sanity post i18n',
  icon: BellIcon,
  projectId,
  dataset,

  plugins: [
    // structureTool(),
    structureTool({structure}),
    visionTool(),
    documentInternationalization({
      // Required configuration
      supportedLanguages: [
        {id: 'es', title: 'Spanish'},
        {id: 'en', title: 'English'},
      ],
      schemaTypes: ['post'],
    }),
  ],

  schema: {
    types: schemaTypes,
    // Removing the post's templates and the translation metadata templates, using the custom ones
    templates: (prev) => {
      const filteredTemplates = prev.filter(
        (template) =>
          !template.id.startsWith('post') && !template.id.startsWith('translation.metadata'),
      )

      const grouppedPostsTemplates: Template<any, any>[] = locales.map((lang) => ({
        id: `${GROUPED_POSTS_PREFIX}-${lang.locale}`,
        title: `New ${lang.title} post`,
        schemaType: 'post',
        value: (params: Record<string, any>) => {
          return {
            translationGroup: params?.translationGroup ?? uuidv4(),
            language: lang.locale,
          }
        },
      }))

      return [...filteredTemplates, ...grouppedPostsTemplates]
    },
  },

  document: {
    newDocumentOptions: (prev, opts) => {
      // Check if the creation context is inside the posts list
      if (opts.creationContext?.schemaType === 'post') {
        // Remove all the documents and display it in the structure builder
        return []
      }
      return prev
    },
    actions: (prev, ctx) => {
      // When editing or creating a post
      if (ctx.schemaType === 'post' && ctx.versionType === 'draft') {
        return prev.map((originalAction) =>
          originalAction.action === 'publish'
            ? enhancedPublishPostAction(originalAction)
            : originalAction.action === 'delete'
              ? enhancedDeletePostAction(originalAction)
              : originalAction,
        )
      }

      return prev
    },
  },
})
