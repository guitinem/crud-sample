import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validação básica
    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/users');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #004B81 0%, #0066A1 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 2,
          }}
        >
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="h1"
              color="primary"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              SPS Group
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sistema de Gerenciamento de Usuários
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="E-mail"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              autoComplete="email"
              autoFocus
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Senha"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              autoComplete="current-password"
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
            </Button>
          </form>

          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" align="center" display="block">
              <strong>Usuário padrão:</strong> admin@spsgroup.com.br
            </Typography>
            <Typography variant="caption" color="text.secondary" align="center" display="block">
              <strong>Senha:</strong> 1234
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default SignIn;
