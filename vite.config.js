import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import sendOtpHandler from './api/send-otp.js'
import verifyOtpHandler from './api/verify-otp.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env files in current directory
  const env = loadEnv(mode, process.cwd(), '')
  
  // Expose SMTP and VITE env vars to process.env so the local serverless handler can read them
  Object.assign(process.env, env)

  return {
    plugins: [
      react(),
      {
        name: 'api-serverless-middleware',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url && (req.url.startsWith('/api/send-otp') || req.url.startsWith('/api/verify-otp'))) {
              const targetHandler = req.url.startsWith('/api/send-otp') ? sendOtpHandler : verifyOtpHandler;
              let body = '';
              req.on('data', chunk => {
                body += chunk;
              });
              req.on('end', async () => {
                try {
                  const parsedBody = body ? JSON.parse(body) : {};
                  
                  const mockedReq = {
                    method: req.method,
                    body: parsedBody,
                    headers: req.headers,
                  };
                  
                  const mockedRes = {
                    statusCode: 200,
                    setHeader(name, value) {
                      res.setHeader(name, value);
                    },
                    status(code) {
                      res.statusCode = code;
                      this.statusCode = code;
                      return this;
                    },
                    json(data) {
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify(data));
                    },
                    end() {
                      res.end();
                    }
                  };

                  await targetHandler(mockedReq, mockedRes);
                } catch (err) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Local API Dev Middleware Error', message: err.message }));
                }
              });
            } else {
              next();
            }
          });
        }
      }
    ],
  }
})