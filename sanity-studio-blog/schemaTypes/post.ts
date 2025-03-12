import {defineField, defineType} from 'sanity'
import {BinaryDocumentIcon} from '@sanity/icons'
import {v4 as uuidv4} from 'uuid'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: BinaryDocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
    defineField({
      // should match 'languageField' property in the plugin configuration setting, if customized (defs to language)
      name: 'language',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'translationGroup',
      title: 'Translation Group',
      type: 'string',
      readOnly: true,
      // hidden: true,
      initialValue: () => uuidv4(),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      language: 'language',
    },
    prepare(selection) {
      const {author, language, title} = selection
      return {
        ...selection,
        title: `${title} (${language.toUpperCase()})`,
        subtitle: author && `by ${author}`,
      }
    },
  },
})
