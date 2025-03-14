import {Button, Card, Dialog, Stack, Text} from '@sanity/ui'
import {useState} from 'react'
import {DocumentActionDescription, useClient} from 'sanity'
import {TrashIcon} from '@sanity/icons'

export function CustomDeleteDialogAction(props: any): DocumentActionDescription {
  const [dialogOpen, setDialogOpen] = useState(false)
  const toggleOpen = () => setDialogOpen((prev) => !prev)
  console.log('props', props)
  const client = useClient()

  const {draft, published, onComplete} = props
  const documentId = (draft && draft._id) || (published && published._id)
  console.log('documentId', documentId)

  const handleDelete = async () => {
    if (!documentId) {
      console.error('No document ID found')
      return
    }

    try {
      await client.delete(documentId)
      console.log(`Successfully deleted document: ${documentId}`)
      onComplete()
      setTimeout(() => window.location.reload(), 500)
    } catch (err) {
      console.error('Error deleting document:', err)
    } finally {
      toggleOpen()
    }
  }

  return {
    title: 'delete Modal',
    label: 'Delete modal',
    tone: 'critical',
    icon: TrashIcon,
    onHandle: () => setDialogOpen((prev) => !prev),
    dialog: {
      type: 'custom',
      component: dialogOpen && (
        <Dialog
          header="Custom action component"
          id="custom-modal"
          onClickOutside={toggleOpen}
          onClose={toggleOpen}
          width={1}
          footer={
            <>
              <Stack padding={2}>
                <Button onClick={toggleOpen} text="Close" />
              </Stack>
              <Stack padding={2}>
                <Button onClick={handleDelete} text="Delete" tone="critical" />
              </Stack>
            </>
          }
        >
          <Card padding={5}>
            <Text>This dialog is rendered using a custom dialog component.</Text>
          </Card>
        </Dialog>
      ),
    },
  }
}
