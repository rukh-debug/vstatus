// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@vercel/postgres';
import { kv } from '@vercel/kv';
import ServerResponse from '@/types/ServerResponse';
import Vsdata from '@/types/Vsdata';

// This is to communicate with vscode to server
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ServerResponse>
) {
    if (req.headers[`authorization`] !== process.env.VSTATUS_API_KEY) {
        return res.status(401).json({
            message: "Authorization failed, Please provide correct api key",
            status: false
        });
    }

    if (req.method === 'POST') {
        let body: Vsdata = req.body;
        let client;
        switch (process.env.DB_TYPE) {
            case "postgres":
                client = await db.connect();
                try {
                    await client.sql`SELECT 1 FROM vsdata LIMIT 1`; // Check if the table exists
                } catch (error) {
                    // Table doesn't exist, create a new one
                    await client.sql`CREATE TABLE vsdata (
                        statusInterval varchar(255),
                        filename varchar(255),
                        workspace varchar(255),
                        initFileOpened varchar(255),
                        initWorkspaceOpened varchar(255),
                        lastPushToServer varchar(255)
                    );`;
                }

                // Replace the existing data with the new values
                await client.sql`DELETE FROM vsdata`; // Remove all existing rows

                await client.sql`
                    INSERT INTO vsdata (
                        statusInterval,
                        filename,
                        workspace,
                        initFileOpened,
                        initWorkspaceOpened,
                        lastPushToServer
                    )
                    VALUES (
                        ${body.statusInterval},
                        ${body.filename},
                        ${body.workspace},
                        ${body.initFileOpened},
                        ${body.initWorkspaceOpened},
                        ${body.lastPushToServer}
                    );
                `;
                break;
            case "kv":
                await kv.set(
                    "vsdata",
                    JSON.stringify(body),
                );
                break;
            default:
                // by default KV
                await kv.set(
                    "vsdata",
                    JSON.stringify(body),
                );
                break;
        }

        res.status(200).json({ message: "Data received", status: true });
    } else {
        res.status(401).json({ message: "You can only send post request", status: false });
    }
}