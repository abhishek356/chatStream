import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();
export const chatRouter = Router();
const client = new Anthropic();

chatRouter.post("/chat", async (req, res) => {
    const message = req?.body?.message;
    console.log('the incoming message is', message);
    if (typeof message !== "string" || message.trim().length === 0) {
        res.status(400).json({ error: "A non-empty 'message' string is required." });
        return;
    }

    res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");

    const stream = client.messages.stream({
        max_tokens: 12000,
        messages: [{ role: "user", content: message }],
        model: "claude-haiku-4-5",
    });

    // Stop generating if the client disconnects.
    res.on("close", () => stream.abort());

    // One JSON object per line.
    stream.on("text", (text) => {
        console.log('the text from the stream is', text);
        res.write(JSON.stringify({ text }) + "\n");
    });

    try {
        await stream.finalMessage();
    } catch (err) {
        if (!res.writableEnded && !res.destroyed) {
            const msg = err instanceof Error ? err.message : "Stream failed";
            res.write(JSON.stringify({ error: msg }) + "\n");
        }
    } finally {
        res.end();
    }
});
