import fs from 'fs';
import path from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { app } from '../server/app';
import { registerRoutes } from '../server/routes';
import express from 'express';

let initialized = false;

async function initializeApp() {
  if (initialized) return;
  
  await registerRoutes(app);
  
  // Serve static files
  const distPath = path.join(process.cwd(), 'dist/public');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
  }
  
  // Fallback to index.html for client routes
  app.use('*', (_req, res) => {
    const indexPath = path.join(process.cwd(), 'dist/public/index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Not found');
    }
  });
  
  initialized = true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await initializeApp();
  app(req, res);
}
