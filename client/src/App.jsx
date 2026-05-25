import { useEffect, useState, useMemo } from 'react';
import { io } from 'socket.io-client';
import { Avatar, Box, Button, Divider, Paper, Stack, TextField, Typography } from '@mui/material';

const App = () => {
  const [formData, setFormData] = useState({room: '', message: '',});
  const [socketId, setSocketId] = useState('Connecting...');
  const [messages, setMessages] = useState([]);

  const socket = useMemo(() => io('http://localhost:3000'), []);

  useEffect(() => {
    socket.on('connect', () => {
      setSocketId(socket.id);
      console.log('Connected Successfully! User-ID:', socket.id);
    });

    // socket.on("Welcome", (message) => {
    //   console.log(message);
    // });

    socket.on('receive-message', (message) => {
      console.log(message);
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      socket.off('connect');
      socket.off('receive-message');
      socket.disconnect();
    };
  }, [socket]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    socket.emit('message', {
      room: formData.room.trim(),
      message: formData.message.trim(),
    });

    console.log("Sent");

    setFormData((currentData) => ({
      ...currentData,
      room: '',
      message: '',
    }));
  };

  return (
    <Box className="relative min-h-screen overflow-hidden bg-[#07111f] px-4 py-10 text-slate-100" id="root">
      <Box className="pointer-events-none absolute inset-0">
        <Box className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
        <Box className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" />
        <Box className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <Box className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.12),_transparent_30%)]" />
      </Box>

      <Box className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <Paper
          elevation={16}
          className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 shadow-2xl backdrop-blur-xl"
        >
          <Box className="relative overflow-hidden border border-white/5 bg-slate-950/40 p-6 sm:p-8 md:p-10">
            <Box className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-sky-500/10" />
            <Box className="relative z-10">
              <Box className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <Paper className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-sky-950/30">
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: '#06b6d4', width: 46, height: 46, fontSize: 18 }}>
                      {socketId === 'Connecting...' ? '?' : socketId.slice(0, 2).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="caption" className="tracking-[0.25em] text-slate-400">
                        CURRENT USER ID
                      </Typography>
                      <Typography className="mt-1 break-all font-mono text-sm text-white">
                        {socketId}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Box>

              <Box component="form" onSubmit={handleSubmit} className="grid gap-5">
                <Stack spacing={3}>
                  <TextField
                    label="Room"
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="filled"
                    placeholder="Enter room name"
                    inputProps={{
                      className: 'rounded-2xl bg-white/8 text-white',
                    }}
                    InputLabelProps={{ className: 'text-slate-300' }}
                  />

                  <TextField
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    fullWidth
                    multiline
                    minRows={6}
                    variant="filled"
                    placeholder="Write your message..."
                    inputProps={{
                      className: 'rounded-2xl bg-white/8 text-white',
                    }}
                    InputLabelProps={{ className: 'text-slate-300' }}
                  />
                </Stack>

                <Divider className="border-white/10" />

                <Box className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Typography className="text-sm text-slate-400">
                    Connected and ready to send.
                  </Typography>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    className="rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 px-7 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 hover:from-cyan-300 hover:to-sky-300"
                  >
                    Send
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default App
