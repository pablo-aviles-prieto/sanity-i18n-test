import {DocumentActionComponent, DocumentActionProps} from 'sanity'

export function enhancedDeletePostAction(originalPublishAction: DocumentActionComponent) {
  const ReloadWindow = (props: DocumentActionProps) => {
    const originalResult = originalPublishAction(props)
    if (!originalResult) return null

    return {
      ...originalResult,
      onHandle: () => {
        if (originalResult?.onHandle) {
          originalResult.onHandle()
          setTimeout(() => window.location.reload(), 1500)
        }
      },
    }
  }

  return ReloadWindow
}
