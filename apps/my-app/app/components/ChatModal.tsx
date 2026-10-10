import { Box, Card, CardContent, Typography } from "@mui/material"


type Message = {
    messageId: string,
    role: 'user' | 'assistant',
    content: string
}

export  const  ChatModal = ({messages}: { messages: Message[]}) => {
    return <>
    <Box sx={{display:'flex', flexDirection:'column', gap:'16px', flex:1, minHeight:0, overflowY:'auto'}}>
        {messages?.map((message) => {
            return <Box key={message.messageId} sx = {{alignSelf:message.role == 'user' ? 'flex-end' : 'flex-start', maxWidth:'70%', overflowWrap:'break-word', whiteSpace:'pre-wrap'}}>
                <ChatUnit message =  {message.content}/>
            </Box>
        })}
    </Box>
    </>
}


type ChatUnitProps = {
    message:  string
}

const ChatUnit = ({message}:{message:string}) =>{
    return<>
    <Card>
        <CardContent>
            <Typography variant="body1"> {message}</Typography>
        </CardContent>
    </Card>
    </>
}
