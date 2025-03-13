import {DocumentActionComponent} from 'sanity'

export function enhancedAsyncPublishPostAction(originalPublishAction: any) {
  const BetterAction = (props: any) => {
    const originalResult = originalPublishAction(props)
    return {
      ...originalResult,
      onHandle: () => {
        // Add our custom functionality
        console.log('Hello world! enhancedPublishPostAction')
        // then delegate to original handler
        originalResult.onHandle()
      },
    }
  }
  return BetterAction
}
