"use client"

import { Box, Button, TextField } from "@mui/material"
import { useState } from "react"
import { ChatModal } from "./ChatModal"

type  Message= {messageId:string, role: 'user' | 'assistant', content: string}

export const Chat = () => {

    const [message, setMessage]= useState<Message[]>([]);
    const  sentMessagesToBackent = async (message:string)  => {
        const assistantId = crypto.randomUUID();
        const appendToAssistant = (text: string) => {
            setMessage((prev) => {
                if (prev.some((m) => m.messageId === assistantId)) {
                    return prev.map((m) => m.messageId === assistantId ? {...m, content: m.content + text} : m);
                }
                return [...prev, {messageId: assistantId, role: 'assistant', content: text}];
            });
        };
        try{
            const res = await fetch('/api/v1/chat',{method:'POST', headers: {'Content-Type':'application/json'}, body:JSON.stringify({message})});
            if (!res.ok || !res.body) {
                appendToAssistant(`Request failed (${res.status})`);
                return;
            }
            // Backend sends NDJSON: one {"text": "..."} or {"error": "..."} per line.
            const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
            let buffer = '';
            const handleLine = (line: string) => {
                if (!line.trim()) return;
                const parsed = JSON.parse(line);
                if (parsed.text) appendToAssistant(parsed.text);
                if (parsed.error) appendToAssistant(`\n[error: ${parsed.error}]`);
            };
            while (true) {
                const {done, value} = await reader.read();
                if (done) break;
                buffer += value;
                const lines = buffer.split('\n');
                buffer = lines.pop() ?? '';
                lines.forEach(handleLine);
            }
            handleLine(buffer);
        }catch(err){
            console.log('error while sending message to backend', err);
            appendToAssistant(`Error: ${err instanceof Error ? err.message : String(err)}`);
        }
    }

        
    const handleSendMessage = (message: string) => {
        setMessage((prevMessages) => [...prevMessages,{messageId:(crypto.randomUUID()), role:'user', content:message}]);
        sentMessagesToBackent(message);

    }


    return <>
      <h1 className="mb-4 text-3xl font-bold text-black">Welcome to my App</h1>
      <Box sx={{display:'flex',flexDirection:'column',height:'70vh',width:'40%',py:2,backgroundColor:'white', border:'1px solid grey', borderRadius:'16px', padding:'14px', overflow:'hidden'}}>
                    <ChatModal messages = {message}/>

       <Box sx ={{ width:'100%', flexShrink:0, mt:'10px'}}>
                <Input sendMessage={handleSendMessage}/>
       </Box>
      </Box>
    </>
}

type InputProps = {
    sendMessage: (message: string) => void;
}

function Input ({sendMessage}:InputProps) {

    const [draft, sendDraft] = useState<string>('');

    const handleSend = () => {
        sendMessage(draft);
    }

    return <Box sx = {{display:'flex',alignItems:'flex-end', justifyContent:'center', gap:'4px'}}>
            <TextField id="outlined-basic" label="Type your message here..." variant="outlined" multiline maxRows={6} sx = {{width:'100%'}} onChange={(e) => sendDraft(e.target.value)}/>
            <Button variant="contained"  onClick={handleSend}>send</Button>
    </Box>
}