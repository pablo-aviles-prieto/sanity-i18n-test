import React, {useState, useEffect} from 'react'
import {useClient} from 'sanity'
import {useListeningQuery} from 'sanity-plugin-utils'
import {SanityDocument} from 'sanity/migrate'
import {GROUPED_POSTS_PREFIX} from '../utils/const'
import {StructureBuilder} from 'sanity/structure'

const SELECTED_POST_QUERY = `*[_type == "post" && _id == $postId]`

export const TranslationPane = (props: any) => {
  // const [missingTranslations, setMissingTranslations] = useState<any[]>([])
  // const client = useClient({apiVersion: '2023-03-25'})
  console.log('props', props)
  console.log('props opts', props.options)
  const {
    loading,
    error,
    data: _data,
  } = useListeningQuery<SanityDocument[]>(SELECTED_POST_QUERY, {
    params: {postId: props.options.postId},
    initialValue: [],
  })
  const data = _data as SanityDocument[]
  const selectedPost = data[0]
  console.log('data', data)

  if (!data) return <div>no data</div>

  if (!selectedPost) {
    // return props.opts.S.document()
    //   .schemaType('post')
    //   .initialValueTemplate(`${GROUPED_POSTS_PREFIX}-en`)
  }

  return (
    <>
      {data.map((trans) => (
        <div key={trans._id}>{(trans as any).title}</div>
      ))}
    </>
  )
}
