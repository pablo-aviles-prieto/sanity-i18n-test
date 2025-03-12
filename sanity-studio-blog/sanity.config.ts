import {defineConfig, Template} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {documentInternationalization} from '@sanity/document-internationalization'
import {BellIcon} from '@sanity/icons'
import {structure} from './structure'

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
    templates: (prev, context) => {
      const enhancedTemplates: Template<any, any>[] = [
        ...prev,
        {
          id: 'grouped-post-en',
          title: 'New english post groupped',
          schemaType: 'post',
          value: (params: any) => {
            console.log('params groupped-post-en', params)
            return {
              translationGroup: params?.translationGroup ?? 'test',
              language: 'en',
            }
          },
        },
      ]

      return enhancedTemplates
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
