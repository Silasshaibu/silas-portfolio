import { NextResponse } from 'next/server';

export async function GET() {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Portfolio PDF — Silas Shaibu</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          background: #080808;
          color: #ffffff;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .card {
          text-align: center;
          max-width: 480px;
          padding: 48px 40px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          background: rgba(255,255,255,0.03);
        }
        .icon { font-size: 48px; margin-bottom: 24px; }
        h1 { font-size: 24px; font-weight: 700; margin-bottom: 12px; }
        p { font-size: 15px; color: rgba(255,255,255,0.5); line-height: 1.6; margin-bottom: 24px; }
        a {
          display: inline-block;
          padding: 12px 28px;
          background: #00d4ff;
          color: #080808;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
        }
        .name { color: #00d4ff; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="icon">📄</div>
        <h1>Portfolio PDF</h1>
        <p>
          This document is available upon request.<br />
          Please contact <span class="name">Silas Shaibu</span> directly to receive access to the full portfolio PDF.
        </p>
        <a href="mailto:silasshaibu30bg@gmail.com">Request Access</a>
      </div>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
