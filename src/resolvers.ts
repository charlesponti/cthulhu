const messages: any = []

interface Message {
    content: String
}

export default {
    Query: {
        messages: (): [Message] => messages
    },
    Mutation: {
        addMessage: (_: any, message: String) => {
            messages.push({ content: message })
            return messages[messages.length-1]
        }
    }
}