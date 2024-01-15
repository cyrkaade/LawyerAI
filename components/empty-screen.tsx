import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

const exampleMessages = [
  {
    heading: 'Is it possible to do this?',
    message: `Is it possible to do this?`
  },
  {
    heading: 'Give solution to this situation',
    message: 'Give solution to this situation: \n'
  },
  {
    heading: 'What rights do I have?',
    message: `What rights do I have? \n`
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to LawyerAI!
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          This is a helpful legal assistant. Just ask a question about laws or legal system of Kazakhstan.
        </p>
        <p className="leading-normal text-muted-foreground">
          You can start a conversation here by choosing a question:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base text-left"  
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
