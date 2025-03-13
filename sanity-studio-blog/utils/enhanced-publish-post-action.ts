import {useEffect, useState} from 'react'
import {DocumentActionComponent, DocumentActionProps} from 'sanity'

export function enhancedPublishPostAction(originalPublishAction: DocumentActionComponent) {
  const ReloadWindow = (props: DocumentActionProps) => {
    const [isDrafting, setIsDrafting] = useState(false)

    useEffect(() => {
      if (props.draft) {
        console.log('started publishing')
        setIsDrafting(true)
      }
    }, [props.draft])
    useEffect(() => {
      // the motherfucking onHandle doesnt update the setter of useState
      let timerRef: NodeJS.Timeout | null = null
      if (isDrafting && !props.draft) {
        console.log('finished publishing')
        timerRef = setTimeout(() => window.location.reload(), 500)
      }
      return () => {
        if (timerRef) clearTimeout(timerRef)
      }
    }, [isDrafting, props.draft])

    const originalResult = originalPublishAction(props)
    if (!originalResult) return null

    return originalResult
  }

  return ReloadWindow
}
