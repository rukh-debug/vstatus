import type { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@vercel/kv';
import ReplaceAll from '@/types/ReplaceAll';
import Vsdata from '@/types/Vsdata';
import { db } from '@vercel/postgres';
import { formatDistanceToNow } from 'date-fns';

const compareTimes = (time1: Date): string => formatDistanceToNow(time1, { addSuffix: true });

const sizeFixer = (text1: string, text2: string): number => {
    const text1ConstantSize = 13;
    const text2ConstantSize = 10;
    const size = Math.max(text1.length, text2.length) - Math.max(text1ConstantSize, text2ConstantSize);
    return size > 0 ? size * 4 : 0;
};

const prepareData = async () => {
    if (process.env.DB_TYPE === "postgres") {
        const client = await db.connect();
        return (await client.sql`SELECT * FROM vsdata;`).rows[0];
    } else {
        return await kv.get("vsdata") as Vsdata;
    }
};

const isUserOnline = (statusInterval: number, lastPushToServer: number): boolean => {
    const currentTimestamp: number = Date.now() / 1000;
    const maximumOffset: number = 10;
    const lastPushToServerTimestamp: number = new Date(lastPushToServer).getTime() / 1000;
    return currentTimestamp - lastPushToServerTimestamp <= statusInterval + maximumOffset;
};

const buildTheme = (theme: string, bgc: string, keyfillc: string, valuefillc: string): ReplaceAll => {
    const themes: { [key: string]: { bgc: string; keyfillc: string; valuefillc: string } } = {
        "dark": { bgc: "0d1117", keyfillc: "929292", valuefillc: "929292" },
        "light": { bgc: "fff", keyfillc: "333", valuefillc: "929292" },
        "custom": { bgc, keyfillc, valuefillc },
    };
    return themes[theme] || themes.custom;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { theme, timefor, bgc, keyfillc, valuefillc } = req.query;
    const dataObj = await prepareData();
    const { statusInterval, filename, workspace, initFileOpened, initWorkspaceOpened, lastPushToServer } = dataObj;
    const isOnline = isUserOnline(Number(statusInterval), Number(lastPushToServer));

    const timeForValue = isOnline ? (timefor === "workspace" ? initWorkspaceOpened : initFileOpened) : lastPushToServer;
    const since = compareTimes(new Date(timeForValue));

    let replaceData: ReplaceAll = {
        editingk: isOnline ? "Editing" : "Status",
        workspacek: isOnline ? "Workspace" : "Probably",
        filename: isOnline ? filename : "offline",
        workspace: isOnline ? workspace : "Sleeping",
        since,
        width: (400 + sizeFixer(filename, workspace)).toString(),
        ...buildTheme(theme as string, bgc as string, keyfillc as string, valuefillc as string),
    };

    let payloadSVG = `
  <svg width="${replaceData.width}" height="100" viewBox="0 0 ${replaceData.width} 100" fill="none"
  xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="descId">
  <title id="titleId">vstatus</title>
  <desc id="descId">Live Visual Code Rich Presence</desc>
  <style>
    .box {
      stroke: #666;
      stroke-width: 2px;
      rx: 7px;
      font-family: Arial, sans-serif;
      font-size: 18px;
    }
  
    .key-name {
      fill: #${replaceData.keyfillc}; /* Dark gray */
      font: 600 12px 'Segoe UI', Ubuntu, Sans-Serif;
      <!-- font-weight: bold; -->
    }
  
    .value {
      font: 500 12px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif; 
      fill: #${replaceData.valuefillc};
      white-space: nowrap;
      overflow: hidden;
      width: 0;
    }
  
    /* Animations */
    @keyframes fadein {
      from {
        opacity: 0;
      }
      5% {
        opacity: 0.1;
      }
      15% {
        opacity: 0.3;
      }
      45% {
        opacity: 0.6;
      }
      75% {
        opacity: 0.7;
      }
      to {
        opacity: 1;
      }
    }
  
    .stagger {
      opacity: 1;
      animation: fadein 0.5s ease-in-out forwards;
    }
  
    .icon {
      animation: fadein 0.5s ease-in-out forwards; 
    }
  
  </style>
  
  <rect class="box" x="0.5" y="0.5" rx="4.5" width="99%" height="99%" stroke="#e4e2e2" fill="#${replaceData.bgc}" stroke-opacity="0"/>
  
  <!-- this is svg icon of vscode -->
  <svg class="icon" viewBox="0 0 100 100" fill="none" x="25" y="16" width="65" height="65"
    xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M 70.9 99.3 C 72.5 99.9 74.3 99.9 75.9 99.1 L 96.5 89.2 C 98.6 88.2 100 86 100 83.6 V 16.4 C 100 14 98.6 11.8 96.5 10.8 L 75.9 0.9 C 73.8 -0.1 71.3 0.1 69.5 1.4 C 69.3 1.6 69 1.8 68.8 2.1 L 29.4 38 L 12.2 25 C 10.6 23.8 8.4 23.9 6.9 25.2 L 1.4 30.3 C -0.5 31.9 -0.5 34.8 1.4 36.4 L 16.2 50 L 1.4 63.6 C -0.5 65.2 -0.5 68.1 1.4 69.7 L 6.9 74.8 C 8.4 76.1 10.6 76.2 12.2 75 L 29.4 62 L 68.8 97.9 C 69.4 98.5 70.1 99 70.9 99.3 Z M 75 27.3 L 45.1 50 L 75 72.7 V 27.3 Z" fill="white"/>
    </mask>
    <g mask="url(#mask0)">
      <path d="M 96.5 10.8 L 75.9 0.9 C 73.5 -0.3 70.6 0.2 68.8 2.1 L 1.3 63.6 C -0.5 65.2 -0.5 68.1 1.3 69.7 L 6.8 74.8 C 8.3 76.1 10.5 76.2 12.1 75 L 93.4 13.4 C 96.1 11.3 100 13.2 100 16.7 V 16.4 C 100 14 98.6 11.8 96.5 10.8 Z" fill="#0065a9"/>
      <g filter="url(#filter0_d)">
        <path d="M 96.5 89.2 L 75.9 99.1 C 73.5 100.3 70.6 99.8 68.8 97.9 L 1.3 36.4 C -0.5 34.8 -0.5 31.9 1.3 30.3 L 6.8 25.2 C 8.3 23.9 10.5 23.8 12.1 25 L 93.4 86.6 C 96.1 88.7 100 86.8 100 83.3 V 83.6 C 100 86 98.6 88.2 96.5 89.2 Z" fill="#007acc"/>
      </g>
      <g filter="url(#filter1_d)">
        <path d="M 75.9 99.1 C 73.5 100.3 70.6 99.8 68.8 97.9 C 71.1 100.2 75 98.6 75 95.3 V 4.7 C 75 1.4 71.1 -0.2 68.8 2.1 C 70.6 0.2 73.5 -0.3 75.9 0.9 L 96.5 10.8 C 98.6 11.8 100 14 100 16.4 V 83.6 C 100 86 98.6 88.2 96.5 89.2 L 75.9 99.1 Z" fill="#1f9cf0"/>
      </g>
      <g style="mix-blend-mode: overlay" opacity="0.25">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M 70.9 99.3 C 72.4 99.9 74.2 99.9 75.8 99.1 L 96.4 89.2 C 98.6 88.2 99.9 86 99.9 83.6 V 16.4 C 99.9 14 98.6 11.8 96.4 10.8 L 75.8 0.9 C 73.7 -0.1 71.3 0.1 69.5 1.4 C 69.2 1.6 68.9 1.8 68.7 2.1 L 29.3 38 L 12.1 25 C 10.5 23.8 8.3 23.9 6.8 25.2 L 1.3 30.3 C -0.5 31.9 -0.5 34.8 1.3 36.4 L 16.2 50 L 1.3 63.6 C -0.5 65.2 -0.5 68.1 1.3 69.7 L 6.8 74.8 C 8.3 76.1 10.5 76.2 12.1 75 L 29.3 62 L 68.7 97.9 C 69.3 98.5 70.1 99 70.9 99.3 Z M 75 27.3 L 45 50 L 75 72.7 V 27.3 Z" fill="url(#paint0_linear)"/>
      </g>
    </g>
    <defs>
      <filter id="filter0_d" x="-8.39411" y="15.8291" width="116.727" height="92.2456" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
        <feOffset/>
        <feGaussianBlur stdDeviation="4.16667"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="overlay" in2="BackgroundImageFix" result="effect1_dropShadow"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
      </filter>
      <filter id="filter1_d" x="60.4167" y="-8.07558" width="47.9167" height="116.151" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
        <feOffset/>
        <feGaussianBlur stdDeviation="4.16667"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="overlay" in2="BackgroundImageFix" result="effect1_dropShadow"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
      </filter>
      <linearGradient id="paint0_linear" x1="49.9392" y1="0.257812" x2="49.9392" y2="99.7423" gradientUnits="userSpaceOnUse">
        <stop stop-color="white"/>
        <stop offset="1" stop-color="white" stop-opacity="0"/>
      </linearGradient>
    </defs>
  </svg>
  <!-- vscode svg icon ends here -->
  <g transform="translate(0, 0)">
    <g class="stagger" style="animation-delay: 50ms" transform="translate(110, 30)">
      <text class="text-item">
        <tspan class="key-name">${replaceData.editingk}: </tspan>
        <tspan class="value">${replaceData.filename}</tspan>
      </text>
    </g>
  </g>
  
  <g transform="translate(0, 0)">
    <g class="stagger" style="animation-delay: 150ms" transform="translate(110, 54)">
      <text class="text-item">
        <tspan class="key-name">${replaceData.workspacek}: </tspan>
        <tspan class="value">${replaceData.workspace}</tspan>
      </text>
    </g>
  </g>
  
  <g transform="translate(0, 0)">
    <g class="stagger" style="animation-delay: 200ms" transform="translate(110, 78)">
      <text class="text-item">
        <tspan class="key-name">Since </tspan>
        <tspan class="value">${replaceData.since}</tspan>
      </text>
    </g>
  </g>
  </svg>`;

    const buff = Buffer.from(payloadSVG, "utf-8");
    res.appendHeader('Content-Type', 'image/svg+xml');
    res.appendHeader('Cache-Control', 'no-cache');
    res.send(buff);
}