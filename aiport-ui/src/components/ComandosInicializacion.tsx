import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Paper } from '@mui/material';
import TerminalIcon from '@mui/icons-material/Terminal';
import StorageIcon from '@mui/icons-material/Storage';
import WebIcon from '@mui/icons-material/Web';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';

interface ProjectCommand {
  name: string;
  category: 'API' | 'UI' | 'RN/RM';
  folder: string;
  icon: React.ReactNode;
  commands: string[];
  notes?: string;
}

const projects: ProjectCommand[] = [
  {
    name: 'Backend API (Django)',
    category: 'API',
    folder: 'airport_api',
    icon: <StorageIcon color="primary" />,
    commands: [
      'cd airport_api',
      '# (Opcional) python -m venv venv && .\\venv\\Scripts\\activate',
      'pip install django djangorestframework psycopg2-binary django-cors-headers python-dotenv pymongo',
      'python manage.py makemigrations',
      'python manage.py migrate',
      'python manage.py runserver 0.0.0.0:8000'
    ],
    notes: 'Puerto por defecto: http://127.0.0.1:8000. Requiere PostgreSQL y MongoDB activados.'
  },
  {
    name: 'Frontend Web UI (React + Vite)',
    category: 'UI',
    folder: 'aiport-ui',
    icon: <WebIcon color="secondary" />,
    commands: [
      'cd aiport-ui',
      'npm install',
      'npm run dev'
    ],
    notes: 'Puerto por defecto: http://localhost:5173'
  },
  {
    name: 'App Móvil React Native (Expo)',
    category: 'RN/RM',
    folder: 'airport-rn',
    icon: <PhoneIphoneIcon color="action" />,
    commands: [
      'cd airport-rn',
      'npm install',
      'npm start',
      '# Alternativas: npm run android | npm run web'
    ],
    notes: 'Asegúrate de tener la app Expo Go instalada en el dispositivo móvil.'
  }
];

export const ComandosInicializacion: React.FC = () => {
  return (
    <Box sx={{ padding: 3, maxWidth: 900, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
        🚀 Comandos de Inicialización de Proyectos
      </Typography>

      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Guía de inicio rápido para API (Backend), UI (Web) y RN/RM (Móvil)
      </Typography>

      {projects.map((proj) => (
        <Card key={proj.category} sx={{ mb: 3, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              {proj.icon}
              <Typography variant="h6" component="div">
                {proj.name}
              </Typography>
              <Chip label={`Carpeta: ${proj.folder}`} size="small" variant="outlined" />
            </Box>

            {proj.notes && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                ℹ️ {proj.notes}
              </Typography>
            )}

            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: '#1e1e1e',
                color: '#4af626',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                borderRadius: 1,
                overflowX: 'auto'
              }}
            >
              {proj.commands.map((cmd, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TerminalIcon sx={{ fontSize: 16, color: '#888' }} />
                  <span style={{ color: cmd.startsWith('#') ? '#888' : '#4af626' }}>{cmd}</span>
                </div>
              ))}
            </Paper>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ComandosInicializacion;
