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
    templates: (prev) => {
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

      return [...prev, ...grouppedPostsTemplates]
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
  },
})
